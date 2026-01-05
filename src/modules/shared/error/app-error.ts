import { ErrorCode } from "./error-code.ts";

export class AppError extends Error {
  errorCode: ErrorCode;

  constructor({ message, errorCode }: { message?: string; errorCode: ErrorCode }) {
    super(message);
    this.errorCode = errorCode;
  }
}
