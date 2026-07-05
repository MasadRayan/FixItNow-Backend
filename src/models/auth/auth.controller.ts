import { NextFunction, Request, Response } from "express";
import { easycontroller } from "../../utils/easyController";
import { authService } from "./auth.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";

const createUser = easycontroller(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await authService.createUserIntoDB(payload);
    sendResponse(
      res,
      httpStatus.CREATED,
      true,
      "User created successfully",
      result,
    );
  },
);

const loginUser = easycontroller(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const { accessToken, refreshToken } = await authService.loginUser(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    sendResponse(res, httpStatus.OK, true, "User logged in successfully", {
      accessToken,
      refreshToken,
    });
  },
);

const myInfo = easycontroller(async (req: Request, res: Response, next: NextFunction) => {
    
});

export const authController = {
  createUser,
  loginUser,
  myInfo
};
