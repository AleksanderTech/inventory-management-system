export const ErrorCode = {
  resourceNotFound: "resourceNotFound",
  unknownError: "unknownError",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
