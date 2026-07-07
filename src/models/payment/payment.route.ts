import { Router } from "express";
import { paymentController } from "./payment.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/create", auth(Role.CUSTOMER), paymentController.createPayment)
router.post("/confirm", paymentController.webhook)
router.get("/", auth(Role.CUSTOMER), paymentController.getMyPayments)

export const paymentRouter = router