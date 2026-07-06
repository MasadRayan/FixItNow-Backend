import { NextFunction, Request, Response } from "express";
import { easycontroller } from "../../utils/easyController";
import { technicianService } from "./technician.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status"

const updateUserProfiole = easycontroller(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id
    const payload = req.body;
    const result = await technicianService.updateTEchnicianProfileINDB(userId as string, payload)
    sendResponse(res, httpStatus.OK, true, "Technician profile updated successfully", result)
})

const createService = easycontroller(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.user?.id as string;
    const result = await technicianService.createServiceIntoDB(userId as string, payload);
    sendResponse(res, httpStatus.CREATED, true, "Service created successfully", result)
})

export const technicianController = {
    updateUserProfiole,
    createService
}