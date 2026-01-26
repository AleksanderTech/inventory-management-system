import Joi from "joi";
import type { CreateOrderInput } from "../model/types.ts";
import { JoiValidate } from "../../shared/validators/joi.ts";

const idSchema = Joi.string()
  .guid({ version: ["uuidv4"] })
  .required();

const orderItemSchema = Joi.object({
  productId: idSchema,
  quantity: Joi.number().integer().min(1).required(),
}).required();

const createOrderSchema = Joi.object({
  customerId: idSchema,
  products: Joi.array().items(orderItemSchema).min(1).required(),
}).required();

export function validateCreateOrder(payload: unknown): CreateOrderInput {
  return JoiValidate<CreateOrderInput>(createOrderSchema, payload);
}
