import { Request } from 'express';
import Stripe from 'stripe';
import { client, environment, release, transporter } from '../config';
import { AuthRepository, CartRepository, DomainRepository, PaymentRepository } from '../repository';
import { AuthenticatedRequest, PaymentDetails, PaymentIntent } from '../models';
import { customError, emailSenderTemplate, validation } from '../utility';
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
    static async createPaymentIntent(req: AuthenticatedRequest): Promise<PaymentIntent> {
        try {
            const user_id = '2'//req.user_id || '';
            const { amount, currency, description, customerName, customerAddress, customerCity, customerPostalCode, customerCountry } = req.body;
            //const valid =validation('payment',req.body)
            const paymentIntentOptions: Stripe.PaymentIntentCreateParams = {
                amount,
                currency,
                metadata: { user_id },
                description,
                shipping: {
                    name: customerName,
                    address: {
                        line1: customerAddress.line1,
                        line2: customerAddress.line2 || '',
                        city: customerCity,
                        postal_code: customerPostalCode,
                        country: customerCountry,
                    },
                },
                automatic_payment_methods: {
                    enabled: true,
                },
            };

            const paymentIntent = await stripe.paymentIntents.create(paymentIntentOptions);
            //console.log('intent',paymentIntent);

            return {
                status: 200,
                message: "Successfully Retrieved the Client Secret",
                clientSecret: paymentIntent.client_secret
            };
        } catch (error) {
            throw error;
        }
    }
    static async handleWebhookEvent(req: AuthenticatedRequest): Promise<void> {
        console.log('inside hook');

        const dbClient = await client();
        const sig = req.headers['stripe-signature'] || '';
        const webhookSecret = environment.STRIPE_WEBHOOK_SECRET || '';
        //console.log(webhookSecret,'secret');
        //console.log(sig,'sig');


        let event;
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

            //console.log('Event:', event);
            //console.log('Request:', req); 
        } catch (err) {
            console.error('Webhook signature verification failed.', err);
            throw err;
        }
        console.log(event);

        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const user_id = paymentIntent.metadata.user_id || '';
                //console.log(user_id,'useriiddidid');

                const paymentDetails: PaymentDetails = {
                    amount: paymentIntent.amount,
                    currency: paymentIntent.currency,
                    description: paymentIntent.description || '',
                    payment_method_id: paymentIntent.payment_method as string,
                    payment_intent_id: paymentIntent.id,
                    customer_name: paymentIntent.shipping?.name || '',
                    customer_address1: paymentIntent.shipping?.address?.line1 || '',
                    customer_address2: paymentIntent.shipping?.address?.line2 || '',
                    customer_city: paymentIntent.shipping?.address?.city || '',
                    customer_postal_code: paymentIntent.shipping?.address?.postal_code || '',
                    customer_country: paymentIntent.shipping?.address?.country || '',
                    status: 'completed'
                };
                //console.log(paymentDetails.user_id,'userididid');

                try {
                    const dbResult = await PaymentRepository.savePaymentDetails(dbClient, user_id, paymentDetails);
                    //const status=await DomainRepository.updatePaymentStatus(dbClient, paymentDetails.description, 'success');
                    //console.log('Payment details stored:', dbResult);
                    console.log(dbResult, "dbdbdb");

                    const content = 'Payment Successful'
                    const emailData = {
                        amount: paymentDetails.amount,
                        currency: paymentDetails.currency
                    };
                    const user = '2'//paymentDetails.user_id
                    const userResult = await AuthRepository.findUserById(dbClient, user);
                    const userMail = userResult.rows[0];
                    console.log(userMail, 'usermail');
                    console.log(emailData, 'email');

                    const mailOptions = emailSenderTemplate(
                        userMail.email,
                        content,
                        "paymentSuccess.ejs",
                        emailData
                    );
                    await transporter.sendMail(mailOptions);
                } catch (err) {
                    console.error('Error saving payment details:', err);
                    throw err;
                }
                break;

            case 'payment_intent.payment_failed':
                const failedPaymentIntent = event.data.object;
                const failedPaymentId = failedPaymentIntent.id;
                try {
                    await PaymentRepository.updatePaymentStatus(dbClient, failedPaymentId, 'failed');
                } catch (err) {
                    console.error('Error updating payment status:', err);
                    throw err;
                }
                break;
            case 'charge.updated':
                const updatedCharge = event.data.object as Stripe.Charge;
                const receiptUrl = updatedCharge.receipt_url;
                console.log('Receipt URL:', receiptUrl);
                break;

            default:
                console.warn(`Unhandled event type: ${event.type}`);
        }

        release(dbClient);
    }
    static async getPaymentHistory(req: AuthenticatedRequest): Promise<PaymentDetails[]> {
        //console.log('req:', req);
        try {
            const user_id = req.user_id || '';
            //console.log(user_id);

            const dbClient = await client();
            const paymentHistory = await PaymentRepository.getPaymentHistory(dbClient, user_id);
            return paymentHistory;
        } catch (error) {
            throw error;
        }
    }
}
export { PaymentService };
