import express from "express";

import { UserController } from "../../controller";

const router = express.Router();

router.post("/register", UserController.createuser);
router.post("/login", UserController.login);



export { router as UserRoute };
