import express from "express";

import { UserRoute } from "./user.route";
import { DomainRoute } from "./domain.route";
import { CartRoute } from "./cart.route";

const router = express();
router.use("/user", UserRoute);
router.use('/domains', DomainRoute);
router.use('/cart',CartRoute);


export { router as v1 };
