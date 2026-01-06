import type { Knex } from "knex";
import { GetProductsQuery } from "../modules/product/queries/get-products-query.ts";
import { CreateProductCommand } from "../modules/product/commands/create-product-command.ts";
import { AddStockWriter } from "../modules/product/data/add-stock-writer.ts";
import { RestockProductCommand } from "../modules/product/commands/restock-product-command.ts";

export const createDependencies = async ({ db }: { db: Knex }) => {
  const getProductsQuery = new GetProductsQuery(db);
  const createProductCommand = new CreateProductCommand(db);
  const addStockWriter = new AddStockWriter(db);
  const restockProductCommand = new RestockProductCommand(addStockWriter);
  
  return {
    getProductsQuery,
    createProductCommand,
    restockProductCommand
  };
};

export type AppDependencies = Awaited<ReturnType<typeof createDependencies>>;
