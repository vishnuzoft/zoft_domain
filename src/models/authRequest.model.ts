import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: number;
}
