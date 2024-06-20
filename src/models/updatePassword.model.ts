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
export interface UpdatePassword {
  params: {
    token: string;
  };
  body: {
    password: string;
    confirmPassword: string;
  };
}
export interface UpdateUser {
  password_hash: string;
  password_salt: string;
  user_id: number;
}