import Joi from "joi";
import type { CreateProductInput, RestockInput } from "../model/types.ts";
import { ProductCategory } from "../../shared/contracts/product/model/constants.ts";
import { JoiValidate } from "../../shared/validators/joi.ts";

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

export function validateCreateProduct(payload: unknown): CreateProductInput {
  return JoiValidate<CreateProductInput>(createProductSchema, payload);
}

export function validateRestock(payload: unknown): RestockInput {
  return JoiValidate<RestockInput>(restockSchema, payload);
}

export const validateSellProduct = validateRestock;

export function validateProductId(payload: unknown): string {
  return JoiValidate<string>(idSchema, payload);
}
