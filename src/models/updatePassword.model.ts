import { Request } from "express";

// export interface PasswordBody {
//   password: string;
//   confirmPassword: string;
// }
// interface params {
//   token: string;
// }

export interface PasswordReq extends Request {
  email:string
}
