import { Router } from "express";
import { CreateOrderCommand } from "./commands/create-order-command.ts";
import type { CreateOrderRequest, CreateOrderResponse } from "./model/types.ts";
import { validateCreateOrder } from "./validators/order-validator.ts";

export const orderRouter = ({ createOrderCommand }: { createOrderCommand: CreateOrderCommand }) => {
  const router = Router();

  router.post("/orders", async (req, res) => {
    const input = validateCreateOrder(req.body as CreateOrderRequest);
    const output = await createOrderCommand.execute(input);
    res.status(201).json(output satisfies CreateOrderResponse);
  });

  return router;
};
