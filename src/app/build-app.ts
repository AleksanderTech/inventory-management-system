import express from "express";
import type { AppDependencies } from "./dependencies.ts";
import { productRouter } from "../modules/product/product-router.ts";

export const buildApp = ({ dependencies }: { dependencies: AppDependencies }) => {
  const app = express();
  app.use(express.json());

  app.use(productRouter(dependencies));

  return app;
};
