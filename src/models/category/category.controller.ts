import { NextFunction, Request, Response } from "express";
import { easycontroller } from "../../utils/easyController";
import { categoryService } from "./category.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status"

const getAllCategory = easycontroller (async (req: Request, res: Response, next: NextFunction) => {
   const query = req.query
   const result = await categoryService.getAllCategoryFromDB(query)
   sendResponse(res, httpStatus.OK, true, "Categories fetched successfully", result)
})

export const categoryController = {
    getAllCategory
}

