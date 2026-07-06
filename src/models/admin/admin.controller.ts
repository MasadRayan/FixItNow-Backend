import { easycontroller } from "../../utils/easyController";
import sendResponse from "../../utils/sendResponse";
import { adminService } from "./admin.service";
import httpStatus from "http-status"

const createCategory = easycontroller(async (req: any, res: any, next: any) => {
    const payload = req.body;
    const rusult = await adminService.createCategoryInDb(payload);
    sendResponse(res, httpStatus.CREATED, true, "Category created successfully", rusult)
});


export const adminController = {
    createCategory
}