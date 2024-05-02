import { PoolClient } from 'pg';

class PaymentRepository {
    static async createPayment(client: PoolClient, userId: number, orderItemId: number, amount: number): Promise<number> {
        try {
            
            const result = await client.query(
                'INSERT INTO tbl_domain_payments (user_id, order_item_id, amount, payment_status) VALUES ($1, $2, $3, $4) RETURNING payment_id',
                [userId, orderItemId, amount, 'pending']
            );
            return result.rows[0].payment_id;
        } catch (error) {
            throw error;
        }
    }
    static async updatePaymentStatus(client: PoolClient, paymentId: number, status: string): Promise<void> {
        try {
          await client.query(
            'UPDATE tbl_domain_payments SET payment_status = $1 WHERE payment_id = $2',
            [status, paymentId]
          );
        } catch (error) {
          throw error;
        }
      }
}

export { PaymentRepository };
