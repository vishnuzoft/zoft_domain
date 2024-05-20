import { Request } from "express";

// export interface PasswordBody {
//   password: string;
//   confirmPassword: string;
// }
// interface params {
//   token: string;
// }

export interface PasswordReq extends Request {
  body: {
    email: string;
  };
}
export interface ResetPasswordToken {
  user_id: string;
  token: string;
  created_at: Date;
  expires_at: Date;
}
