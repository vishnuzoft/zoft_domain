import { client, release } from '../config';
import { NamesiloAPI, customError } from '../utility';
import { Request, Response } from 'express';
import { AuthenticatedRequest, DomainRegister, DomainResponse } from '../models';
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
  static async registerDomain(req: AuthenticatedRequest): Promise<DomainResponse> {
    const dbClient = await client();
    try {

      const domain = req.query.domain as string;
      const years = req.query.years as string;
      console.log(domain, years);
      const user_id: string = req.user_id as string;
      const paymentId = req.query.paymentId as string;
      const autoRenew = req.query.autoRenew === 'true';
      console.log(paymentId, autoRenew);
      console.log('userrrrrr', user_id);

      const registerData: DomainRegister = { domain, years, paymentId, autoRenew };

      console.log("regdata", registerData);

      const registrationResult = await NamesiloAPI.registerDomain(registerData);
      //const dbResult = await DomainRepository.registerDomain(dbClient, user_id, registerData);
      if (registrationResult.namesilo.reply[0].code[0] === '300') {
        const dbResult = await DomainRepository.registerDomain(dbClient, user_id, registerData);
        console.log("dbresult", dbResult);
      }
      console.log("regresult: ", registrationResult);
      //console.log("dbresult", dbResult);
      console.log();


      return registrationResult;
    } catch (error) {
      throw error;
    } finally {
      release(dbClient);
    }
  }
  static async getAllDomains(req: Request): Promise<any> {
    const dbClient = await client()
    try {
      const domains = await DomainRepository.getAllDomains(dbClient);
      return domains;
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

}
export { DomainService };
