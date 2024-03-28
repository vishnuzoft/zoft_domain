import axios from 'axios';
import { parseResponseData } from './parseResponse';
import { DomainRegister, DomainResponse } from '../models';
import { environment } from '../config';

class NamesiloAPI {

    static async registerDomain(registerData: DomainRegister): Promise<DomainResponse> {
        try {
            const response = await axios.get(`${environment.API_URL}/registerDomain`, {
                params: {
                    version: environment.API_VERSION,
                    type: environment.API_TYPE,
                    key: environment.API_KEY,
                    domain: registerData.domain,
                    years: registerData.years,
                    auto_renew: registerData.autoRenew ? 1 : 0,
                }
            });

            return parseResponseData(response.data);
        } catch (error) {
            throw (error);
        }
    }

    static async checkDomainAvailability(domains: string[]): Promise<any> {
        try {
            const endpoint = `${environment.API_URL}/checkRegisterAvailability`;

            const response = await axios.get(endpoint, {
                params: {
                    version: environment.API_VERSION,
                    type: environment.API_TYPE,
                    key: environment.API_KEY,
                    domains: domains.join(',')
                }
            });

            return parseResponseData(response.data);
        } catch (error) {
            throw (error);
        }
    }
}

export { NamesiloAPI };
