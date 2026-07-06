import { Router } from "express";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { technicianController } from "./technician.controller";

const router = Router();

router.patch("/profile", auth(Role.TECHNICIAN), technicianController.updateUserProfiole)

export const technicianRouter = router