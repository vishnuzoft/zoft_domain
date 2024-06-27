export interface DomainRegister {
  expirationDate?:Date;
  status?:string;
  domain: string;
  years: string;
  auto_renew: boolean;
}
export interface DomainResponse {
  namesilo:any;
  status: number;
  id: number,
  message: string,
  domain: string;
  years: string;
  auto_renew: boolean;
  
}
interface Domain {
  domain: string;
  created_at: string;
  payment_id: string | null;
  auto_renew: boolean;
  expiration_date: string;
};
export interface GetDomains {
  data: DomainResponse[];
  message: string;
  status: number;
}

export interface DomainReq extends Request {
  query: string
}