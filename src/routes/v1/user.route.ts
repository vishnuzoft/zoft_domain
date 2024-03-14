import express from "express";

import { UserController } from "../../controller";

const router = express.Router();

router.post("/register", UserController.UserRegister);
router.post("/login",UserController.UserLogin);
router.post("/setprofile",UserController.setUserProfile);



export { router as UserRoute };
