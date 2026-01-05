import { Router } from "express";

export const productRouter = ({}: any) => {
  const router = Router();

  router.get("/products", async (_req, res) => {
    res.json([]);
  });

  return router;
};
