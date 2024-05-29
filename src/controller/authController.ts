import { Request,NextFunction,Response } from "express";
import { AuthenticatedRequest, PasswordReq, ProfileReq, ProfileRequest, loginRequest, registerReq } from "../models";
import { AuthService } from "../services";

class AuthController {
  static UserRegister = async (
    req: registerReq,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await AuthService.registerUser(req);
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }
  static UserLogin = async (
    req: loginRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await AuthService.loginUser(req);
      return res.json(response);
    } catch (error) {
      next(error);
    }
  };
  static async setUserProfile (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ):Promise<void> {
    try {
      const response = await AuthService.setUserProfile(req);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
  // Add this method to UserController.ts
static async getUserProfileById(
  req: ProfileReq,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
      const response = await AuthService.getUserProfileById(req);
      console.log(req.profile_id);
      
      res.json(response);
  } catch (error) {
      next(error);
  }
}
static async forgotPassword(
  req: PasswordReq,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
      const response = await AuthService.forgotPassword(req);
      res.json(response);
  } catch (error) {
      next(error);
  } 
}
};
export {AuthController}