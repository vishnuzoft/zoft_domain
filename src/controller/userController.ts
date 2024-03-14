import { NextFunction,Response } from "express";
import { loginRequest, registerReq } from "../models";
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
};
export {UserController}