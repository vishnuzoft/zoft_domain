import { Request, Response, NextFunction } from 'express';
import { DomainService } from '../services';
import { DomainReq } from '../models';


class DomainController {
  static async checkDomainAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = await DomainService.checkDomainAvailability(req);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
  static async checkTransferAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = await DomainService.checkTransferAvailability(req);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
  static async registerDomain(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = await DomainService.registerDomain(req);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
  
//   static async registerBulkDomains(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//         const response = await DomainService.registerBulkDomains(req);
//         res.json(response);
//     } catch (error) {
//         next(error);
//     }
// }

  static async renewDomain(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = await DomainService.renewDomain(req);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getAllDomains(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = await DomainService.getAllDomains(req);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
  static async getDomainById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = await DomainService.getDomainById(req);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
  static async getDomainInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = await DomainService.getDomainInfo(req);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export { DomainController };
