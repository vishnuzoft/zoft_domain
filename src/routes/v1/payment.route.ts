import express from 'express';
import { PaymentController } from '../../controller';
import { Authmiddleware } from '../../middlewares';



const router = express.Router();

// router.post('/create-checkout-session',Authmiddleware, PaymentController.createPayment);
// router.post('/webhook',PaymentController.handleWebhookEvent);
router.post('/create-payment-intent', PaymentController.createPaymentIntent);
router.post('/confirm-payment', Authmiddleware, PaymentController.confirmPayment);

export { router as PaymentRoute };
