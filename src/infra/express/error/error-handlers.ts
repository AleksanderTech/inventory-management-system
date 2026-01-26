import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../../modules/shared/error/app-error.ts";
import { ErrorCode } from "../../../modules/shared/error/error-code.ts";
import type { ApiErrorResponse } from "./api-error-response.ts";

const httpStatusByCode: Record<ErrorCode, number> = {
  [ErrorCode.resourceNotFound]: 404,
  [ErrorCode.insufficientStock]: 409,
  [ErrorCode.validationError]: 400,
  [ErrorCode.unknownError]: 500,
};

export const globalErrorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    const statusCode = httpStatusByCode[error.errorCode] ?? 500;
    return res.status(statusCode).json({
      errorCode: error.errorCode,
      message: error.message,
    } satisfies ApiErrorResponse);
  }

  console.error("Unhandled error", error.message);

  return res.status(500).json({
    errorCode: ErrorCode.unknownError,
    message: null,
  } satisfies ApiErrorResponse);
};

export const notFoundErrorHandler = (_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    errorCode: ErrorCode.resourceNotFound,
    message: "Resource not found",
  } satisfies ApiErrorResponse);
};
