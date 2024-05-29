import crypto from "crypto";

export function generateToken(length: number) {
  return crypto.randomBytes(length).toString("hex");
}

export function createResetPasswordToken(){
  const resetToken=crypto.randomBytes(32).toString('hex');
   return crypto.createHash('sha256').update(resetToken).digest('hex')
}

// class DomainIdHelper {
//   static domainIdCounter: any = {};
//   static domainCounter: number = 1;

//   static generateDomainId(domain: string): number {
//     if (!DomainIdHelper.domainIdCounter[domain]) {
//       DomainIdHelper.domainIdCounter[domain] = DomainIdHelper.domainCounter;
//       DomainIdHelper.domainCounter += 1;
//     }
//     return DomainIdHelper.domainIdCounter[domain];
//   }
// }
// export{DomainIdHelper}