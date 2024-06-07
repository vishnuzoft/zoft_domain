import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services';

class PaymentController {
    // static async createPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     try {
    //         const session = await PaymentService.createPayment(req);
    //         res.json(session);
    //     } catch (error) {
    //         next(error);
    //     }
    // }
    // static async handleWebhookEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     try {
    //       const response=await PaymentService.handleWebhookEvent(req);
    //       res.json(response);
    //     } catch (error) {
    //       next(error);
    //     }
    //   }
   static async createPaymentIntent(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await PaymentService.createPaymentIntent(req);
            res.json(response);
        } catch (error) {
            next(error);
        }
    }

}

export { PaymentController };
