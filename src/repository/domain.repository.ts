import { PoolClient } from "pg";
import { DomainRegister, DomainResponse, OrderDetails } from "../models";
import { NamesiloAPI } from "../utility";

class DomainRepository {
    static async registerDomain(client: PoolClient, user_id: string, register: DomainRegister): Promise<DomainResponse> {

        try {
            const apiResponse = await NamesiloAPI.registerDomain(register);

            const result = await client.query("INSERT INTO tbl_domain_registrations (domain, years, payment_id, auto_renew,user_id) VALUES ($1, $2, $3, $4,$5) RETURNING *",
                [register.domain, register.years, register.paymentId, register.autoRenew, user_id])

            //console.log(apiResponse);
            return apiResponse;
        } catch (error) {
            throw (error)
        }
    }
    static async getAllDomains(client: PoolClient): Promise<DomainResponse[]> {
        try {
            const result = await client.query("SELECT domain, years, payment_id, auto_renew FROM tbl_domain_registrations");
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