import { NextFunction, Request, Response } from "express";
import { easycontroller } from "../../utils/easyController";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status"
import { bookingService } from "./booking.service";

const createBooking = easycontroller(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.user?.id
    const result = await bookingService.createBookingIntoDB(userId as string ,payload)
    sendResponse(res, httpStatus.CREATED, true, "Booking created successfully", result)
});

export const bookingController = {
    createBooking
}