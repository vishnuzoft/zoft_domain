import axios from 'axios';
import { environment } from '../config';

async function sendSms(to: string, text: string, datetime: string) {

    const url: string =`${environment.SMS_API_URL}?username=${environment.SMS_USERNAME}&password=${environment.SMS_PASSWORD}&senderid=${environment.SMS_SENDER_ID}&to=${to}&text=${text}&type=text&datetime=${datetime}`;

    try {
        const response = await axios.get(url);
        console.log('SMS Sent:', response.data);
    } catch (error) {
        console.error('SMS Error:', error);
    }
}

export { sendSms };