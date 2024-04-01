import { Request } from "express";

export interface registerBody {
  email: string;
  password:string;
  confirm_password:string;
  country_code:string;
  password_salt:string;
  password_hash:string;
  mobile:string;
}
export interface registerReq extends Request {
  body: registerBody;
}
export interface RegistrationResponse {
  message: string;
  id: string;
  email: string;
  status: number;
  country_code:string;
  mobile:string;
}
