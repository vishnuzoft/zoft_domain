import * as dotenv from 'dotenv';
import {
  NextFunction,
  Response,
} from 'express';

import { environment } from '../config';
import { AuthenticatedRequest } from '../models';

const jwt = require("jsonwebtoken");
dotenv.config();

// Extend the Request type to include userId
// interface AuthenticatedRequest extends Request {
//   user_id?: string;
// }

export const Authmiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token: string | undefined = req.headers.authorization;
  //console.log("token", token);
  if (!token) {
    return res.status(401).json({
      auth: false,
      status: 401,
      message: "No token provided",
    });
  }
  const verifyToken = token.replace(/"/g, "");

  const secret_code = environment.JWT_SECRET;
  jwt.verify(verifyToken, secret_code, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({
        auth: false,
        status: 401,
        message: "Invalid token. Authentication failed.",
      });
    } else {
      req.user_id = decoded.user_id;
      next();
    }
  });
};
