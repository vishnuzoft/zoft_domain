import { begin, client, commit, environment, release, rollback, transporter } from '../config';
import { NamesiloAPI, calculatePrice, customError, domainExpirationDate, emailSenderTemplate, findStatus, processRegistrationsInBatches } from '../utility';
import { Request, Response } from 'express';
import { AuthenticatedRequest, DomainRegister, DomainResponse, GetDomains, PaymentDetails } from '../models';
import { AuthRepository, DomainRepository } from '../repository';
import Stripe from 'stripe';
import { PaymentService } from '../services';

const stripe = new Stripe(environment.STRIPE_SECRET_KEY || ''
);

class DomainService {
  static async checkDomainAvailability(req: Request): Promise<Response> {
    try {

      const search = req.query.search as string;
      const domains = Array.isArray(search) ? search : [search];
      const availabilityData = await NamesiloAPI.checkDomainAvailability(domains);

      return availabilityData;
    } catch (error) {
      throw error;
    }
  }
  static async checkTransferAvailability(req: Request): Promise<Response> {
    try {
      const search = req.query.search as string;
      const domains = Array.isArray(search) ? search : [search];
      const response = await NamesiloAPI.checkTransferAvailability(domains);
      return response;
    } catch (error) {
      throw error;
    }
  }
  static async registerDomain(req: AuthenticatedRequest): Promise<DomainResponse> {
    const dbClient = await client();

    try {
      const domain = req.query.domain as string;
      const years = req.query.years as string;
      const user_id: string = req.user_id as string;
      const auto_renew = req.query.auto_renew === '1';
console.log(domain,'domain');

      console.log(auto_renew);
      console.log('userrrrrr', user_id);
      const paymentIntentResult = await DomainRepository.getPaymentIntentByDomain(dbClient, domain);
      console.log('intentdomain',paymentIntentResult.domain,'reqdomain',domain);

      console.log('Payment Intent Domain:', paymentIntentResult.domain);
      console.log('Request Domain:', domain);

      if (paymentIntentResult.domain !== domain) {
        throw new Error('Domain not match');
      }

      console.log(paymentIntentResult, 'intent result..............');

      const registerData: DomainRegister = { domain, years, auto_renew };
console.log(registerData,'registerdata');

      console.log("regdata", registerData);
      const expirationDate = domainExpirationDate(Number(years));
      const status = findStatus(new Date(), expirationDate);

      const registrationResult = await NamesiloAPI.registerDomain(registerData);
      
      
        const dbResult = await DomainRepository.registerDomain(dbClient, user_id, paymentIntentResult.payment_intent_id, registerData, 'success', expirationDate,
          status);
        console.log("dbresult", dbResult);
      
      const emailData=dbResult.rows[0];
      console.log(emailData,'emaildata');
      
      const content="Domain Registration Successful";
      const user=await AuthRepository.findUserById(dbClient,user_id)
      const userResult=user.rows[0];
      const mailOptions = emailSenderTemplate(
                 userResult.email,
                 content,
                 "domainRegister.ejs",
                 emailData
               );
               await transporter.sendMail(mailOptions); 

      console.log("regresult: ", registrationResult);

      return registrationResult;
    } catch (error) {
      throw error;
    } finally {
      release(dbClient);
    }
  }

  // static async registerBulkDomains(req: AuthenticatedRequest): Promise<DomainResponse[]> {
  //   const dbclient=await client();
  //   const user_id=req.user_id ||''

  //   try {
  //       const registrations: DomainRegister[] = req.body.registrations;
  //       console.log(req.body.registrations,"req.body.registrations");

  //       const registrationPromises = registrations.map(registerData =>
  //           NamesiloAPI.registerDomain(registerData)
  //       );
  //       const registrationResults: any = await Promise.all(registrationPromises);
  //       console.log(registrationPromises,"promises");
  //       console.log(registrationResults,"results");

  //       return registrationResults;
  //   } catch (error) {
  //       throw error;
  //   }
  // }


