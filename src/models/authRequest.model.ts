import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user_id?: string;
}
export interface ProfileReq extends Request {
  profile_id?: string;
}