import { Request } from "express";

export interface loginBody {
  email: string;
  password: string;
}

export interface loginRequest extends Request {
  body: loginBody;
}
export interface loginResponse {
  status:number;
  message: string;
  id: string;
  email: string;
  token:string;
}
export interface userLoginData {
  user_id: string;
}
