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
                tbl_domain_payment_details(amount, 
                    currency, 
                    description, 
                    payment_method_id, 
                    payment_intent_id, 
                    customer_name, 
                    customer_address, 
                    customer_city, 
                    customer_postal_code, 
                    customer_country) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
                    RETURNING *`,
                [paymentDetails.amount,
                paymentDetails.currency,
                paymentDetails.description,
                paymentDetails.payment_method_id,
                paymentDetails.payment_intent_id,
                paymentDetails.customer_name,
                paymentDetails.customer_address,
                paymentDetails.customer_city,
                paymentDetails.customer_postal_code,
                paymentDetails.customer_country,]);
            return result.rows[0];

        } catch (error) {
            throw error;
        }
    }
    static async updatePaymentStatus(client: PoolClient, userId: string, status: string): Promise<void> {
        try {
            const result = await client.query(
                `
        UPDATE tbl_domain_payment_details
        SET payment_status = $1
        WHERE user_id = $2
      `,
                [status, userId]
            );
        } catch (error) {
            throw error;
        }

    }
}
export { PaymentRepository };
