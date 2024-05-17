import { client, environment, release } from '../config';
import { NamesiloAPI, calculateAmount, customError } from '../utility';
import { Request, Response } from 'express';
import { AuthenticatedRequest, DomainRegister, DomainResponse, GetDomains, PaymentDetails } from '../models';
import { DomainRepository } from '../repository';


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

      const auto_renew = req.query.auto_renew === '1'
console.log(auto_renew);

      console.log('userrrrrr', user_id);

      const registerData: DomainRegister = { domain, years, auto_renew };

      console.log("regdata", registerData);

      const registrationResult = await NamesiloAPI.registerDomain(registerData);

      //const dbResult = await DomainRepository.registerDomain(dbClient, user_id, registerData);
      if (registrationResult.namesilo.reply[0].code[0] === '300') {
        const dbResult = await DomainRepository.registerDomain(dbClient, user_id, registerData);
        console.log("dbresult", dbResult);
      }
    
      console.log("regresult: ", registrationResult);
      //console.log("dbresult", dbResult);
// Validate input
// if (!domain || !years || years < 1 || years > 10) {
//   throw new Error('Invalid input');
// }
      return registrationResult;
    } catch (error) {
      throw error;
    } finally {
      release(dbClient);
    }
  }
  static async renewDomain(req: Request): Promise<DomainResponse> {
    const dbClient = await client();
    try {
      const domainId = req.query.domainId as string;
      const years = parseInt(req.query.years as string);

      const existingDomain = await DomainRepository.getDomainById(dbClient, domainId);
      if (!existingDomain) {
        throw new customError("Domain not found", 404);
      }
      const domain = existingDomain.domain;

      const renewalResult = await NamesiloAPI.renewDomain(domain, years);

      if (renewalResult.namesilo.reply[0].code[0] === '300') {
        const result = await DomainRepository.renewDomain(dbClient, domain, years);
      }

      return renewalResult;
    } catch (error) {
      throw error;
    } finally {
      release(dbClient)
    }
  }

  static async getAllDomains(req: Request): Promise<GetDomains> {
    const dbClient = await client()
    try {
      const domains = await DomainRepository.getAllDomains(dbClient);
      return {
        status: 200,
        message: 'Domains retrieved successfully',
        data: domains
      };
    } catch (error) {
      throw error
    } finally {
      release(dbClient)
    }
  }
  static async getDomainById(req: Request): Promise<DomainResponse> {

    const dbClient = await client();
    try {
      const domainId = req.params.id;
      const domain = await DomainRepository.getDomainById(dbClient, domainId);
      if (!domain) {
        throw new customError("Domain not found", 404);
      }
      return domain;
    } catch (error) {
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
