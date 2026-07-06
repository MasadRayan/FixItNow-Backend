import { Router } from "express";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { technicianController } from "./technician.controller";

const router = Router();

router.patch("/profile", auth(Role.TECHNICIAN), technicianController.updateUserProfiole);
router.post("/services", auth(Role.TECHNICIAN), technicianController.createService);

export const technicianRouter = router