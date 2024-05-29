import { Request } from 'express';
import Stripe from 'stripe';
import { client, environment, release } from '../config';
import { CartRepository, PaymentRepository } from '../repository';
import { AuthenticatedRequest } from '../models';
import { customError } from '../utility';
import { error } from 'ajv/dist/vocabularies/applicator/dependencies';

const stripe = new Stripe(environment.STRIPE_SECRET_KEY || '');

interface CustomPaymentIntentCreateParams extends Stripe.PaymentIntentCreateParams {
    return_url?: string;
}


class PaymentService {
//     static async createPayment(req: AuthenticatedRequest): Promise<Stripe.Checkout.Session> {
//         const dbClient = await client();
//         try {
//             const user_id = parseInt(req.user_id || '')
//             const { orderItemId } = req.body;
// console.log(orderItemId);
// console.log(user_id);  


//             const orderItem = await CartRepository.getOrderItemById(dbClient, orderItemId);
//             if (!orderItem) {
//                 throw new customError('Order item not found', 404);
//             }
//             console.log(orderItem);
//             const amount = Math.round(parseFloat(orderItem.price));

//             const sessionOptions: Stripe.Checkout.SessionCreateParams = {
//                 payment_method_types: ['card'],
//                 line_items: [{
//                     price_data: {
//                         currency: 'usd',
//                         product_data: {
//                             name: orderItem.domain,
//                         },
//                         unit_amount: amount * 100,
//                     },
//                     quantity: 1,
//                 }],
//                 mode: 'payment',
//                 success_url: 'http://google.com',
//                 cancel_url: 'http://cricbuzz.com',
//             };
//             console.log(sessionOptions);

//             const session = await stripe.checkout.sessions.create(sessionOptions);

//             if (!session.id) {
//                 throw new customError('Session ID is null', 400);
//             }

//             const paymentId = await PaymentRepository.createPayment(dbClient, user_id, orderItemId, amount);
//             console.log(paymentId);

//             return session;
//         } catch (error) {
//             throw error;
//         } finally {
//             release(dbClient);
//         }
//     }
//     static async handleWebhookEvent(req:any): Promise<void> {
//         const dbClient = await client();
//         const sig = req.headers[environment.STRIPE_WEBHOOK_SECRET ||''];
//         let event;
//         const webhookSecret='we_1P9PDzSJUBUBQNAilEcvHFKj'
//         try {
//           event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret); 
//         } catch (err) {
//           console.error('Webhook signature verification failed.', err);
//           throw new Error('Webhook signature verification failed.');
//         }
    
        
//         switch (event.type) {
//           case 'checkout.session.completed':
//             const session = event.data.object;
//             const paymentId = parseInt(session.client_reference_id||'')
//             await PaymentRepository.updatePaymentStatus(dbClient,paymentId,'success');
//             break;
//           case 'checkout.session.async_payment_failed':
//             const failedSession = event.data.object;
//             const failedPaymentId = parseInt(failedSession.client_reference_id||'');
//             await PaymentRepository.updatePaymentStatus(dbClient,failedPaymentId, 'failed');
//             break;
          
//         }
//       }
static async createPaymentIntent(req: AuthenticatedRequest) {
    const { amount, currency, description, customerName, customerAddress, customerCity, customerPostalCode, customerCountry } = req.body;
    const user_id = req.user_id ||'';

    // if (currency !== 'inr' && customerCountry.toLowerCase() === 'in') {
    //     throw new Error('Non-INR transactions in India should have shipping/billing address outside India.');
    // }
    try {
        const paymentIntentOptions: Stripe.PaymentIntentCreateParams = {
            amount,
            currency,
            metadata: { user_id },
            description,
            shipping: {
                name: customerName,
                address: {
                    line1: customerAddress,
                    city: customerCity,
                    postal_code: customerPostalCode,
                    country: customerCountry,
                },
              },
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'always',
            },
        };
    
        // const paymentIntent = await stripe.paymentIntents.create({
        //     amount,
        //     currency,
        //     metadata: { user_id },
        //     payment_method_types: ['card'],
        // });
        const paymentIntent = await stripe.paymentIntents.create(paymentIntentOptions);
        return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
        throw error
    }
   
}

static async confirmPayment(req: AuthenticatedRequest) {
    const { paymentIntentId, paymentMethodId,return_url } = req.body;
    const user_id = req.user_id || '';
console.log(req.body);

    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
            payment_method: paymentMethodId,
            return_url:return_url
        });
console.log(paymentIntent,'intent');
console.log(paymentIntentId,paymentMethodId,return_url)

        if (paymentIntent.status === 'succeeded') {
            const dbclient = await client();
            await PaymentRepository.savePayment(dbclient, paymentIntent.id, paymentIntent.amount, paymentIntent.currency, user_id);
            return { paymentId: paymentIntent.id };
        } else {
            throw new Error('Payment failed');
        }
    } catch (error) {
        console.error('Payment confirmation error:', error);
        throw error;
    }   
}
}
export { PaymentService };
