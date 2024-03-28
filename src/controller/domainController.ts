import { Request, Response, NextFunction } from 'express';
import { DomainService } from '../services';


class DomainController {
  static async checkDomainAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await DomainService.checkDomainAvailability(req);
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }
  static async registerDomain(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await DomainService.registerDomain(req);
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export { DomainController };
