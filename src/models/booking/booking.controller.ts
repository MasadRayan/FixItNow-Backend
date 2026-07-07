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

const updateBookingStatus = easycontroller(async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.params.id as string;
    const payload = req.body;
    const technicianId = req.user?.id
    const result = await bookingService.updateBookingStatusIntoDB(bookingId, payload, technicianId as string);
    sendResponse(res, httpStatus.OK, true, "Booking status updated successfully", result)
})

const getMyBookings = easycontroller(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const role = req.user?.role as string;

  const result = await bookingService.getMyBookingsFromDB(userId, role);

  sendResponse(res, httpStatus.OK, true, "Bookings fetched successfully", result);
});

export const bookingController = {
    createBooking,
    updateBookingStatus,
    getMyBookings
}