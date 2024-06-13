import { PoolClient } from 'pg';
import { PaymentDetails } from '../models';

class PaymentRepository {
    // static async createPayment(client: PoolClient, userId: number, orderItemId: number, amount: number): Promise<number> {
    //     try {

    //         const result = await client.query(
    //             'INSERT INTO tbl_domain_payments (user_id, order_item_id, amount, payment_status) VALUES ($1, $2, $3, $4) RETURNING payment_id',
    //             [userId, orderItemId, amount, 'pending']
    //         );
    //         return result.rows[0].payment_id;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    // static async updatePaymentStatus(client: PoolClient, paymentId: number, status: string): Promise<void> {
    //     try {
    //       await client.query(
    //         'UPDATE tbl_domain_payments SET payment_status = $1 WHERE payment_id = $2',
    //         [status, paymentId]
    //       );
    //     } catch (error) {
    //       throw error;
    //     }
    //   }

    static async savePaymentDetails(client: PoolClient, user_id: string, paymentDetails: PaymentDetails): Promise<void> {
        try {
            const result = await client.query(
                `INSERT INTO 
                tbl_domain_payment_details(user_id,
                    amount, 
                    currency, 
                    description, 
                    payment_method_id, 
                    payment_intent_id, 
                    customer_name, 
                    customer_address1, 
            customer_address2,  
                    customer_city, 
                    customer_postal_code, 
                    customer_country,
                    status) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11,$12,$13) 
                    RETURNING *`,
                [user_id,
                    paymentDetails.amount,
                    paymentDetails.currency,
                    paymentDetails.description,
                    paymentDetails.payment_method_id,
                    paymentDetails.payment_intent_id,
                    paymentDetails.customer_name,
                    paymentDetails.customer_address1,
                    paymentDetails.customer_address2,
                    paymentDetails.customer_city,
                    paymentDetails.customer_postal_code,
                    paymentDetails.customer_country,
                    paymentDetails.status]);
            return result.rows[0];

        } catch (error) {
            throw error;
        }
    }
    static async updatePaymentStatus(client: PoolClient, paymentId: string, status: string): Promise<void> {
        try {
            await client.query(
                `
                UPDATE tbl_domain_payment_details
                SET payment_status = $1
                WHERE payment_intent_id = $2
                `,
                [status, paymentId]
            );
        } catch (error) {
            throw error;
        }
    }
    static async getPaymentHistory(client: PoolClient, user_id: string): Promise<PaymentDetails[]> {
        try {
            const result = await client.query(
                `SELECT id, user_id, amount, currency, description, customer_name, customer_address1, customer_address2, 
                    customer_city, customer_postal_code, customer_country, status, created_at, updated_at 
            FROM tbl_domain_payment_details 
            WHERE user_id = $1`,
                [user_id]
            );
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}
export { PaymentRepository };
