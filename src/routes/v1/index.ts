import express from "express";

import { UserRoute } from "./user.route";
import { DomainRoute } from "./domain.route";
import { CartRoute } from "./cart.route";
import { PaymentRoute } from "./payment.route";

const router = express();
router.use("/user", UserRoute);
router.use('/domains', DomainRoute);
router.use('/cart',CartRoute);
router.use('/payment',PaymentRoute);


export { router as v1 };
