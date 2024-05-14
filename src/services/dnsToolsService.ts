import axios from 'axios';

export class MXToolboxService {
  static async performDNSLookup(argument: string): Promise<any> {
    try {
      const apiUrl = `https://api.mxtoolbox.com/api/v1/Lookup/DNS/?argument=${argument}`;
      const apiKey = 'de37cc87-720c-4290-a04b-bcc24cacd399';
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: apiKey//use api response of get domain info and use the reposnses to store the db
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
