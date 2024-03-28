import express from "express";

import { UserController } from "../../controller";
import { AuthMiddleware } from "../../middlewares";

const router = express.Router();

router.post("/register", UserController.UserRegister);
router.post("/login",UserController.UserLogin);
router.post("/setprofile",AuthMiddleware,UserController.setUserProfile);
router.get("/profile/:userId",AuthMiddleware, UserController.getUserProfileById);


export { router as UserRoute };
