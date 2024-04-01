import { PoolClient } from "pg";
import { DomainRegister, DomainResponse } from "../models";
import { NamesiloAPI } from "../utility";

class DomainRepository {
    static async registerDomain(client: PoolClient, register: DomainRegister): Promise<DomainResponse> {

        try {
            const apiResponse = await NamesiloAPI.registerDomain(register);

            const result = await client.query("INSERT INTO tbl_domain_registrations (domain, years, payment_id, auto_renew) VALUES ($1, $2, $3, $4) RETURNING *",
                [register.domain, register.years, register.paymentId, register.autoRenew])

            //console.log(apiResponse);
            return apiResponse;
        } catch (error) {
            throw (error)
        }
    }
}
export { DomainRepository }