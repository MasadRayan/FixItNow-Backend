import { Router } from "express";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { technicianController } from "./technician.controller";

const router = Router();

router.get("/", technicianController.getAllTechnicians);
router.get("/:id", technicianController.getTechnicianById);
router.patch("/profile", auth(Role.TECHNICIAN), technicianController.updateUserProfiole);
export const technicianRouter = router