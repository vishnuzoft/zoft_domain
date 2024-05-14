import { PoolClient } from "pg";
import { DomainRegister, DomainResponse,} from "../models";
import { NamesiloAPI, domainExpirationDate, findStatus } from "../utility";

class DomainRepository {
    static async registerDomain(client: PoolClient, user_id: string, register: DomainRegister): Promise<DomainResponse> {

        try {
            const apiResponse = await NamesiloAPI.registerDomain(register);
            const expirationDate = domainExpirationDate(parseInt(register.years));
            //sug:make table for date only if need.
            const status = findStatus(new Date(), expirationDate);
            const result = await client.query(
                "INSERT INTO tbl_domain_registrations (domain, years, payment_id, auto_renew, user_id, expiration_date,status) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING *",
                [register.domain, register.years, register.paymentId, register.auto_renew, user_id, expirationDate,status]
              );

            //console.log(apiResponse);
            return apiResponse;
        } catch (error) {
            throw (error)
        }
    }
    static async renewDomain(client: PoolClient, domain: string, newYears: number): Promise<void> {
        try {
            const result=await client.query(
                "UPDATE tbl_domain_registrations SET years = $1 WHERE domain = $2",
                [newYears, domain]
            );
            
        } catch (error) {
            throw error;
        }
    }
    
    static async getAllDomains(client: PoolClient): Promise<DomainResponse[]> {
        try {
            const result = await client.query("SELECT domain,created_at, payment_id, auto_renew,expiration_date FROM tbl_domain_registrations");
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
}
export { DomainRepository }