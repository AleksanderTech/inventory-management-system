import Joi from "joi";
import { AppError } from "../error/app-error.ts";
import { ErrorCode } from "../error/error-code.ts";

export function JoiValidate<T>(schema: Joi.Schema, payload: unknown): T {
  const { value, error } = schema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map((detail) => detail.message).join(", ");
    throw new AppError({
      errorCode: ErrorCode.validationError,
      message: details || "Invalid request body",
    });
  }

  return value as T;
}
