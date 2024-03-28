export interface DomainRegister {
  domain: string;
  years: string;
  paymentId?: string;
  autoRenew: boolean;
}
export interface DomainResponse {
  status: number;
  id: number,
  message: string,
  domain: string;
  years: number;
  paymentId?: string;
  autoRenew: boolean;
}

export interface DomainReq extends Request {
  query: string
}