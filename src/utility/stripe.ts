import Stripe from 'stripe';
import { environment } from '../config';

const stripe = new Stripe(environment.STRIPE_SECRET_KEY||'');

export const createPaymentIntent = async (amount: number, currency: string) => {
  return await stripe.paymentIntents.create({
    amount,
    currency,
  });
};

export const confirmPaymentIntent = async (paymentIntentId: string, paymentMethodId: string) => {
  return await stripe.paymentIntents.confirm(paymentIntentId, {
    payment_method: paymentMethodId,
  });
};
