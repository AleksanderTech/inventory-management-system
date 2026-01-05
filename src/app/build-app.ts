import express from "express";
import type { AppDependencies } from "./dependencies.ts";
import { productRouter } from "../modules/product/product-router.ts";
import { notFoundErrorHandler, globalErrorHandler } from "../infra/express/error/error-handlers.ts";

export const buildApp = ({ dependencies }: { dependencies: AppDependencies }) => {
  const app = express();
  app.use(express.json());

  app.use(productRouter(dependencies));

  app.use(notFoundErrorHandler);
  app.use(globalErrorHandler);

  return app;
};
