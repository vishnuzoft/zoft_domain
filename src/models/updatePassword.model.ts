import { Request } from "express";

export interface PasswordBody {
  password: string;
  confirmPassword: string;
}
interface params {
  token: string;
}

export interface updatePasswordReq extends Request<params> {
  body: PasswordBody;
  params: params;
}
