import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/register", authController.createUser);
router.post("/login", authController.loginUser);
router.get("/me", authController.myInfo);


export const authRouter = router