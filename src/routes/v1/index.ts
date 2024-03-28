import express from "express";

import { UserRoute } from "./user.route";
import { DomainRoute } from "./domain.route";

const router = express();
router.use("/user", UserRoute);
router.use('/domains', DomainRoute);


export { router as v1 };
