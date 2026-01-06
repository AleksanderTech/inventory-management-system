import { Router } from "express";
import { GetProductsQuery } from "./queries/get-products-query.ts";
import type {
  CreateProductRequest,
  CreateProductResponse,
  GetProductsResponse,
  RestockProductRequest,
  RestockProductResponse,
} from "./model/types.ts";
import { CreateProductCommand } from "./commands/create-product-command.ts";
import {
  validateCreateProduct,
  validateProductId,
  validateRestock,
} from "./validators/product-validator.ts";
import { RestockProductCommand } from "./commands/restock-product-command.ts";

export const productRouter = ({
  getProductsQuery,
  createProductCommand,
  restockProductCommand,
}: {
  getProductsQuery: GetProductsQuery;
  createProductCommand: CreateProductCommand;
  restockProductCommand: RestockProductCommand;
}) => {
  const router = Router();

  router.get("/products", async (_req, res) => {
    const view = await getProductsQuery.query();
    res.json(view satisfies GetProductsResponse);
  });

  router.post("/products", async (req, res) => {
    const input = validateCreateProduct(req.body as CreateProductRequest);
    const product = await createProductCommand.execute(input);
    res.status(201).json(product satisfies CreateProductResponse);
  });

  router.post("/products/:id/restock", async (req, res) => {
    const input = validateRestock(req.body as RestockProductRequest);
    const productId = validateProductId(req.params.id);
    const output = await restockProductCommand.execute(productId, input.amount);
    res.json(output satisfies RestockProductResponse);
  });

  return router;
};
