import { NextFunction,Response } from "express";
import { AuthenticatedRequest, ProfileReq, ProfileRequest, loginRequest, registerReq } from "../models";
import { UserService } from "../services";

class UserController {
  static UserRegister = async (
    req: registerReq,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await UserService.registerUser(req);
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
      const response = await UserService.loginUser(req);
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
      const response = await UserService.setUserProfile(req);
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
      const response = await UserService.getUserProfileById(req);
      console.log(req.profile_id);
      
      res.json(response);
  } catch (error) {
      next(error);
  }
}

};
export {UserController}