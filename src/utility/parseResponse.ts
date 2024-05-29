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
// import { DomainIdHelper } from "../utility";
// export function parseResponseData(data: string): Promise<any> {
//   const { parseString } = require('xml2js');

//   return new Promise((resolve, reject) => {
//     parseString(data, (err: any, result: any) => {
//       if (err) {
//         reject(err);
//       } else {
//         const availableDomains = result.namesilo.reply[0].available[0].domain;

//       availableDomains.forEach((domain: any) => {
//         const domainName = domain._;
//         domain.id = DomainIdHelper.generateDomainId(domainName);
//       });
//         resolve(result);
//       }
//     });
//   });
// }