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

const getAllTechnicians = easycontroller(async (req: Request, res: Response, next: NextFunction) => {
    const result = await technicianService.getAllTechniciansFromDB()
    sendResponse(res, httpStatus.OK, true, "Technicians fetched successfully", result)
})


export const technicianController = {
    updateUserProfiole,
    getAllTechnicians
}