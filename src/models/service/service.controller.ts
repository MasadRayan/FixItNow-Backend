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

const getAllServices = easycontroller(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    const result = await serviceService.getAllServicesFromDB(query);
    sendResponse(res, httpStatus.OK, true, "Services fetched successfully", result)
})

export const serviceController = {
    createService,
    getAllServices
}