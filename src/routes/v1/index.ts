import express from "express";

import { UserRoute } from "./user.route";


const router = express();
router.use("/user", UserRoute);


export { router as v1 };
