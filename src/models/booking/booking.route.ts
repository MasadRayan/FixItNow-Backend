import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/browser";
import { exportBuffer } from "node:ffi";

const router = Router();

router.post("/create", auth(Role.CUSTOMER, Role.ADMIN, Role.TECHNICIAN), bookingController.createBooking);
router.patch("/status/:id", auth(Role.TECHNICIAN), bookingController.updateBookingStatus);

export const bookingRouter = router