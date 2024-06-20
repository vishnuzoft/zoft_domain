import express from "express";

import { AuthController } from "../../controller";
import { Authmiddleware } from "../../middlewares";

const router = express.Router();

router.post("/register", AuthController.UserRegister);
router.post("/login",AuthController.UserLogin);
router.patch("/forgot-password",AuthController.forgotPassword);
router.patch("/reset-password/:token",AuthController.resetPassword);
router.post("/profile/setprofile",Authmiddleware,AuthController.setUserProfile);
router.get("/profile/:profile_id",Authmiddleware, AuthController.getUserProfileById);


export { router as UserRoute };
