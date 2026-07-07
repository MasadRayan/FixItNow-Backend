import { easycontroller } from "../../utils/easyController";
import sendResponse from "../../utils/sendResponse";
import { adminService } from "./admin.service";
import httpStatus from "http-status"

const createCategory = easycontroller(async (req: any, res: any, next: any) => {
    const payload = req.body;
    const rusult = await adminService.createCategoryInDb(payload);
    sendResponse(res, httpStatus.CREATED, true, "Category created successfully", rusult)
});

const getAllCategory = easycontroller(async (req: any, res: any, next: any) => {
    const result = await adminService.getAllCategory();
    sendResponse(res, httpStatus.OK, true, "All Categories fetched successfully", result)
})

const getAllUsers = easycontroller(async (req: any, res: any, next: any) => {
    const query = req.query
    const result = await adminService.getAllUsersFromDB(query);
    sendResponse(res, httpStatus.OK, true, "All Users fetched successfully", result)
})

const updateUserStatus = easycontroller(async (req: any, res: any, next: any) => {
    const userId = req.params.id;
    const payload = req.body;
    const result = await adminService.updateUserStatusIntoDB(userId, payload);
    sendResponse(res, httpStatus.OK, true, "User status updated successfully", result)
})


export const adminController = {
    createCategory,
    getAllCategory,
    getAllUsers,
    updateUserStatus
}