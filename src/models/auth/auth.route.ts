import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", authController.createUser);
router.post("/login", authController.loginUser);
router.get("/me", auth(Role.ADMIN, Role.TECHNICIAN, Role.CUSTOMER), authController.myInfo);


export const authRouter = router