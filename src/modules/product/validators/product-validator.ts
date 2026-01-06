import Joi from "joi";
import { AppError } from "../../shared/error/app-error.ts";
import { ErrorCode } from "../../shared/error/error-code.ts";
import type { CreateProductInput, RestockInput } from "../model/types.ts";
import { ProductCategory } from "../../shared/contracts/product/model/constants.ts";

const createProductSchema = Joi.object({
  name: Joi.string().max(50).required(),
  description: Joi.string().max(50).required(),
  category: Joi.string()
    .valid(...Object.values(ProductCategory))
    .max(50)
    .required(),
  priceMinor: Joi.number().integer().min(1).required(),
  stock: Joi.number().integer().min(0).required(),
}).required();

const restockSchema = Joi.object({
  amount: Joi.number().integer().min(1).required(),
}).required();

const idSchema = Joi.string()
  .guid({ version: ["uuidv4"] })
  .required();

function joiValidate<T>(schema: Joi.Schema, payload: unknown): T {
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

export function validateCreateProduct(payload: unknown): CreateProductInput {
  return joiValidate<CreateProductInput>(createProductSchema, payload);
}

export function validateRestock(payload: unknown): RestockInput {
  return joiValidate<RestockInput>(restockSchema, payload);
}

export const validateSellProduct = validateRestock;

export function validateProductId(payload: unknown): string {
  return joiValidate<string>(idSchema, payload);
}
