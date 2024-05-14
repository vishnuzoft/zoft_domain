import { Request, Response, NextFunction } from 'express';
import { MXToolboxService } from '../services';


export class MXToolboxController {
  static async performDNSLookup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const argument = req.query.argument as string;
      const response = await MXToolboxService.performDNSLookup(argument);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
