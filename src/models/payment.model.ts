export interface PaymentDetails {
    user_id:string;
    amount: number;
    currency:string;
    description:string;
    payment_method_id:string;
    payment_intent_id:string;
    customer_name:string;
    customer_address:string;
    customer_city:string;
    customer_postal_code:string;
    customer_country:string;
}
export interface PaymentIntent{
    status:number;
    message:string;
    clientSecret:string|null;
}