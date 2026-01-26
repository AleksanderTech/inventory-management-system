import { ErrorCode } from "../../../modules/shared/error/error-code.ts";

export type ApiErrorResponse = {
  errorCode: ErrorCode;
  message: string | null;
};
