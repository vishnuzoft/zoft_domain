import { Request } from 'express';
import Stripe from 'stripe';
import { client, environment, release } from '../config';
import { CartRepository, PaymentRepository } from '../repository';
import { AuthenticatedRequest } from '../models';
import { customError } from '../utility';

const stripe = new Stripe(environment.STRIPE_SECRET_KEY || '');

class PaymentService {
    static async createPayment(req: AuthenticatedRequest): Promise<Stripe.Checkout.Session> {
        const dbClient = await client();
        try {
            const user_id = parseInt(req.user_id || '')
            const { orderItemId } = req.body;
console.log(orderItemId);
console.log(user_id);  


            const orderItem = await CartRepository.getOrderItemById(dbClient, orderItemId);
            if (!orderItem) {
                throw new customError('Order item not found', 404);
            }
            console.log(orderItem);
            const amount = Math.round(parseFloat(orderItem.price));

            const sessionOptions: Stripe.Checkout.SessionCreateParams = {
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: orderItem.domain,
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: 'http://google.com',
                cancel_url: 'http://cricbuzz.com',
            };
            console.log(sessionOptions);

            const session = await stripe.checkout.sessions.create(sessionOptions);

            if (!session.id) {
                throw new customError('Session ID is null', 400);
            }

            const paymentId = await PaymentRepository.createPayment(dbClient, user_id, orderItemId, amount);
            console.log(paymentId);

            return session;
        } catch (error) {
            throw error;
        } finally {
            release(dbClient);
        }
    }
    static async handleWebhookEvent(req:any): Promise<void> {
        const dbClient = await client();
        const sig = req.headers[environment.STRIPE_WEBHOOK_SECRET ||''];
        let event;
        const webhookSecret='we_1P9PDzSJUBUBQNAilEcvHFKj'
        try {
          event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret); 
        } catch (err) {
          console.error('Webhook signature verification failed.', err);
          throw new Error('Webhook signature verification failed.');
        }
    
        
        switch (event.type) {
          case 'checkout.session.completed':
            const session = event.data.object;
            const paymentId = parseInt(session.client_reference_id||'')
            await PaymentRepository.updatePaymentStatus(dbClient,paymentId,'success');
            break;
          case 'checkout.session.async_payment_failed':
            const failedSession = event.data.object;
            const failedPaymentId = parseInt(failedSession.client_reference_id||'');
            await PaymentRepository.updatePaymentStatus(dbClient,failedPaymentId, 'failed');
            break;
          
        }
      }
}

export { PaymentService };
