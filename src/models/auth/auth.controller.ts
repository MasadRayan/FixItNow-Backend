import { NextFunction, Request, Response } from "express";
import { easycontroller } from "../../utils/easyController";
import { authService } from "./auth.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";

const createUser = easycontroller(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await authService.createUserIntoDB(payload);
    sendResponse(res, httpStatus.CREATED, true, "User created successfully", result)
})

export const authController = { 
    createUser
}