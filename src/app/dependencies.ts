import type { Knex } from "knex";
import { GetProductsQuery } from "../modules/product/queries/get-products-query.ts";
import { CreateProductCommand } from "../modules/product/commands/create-product-command.ts";

export const createDependencies = async ({ db }: { db: Knex }) => {
  const getProductsQuery = new GetProductsQuery(db);
  const createProductCommand = new CreateProductCommand(db);

  return {
    getProductsQuery,
    createProductCommand,
  };
};

export type AppDependencies = Awaited<ReturnType<typeof createDependencies>>;
