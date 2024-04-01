import { Request, Response, NextFunction } from 'express';
import { DomainService } from '../services';


class DomainController {
  static async checkDomainAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = await DomainService.checkDomainAvailability(req);
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
}

export { DomainController };
