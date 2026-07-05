import type { Request, Response, NextFunction } from "express";

import sendResponse from "../utils/sendResponse";
import { AppError } from "../utils/AppError";

const globalHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return sendResponse(res, err.statusCode, false, err.message, undefined, err.message);
  }
  const message = err instanceof Error ? err.message : "Internal Server Error";
  return sendResponse(res, 500, false, message, undefined, message);
};

export default globalHandler;