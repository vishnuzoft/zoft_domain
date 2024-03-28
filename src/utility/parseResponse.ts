export function parseResponseData(data: string): Promise<any> {
    const { parseString } = require('xml2js');
  
    return new Promise((resolve, reject) => {
      parseString(data, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }