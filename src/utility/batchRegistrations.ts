import axios from 'axios';
import { DomainRegister, DomainResponse } from '../models';
import { environment } from '../config';
import { parseResponseData } from '../utility';
import { NamesiloAPI } from '../utility';


const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const makeRequestWithRetry = async (registerData: DomainRegister, retries: number = 3, delay: number = 1000): Promise<DomainResponse> => {
    let lastError: any;
    for (let i = 0; i < retries; i++) {
        try {
            const response = await NamesiloAPI.registerDomain(registerData);
            return response;
        } catch (error:any) {
            lastError = error;
            if (error.response && error.response.status === 503 && i < retries - 1) {
                await sleep(delay);
                delay *= 1;
            } else {
                break;
            }
        }
    }
    throw lastError;
};


export const processRegistrationsInBatches = async (registrations: DomainRegister[], batchSize: number = 5): Promise<any> => {
    const results: DomainResponse[] = [];
    for (let i = 0; i < registrations.length; i += batchSize) {
        const batch = registrations.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(registerData => makeRequestWithRetry(registerData)));
        results.push(...batchResults);
        await sleep(1000);
    }
    return results;
};
