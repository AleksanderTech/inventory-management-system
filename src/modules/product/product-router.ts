import { Router } from "express";
import { GetProductsQuery } from "./queries/get-products-query.ts";
import type {
  CreateProductRequest,
  CreateProductResponse,
  GetProductsResponse,
} from "./model/types.ts";
import { CreateProductCommand } from "./commands/create-product-command.ts";
import { validateCreateProduct } from "./validators/product-validator.ts";

export const productRouter = ({
  getProductsQuery,
  createProductCommand,
}: {
  getProductsQuery: GetProductsQuery;
  createProductCommand: CreateProductCommand;
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

  return router;
};
