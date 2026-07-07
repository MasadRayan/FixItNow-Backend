import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/browser";
import { exportBuffer } from "node:ffi";

const router = Router();

router.post("/create", auth(Role.CUSTOMER), bookingController.createBooking);
router.patch("/status/:id", auth(Role.TECHNICIAN), bookingController.updateBookingStatus);
router.get("/", auth(Role.CUSTOMER), bookingController.getMyBookings);
// router.get("/:id", auth(Role.CUSTOMER), bookingController.getMyBookingById);

export const bookingRouter = router