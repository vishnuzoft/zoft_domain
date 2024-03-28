import axios from 'axios';
import { client, environment, release } from '../config';
import { NamesiloAPI, parseResponseData } from '../utility';
import { Request, Response } from 'express';
import { DomainRegister, DomainResponse } from '../models';
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
  static async registerDomain(req: Request): Promise<DomainResponse> {
    const dbClient = await client();
    try {

      const domain = req.query.domain as string;
      const years = req.query.years as string;
      console.log(domain, years);

      const paymentId = req.query.paymentId as string;
      const autoRenew = req.query.autoRenew === 'true';
      console.log(paymentId, autoRenew);

      const registerData: DomainRegister = { domain, years, paymentId, autoRenew };

      console.log("regdata", registerData);

      
      const registrationResult = await NamesiloAPI.registerDomain(registerData);
      const dbResult = await DomainRepository.registerDomain(dbClient, registerData);
      console.log("regresult: ", registrationResult);
      console.log("dbresult", dbResult);

      return registrationResult;
    } catch (error) {
      throw error;
    } finally {
      release(dbClient);
    }
  }
}
export { DomainService };
