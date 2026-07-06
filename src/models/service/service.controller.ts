import { NextFunction, Request, Response } from "express";
import { easycontroller } from "../../utils/easyController";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status"
import { serviceService } from "./service.service";

const createService = easycontroller(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.user?.id as string;
    const result = await serviceService.createServiceIntoDB(userId as string, payload);
    sendResponse(res, httpStatus.CREATED, true, "Service created successfully", result)
})

export const serviceController = {
    createService
}