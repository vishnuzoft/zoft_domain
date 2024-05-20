import express from "express";

import { UserController } from "../../controller";
import { Authmiddleware } from "../../middlewares";

const router = express.Router();

router.post("/register", UserController.UserRegister);
router.post("/login",UserController.UserLogin);
router.post("/forgot-password",UserController.forgotPassword);
router.post("/profile/setprofile",Authmiddleware,UserController.setUserProfile);
router.get("/profile/:profile_id",Authmiddleware, UserController.getUserProfileById);


export { router as UserRoute };
