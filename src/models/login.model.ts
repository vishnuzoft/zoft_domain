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
  id: number;
  email: string;
  token:string;
}
export interface userLoginData {
  id: number;
}
