import { NextFunction, Request, Response } from "express";
import { easycontroller } from "../../utils/easyController";
import sendResponse from "../../utils/sendResponse";
import { paymentService } from "./payment.service";
import httpStatus from "http-status"

const createPayment = easycontroller(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;
    const result = await paymentService.createPayment(userId as string, payload);
    sendResponse(res, httpStatus.CREATED, true, "Payment created successfully", result)
    
    
})

export const paymentController = {
    createPayment
}