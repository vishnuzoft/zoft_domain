import { PoolClient, QueryResult } from "pg";
import { DomainRegister, DomainResponse, } from "../models";
import { NamesiloAPI, domainExpirationDate, findStatus } from "../utility";

class DomainRepository {
    static async registerDomain(
        client: PoolClient, 
        user_id: string, 
        payment_intent_id: string, 
        register: DomainRegister, 
        payment_status: string, 
        expirationDate: Date, 
        status: string
    ): Promise<QueryResult> {
        try {
            const result = await client.query(
                `INSERT INTO tbl_domain_registrations (
                    domain, 
                    years, 
                    auto_renew, 
                    user_id, 
                    expiration_date,
                    payment_intent_id,
                    payment_status,
                    status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
                RETURNING *`,
                [
                    register.domain, 
                    register.years, 
                    register.auto_renew, 
                    user_id, 
                    expirationDate,
                    payment_intent_id,
                    payment_status,
                    status
                ]
            );
    
            console.log(result);
            return result;
        } catch (error) {
            throw error;
        }
    }
    
    static async renewDomain(client: PoolClient, domain: string, newYears: number): Promise<void> {
        try {
            const result = await client.query(
                "UPDATE tbl_domain_registrations SET years = $1 WHERE domain = $2",
                [newYears, domain]
            );

        } catch (error) {
            throw error;
        }
    }

    static async getAllDomains(client: PoolClient): Promise<DomainResponse[]> {
        try {
            const result = await client.query("SELECT domain, created_at, payment_status, auto_renew, expiration_date FROM tbl_domain_registrations WHERE payment_status='success'");
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
    static async getDomainById(client: PoolClient, domainId: string): Promise<DomainResponse> {
        try {

            const result = await client.query(
                "SELECT domain, years, payment_id, auto_renew FROM tbl_domain_registrations WHERE id = $1",
                [domainId]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    static async getPaymentIntentByDomain(client: PoolClient, domain: string): Promise<any> {
        try {
            const result = await client.query(
                `SELECT * FROM tbl_payment_intent WHERE domain = $1`,
                [domain]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    static async updatePaymentStatus(client: PoolClient, paymentIntentId: string, status: string): Promise<void> {
        try {
            await client.query(
                `UPDATE tbl_payment_intent SET payment_status = $1 WHERE payment_intent_id = $2`,
                [status, paymentIntentId]
            );
        } catch (error) {
            throw error;
        }
    }

}
export { DomainRepository }