import { Request } from 'express';
import Stripe from 'stripe';
import { client, environment, release, transporter } from '../config';
import { AuthRepository, CartRepository, DomainRepository, PaymentRepository } from '../repository';
import { AuthenticatedRequest, PaymentDetails, PaymentIntent } from '../models';
import { customError, emailSenderTemplate, validation } from '../utility';

const stripe = new Stripe(environment.STRIPE_SECRET_KEY || '');

class PaymentService {

    static async createPaymentIntent(req: AuthenticatedRequest): Promise<PaymentIntent> {
        try {
            const user_id = req.user_id || '2';
            // console.log("Types:", {
            //     amount: typeof req.body.amount,
            //     currency: typeof req.body.currency,
            //     description: typeof req.body.description
            // });
            // if (typeof req.body.amount === 'string') {
            //     req.body.amount = parseInt(req.body.amount, 10);
            // }
            const { amount, currency, description } = req.body;
            console.log(amount, currency, description);
            console.log(req.body, 'bodydufdsfudsfudsfdsu');
            const amountInCents = Math.round(parseFloat(amount) * 100);
            const valid = validation('payment', req.body)


            const paymentIntentOptions: Stripe.PaymentIntentCreateParams = {
                amount: amountInCents,
                currency,
                description,
                metadata: { user_id },
                automatic_payment_methods: {
                    enabled: true,
                },
            };
            // const paymentIntentOptions: Stripe.PaymentIntentCreateParams = {
            //     amount,
            //     currency,
            //     metadata: { user_id },
            //     description,
            //     shipping: {
            //         name: customerName,
            //         address: {
            //             line1: customerAddress.line1,
            //             line2: customerAddress.line2 || '',
            //             city: customerCity,
            //             postal_code: customerPostalCode,
            //             country: customerCountry,
            //         },
            //     },
            //     automatic_payment_methods: {
            //         enabled: true,
            //     },
            // };
            

            const paymentIntent = await stripe.paymentIntents.create(paymentIntentOptions);
            console.log('intent', paymentIntent);
            //console.log(paymentIntent,"intent");

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
                console.log(paymentIntent.metadata.user_id, 'useriiddidid');
                let paymentMethodDetails;
                if (paymentIntent.payment_method) {
                    paymentMethodDetails = await stripe.paymentMethods.retrieve(paymentIntent.payment_method as string);
                }
                //console.log(paymentMethodDetails);
                //const amount=paymentIntent.amount.toString()
                console.log(typeof paymentIntent.amount);

                const amountInDollars = (paymentIntent.amount / 100).toFixed(2);
                const paymentDetails: PaymentDetails = {
                    amount: amountInDollars,
                    currency: paymentIntent.currency,
                    description: paymentIntent.description || '',
                    payment_method_id: paymentIntent.payment_method as string,
                    payment_intent_id: paymentIntent.id,
                    customer_name: paymentMethodDetails?.billing_details?.name || '',
                    customer_address1: paymentMethodDetails?.billing_details?.address?.line1 || '',
                    customer_address2: paymentMethodDetails?.billing_details?.address?.line2 || '',
                    customer_city: paymentMethodDetails?.billing_details?.address?.city || '',
                    customer_postal_code: paymentMethodDetails?.billing_details?.address?.postal_code || '',
                    customer_country: paymentMethodDetails?.billing_details?.address?.country || '',
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
                    //console.log(amount);

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
                try {
                    const updatedCharge = event.data.object as Stripe.Charge;
                    // const user_id = updatedCharge.metadata.user_id || '2'
                    // const userResult = await AuthRepository.findUserById(dbClient, user_id);
                    // const userMail = userResult.rows[0].email;
                    // console.log(userMail, 'usermail');

                    const receiptUrl = updatedCharge.receipt_url;
                    console.log('Receipt URL:', receiptUrl);
                    //const user = '2'//paymentDetails.user_id


                } catch (error) {
                    throw error
                }

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
            console.log(paymentHistory,'history');
            
            return paymentHistory;
        } catch (error) {
            throw error;
        }
    }
}
export { PaymentService };
