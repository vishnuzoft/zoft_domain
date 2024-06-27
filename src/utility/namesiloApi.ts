import axios from 'axios';
import { parseResponseData } from './parseResponse';
import { AuthenticatedRequest, DomainRegister, DomainResponse } from '../models';
import { environment } from '../config';
import { generateDomainOptions, extensions } from '../utility';
import { PaymentService } from '../services';

class NamesiloAPI {

    static async registerDomain(registerData: DomainRegister): Promise<DomainResponse> {
        try {
            //console.log(environment.API_KEY);
            const response = await axios.get(`${environment.API_URL}/registerDomain`, {
                params: {
                    version: environment.API_VERSION,
                    type: environment.API_TYPE,
                    key: environment.API_KEY,
                    domain: registerData.domain,
                    years: registerData.years,
                    auto_renew: registerData.auto_renew ? 1 : 0
                }
            });
            
            
console.log(parseResponseData(response.data));

            return parseResponseData(response.data);
        } catch (error) {
            throw (error);
        }
    }
    static async renewDomain(domain: string, years: number): Promise<DomainResponse> {
        try {
            const response = await axios.get(`${environment.API_URL}/renewDomain`, {
                params: {
                    version: environment.API_VERSION,
                    type: environment.API_TYPE,
                    key: environment.API_KEY,
                    domain: domain,
                    years: years
                }
            });
            console.log(domain);

            return parseResponseData(response.data);
        } catch (error) {
            throw error;
        }
    }

    static async checkDomainAvailability(domains: string[]): Promise<any> {
        try {

            const domainOptions = generateDomainOptions(domains, extensions);

            const endpoint = `${environment.API_URL}/checkRegisterAvailability`;
            const response = await axios.get(endpoint, {
                params: {
                    version: environment.API_VERSION,
                    type: environment.API_TYPE,
                    key: environment.API_KEY,
                    domains: domainOptions.join(',')
                }
                // params:setCommonQueryParams({
                //     domains: domainOptions.join(',')
                // })
            });

            return parseResponseData(response.data);
        } catch (error) {
            throw (error);
        }
    }
    static async checkTransferAvailability(domains: string[]): Promise<any> {
        try {

            const endpoint = `${environment.API_URL}/checkTransferAvailability`;
            const response = await axios.get(endpoint, {
                params: {
                    version: environment.API_VERSION,
                    type: environment.API_TYPE,
                    key: environment.API_KEY,
                    domains
                }
            });

            return parseResponseData(response.data);
        } catch (error) {
            throw error;
        }
    }
    static async getDomainInfo(domain: string): Promise<any> {
        try {
            const endpoint = `${environment.API_URL}/getDomainInfo`;
            const response = await axios.get(endpoint, {
                params: {
                    version: environment.API_VERSION,
                    type: environment.API_TYPE,
                    key: environment.API_KEY,
                    domain
                }
            });

            return parseResponseData(response.data);
        } catch (error) {
            throw error;
        }
    }
}

export { NamesiloAPI };
