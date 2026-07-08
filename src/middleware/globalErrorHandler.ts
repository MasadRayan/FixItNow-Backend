import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma/client";
import sendResponse from "../utils/sendResponse";
import { AppError } from "../utils/AppError";
import httpStatus from "http-status";

const globalHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Error: ", err);

  if (err instanceof AppError) {
    return sendResponse(
      res,
      err.statusCode,
      false,
      err.message,
      err.errorDetails,
    );
  }

  if (err instanceof ZodError) {
    const messages = err.issues.map((issue) => issue.message).join(", ");
    return sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      false,
      `Validation failed: ${messages}`,
    );
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      false,
      "You have provided an incorrect field type or a missing required field",
    );
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return sendResponse(
        res,
        httpStatus.CONFLICT,
        false,
        `Duplicate value for field(s): ${(err.meta?.target as string[])?.join(", ") ?? "unknown"}`,
      );
    }
    if (err.code === "P2003") {
      return sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        "Foreign key constraint failed — related record does not exist",
      );
    }
    if (err.code === "P2000") {
      return sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        "The provided value is too long for the field",
      );
    }
    if (err.code === "P2011") {
      return sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        "A required field cannot be null",
      );
    }
    if (err.code === "P2014") {
      return sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        "This change would violate a required relation between records",
      );
    }
    if (err.code === "P2025") {
      return sendResponse(
        res,
        httpStatus.NOT_FOUND,
        false,
        "The requested record was not found",
      );
    }
    return sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      false,
      `Database error (code: ${err.code})`,
    );
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      return sendResponse(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        false,
        "Database authentication failed",
      );
    }
    if (err.errorCode === "P1001") {
      return sendResponse(
        res,
        httpStatus.SERVICE_UNAVAILABLE,
        false,
        "Could not reach the database server",
      );
    }
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      "Database initialization error",
    );
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      "An unexpected error occurred during query execution",
    );
  }

  // 4. Fallback — anything else unexpected
  const isDev = process.env.NODE_ENV === "development";
  const message =
    isDev && err instanceof Error
      ? err.message
      : "Something went wrong. Please try again later.";

  return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, message);
};

export default globalHandler;
