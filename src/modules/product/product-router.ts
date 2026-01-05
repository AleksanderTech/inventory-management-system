import { Router } from "express";
import { GetProductsQuery } from "./queries/get-products-query.ts";
import type { GetProductsResponse } from "./model/types.ts";

export const productRouter = ({ getProductsQuery }: { getProductsQuery: GetProductsQuery }) => {
  const router = Router();

  router.get("/products", async (_req, res) => {
    const view = await getProductsQuery.query();
    res.json(view satisfies GetProductsResponse);
  });

  return router;
};
