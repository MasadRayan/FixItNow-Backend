import { Router } from "express";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { serviceController } from "./service.controller";

const router = Router();

router.post("/", auth(Role.TECHNICIAN), serviceController.createService);
router.get("/", serviceController.getAllServices);


export const serviceRouter = router