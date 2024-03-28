import { NextFunction,Response } from "express";
import { ProfileRequest, loginRequest, registerReq } from "../models";
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
  static setUserProfile = async (
    req: ProfileRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await UserService.setUserProfile(req);
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }
  static getUserProfileById = async (
    req: ProfileRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await UserService.getUserProfileById(req);
      return res.json(response);
    } catch (error) {
      next(error);
    }
  };
  
};
export {UserController}