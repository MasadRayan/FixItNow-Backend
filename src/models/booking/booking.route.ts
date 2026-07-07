import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/browser";

const router = Router();

router.post("/create", auth(Role.CUSTOMER, Role.ADMIN, Role.TECHNICIAN), bookingController.createBooking);

export const bookingRouter = router