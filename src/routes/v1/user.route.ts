import express from "express";

import { UserController } from "../../controller";

const router = express.Router();

router.post("/register", UserController.UserRegister);
router.post("/login",UserController.UserLogin);



export { router as UserRoute };
