import { Router } from "express";
import { adminController } from "./admin.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/categories", auth(Role.ADMIN), adminController.createCategory);
router.get("/categories", auth(Role.ADMIN), adminController.getAllCategory);
router.get("/allUsers", auth(Role.ADMIN), adminController.getAllUsers);

export const adminRouter = router