  // static async registerBulkDomains(req: AuthenticatedRequest): Promise<DomainResponse[]> {
  //   const dbclient = await client();
  //   const user_id = req.user_id || ''
  //   const { registrations } = req.body;
  //   const paymentIntentId = req.body.payment_intent_id;
  //   console.log(paymentIntentId,'id');

  //   try {
  //     //const paymentId = await PaymentService.confirmPayment(req);
  //     //console.log(paymentId);


  //     // const registrations: DomainRegister[] = req.body.registrations;
  //     // console.log(req.body.registrations,"req.body.registrations");
  //     const registrationsWithPaymentId = registrations.map((registration: DomainRegister) => ({
  //       ...registration
  //     }));

  //     const registrationResults = await processRegistrationsInBatches(registrationsWithPaymentId);
  //     console.log(registrationResults, "results");

  //     for (const registration of registrations) {
  //       const expirationDate = domainExpirationDate(registration.years);
  //       const status = findStatus(new Date(), expirationDate);

  //       console.log(registrations, "registration");
  //       await begin(dbclient);
  //       const dbResult = await DomainRepository.registerDomain(dbclient, user_id, {
  //         ...registration,
  //         payment_intent_id: paymentIntentId,
  //         payment_status:'success',
  //         expirationDate,
  //         status,
  //       });
  //       console.log("dbResult", dbResult.rows[0]);

  //       const emailData = {
  //         domains: dbResult.rows[0],
  //         user_id
  //       };
  //       const content = "Domain Registration Successful";
  //       const userResult = await AuthRepository.findUserById(dbclient, user_id);
  //       const user = userResult.rows[0];

  //       const mailOptions = emailSenderTemplate(
  //         user.email,
  //         content,
  //         "domainRegister.ejs",
  //         emailData
  //       );
  //       await transporter.sendMail(mailOptions);
  //       //console.log(dbResult,'dbbbbbbbbbb');

  //     }
  //     await commit(dbclient);
  //     return registrationResults;
  //   } catch (error) {
  //     await rollback(dbclient);
  //     throw error;
  //   }
  // }


  static async renewDomain(req: Request): Promise<DomainResponse> {
    const dbClient = await client();
    try {
      const domainId = req.query.domainId as string;
      const years = parseInt(req.query.years as string);
      await begin(dbClient);
      const existingDomain = await DomainRepository.getDomainById(dbClient, domainId);
      if (!existingDomain) {
        throw new customError("Domain not found", 404);
      }
      const domain = existingDomain.domain;

      const renewalResult = await NamesiloAPI.renewDomain(domain, years);

      if (renewalResult.namesilo.reply[0].code[0] === '300') {
        const result = await DomainRepository.renewDomain(dbClient, domain, years);
      }
      await commit(dbClient);
      return renewalResult;
    } catch (error) {
      await rollback(dbClient);
      throw error;
    } finally {
      release(dbClient)
    }
  }

  static async getAllDomains(req: Request): Promise<GetDomains> {
    const dbClient = await client()
    try {
      await begin(dbClient);
      const domains = await DomainRepository.getAllDomains(dbClient);
      return {
        status: 200,
        message: 'Domains retrieved successfully',
        data: domains
      };
    } catch (error) {
      await rollback(dbClient);
      throw error
    } finally {
      release(dbClient)
    }
  }
  static async getDomainById(req: Request): Promise<DomainResponse> {

    const dbClient = await client();
    try {
      const domainId = req.params.id;
      await begin(dbClient);
      const domain = await DomainRepository.getDomainById(dbClient, domainId);
      if (!domain) {
        throw new customError("Domain not found", 404);
      }
      await commit(dbClient);
      return domain;
    } catch (error) {
      await rollback(dbClient);
      throw error;
    } finally {
      release(dbClient);
    }
  }
  static async getDomainInfo(req: Request): Promise<Response> {
    try {
      const search = req.query.search as string;
      const response = await NamesiloAPI.getDomainInfo(search);
      return response;
    } catch (error) {
      throw error
    }
  }
}
export { DomainService };
