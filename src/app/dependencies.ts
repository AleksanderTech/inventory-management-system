import type { Knex } from "knex";
import { GetProductsQuery } from "../modules/product/queries/get-products-query.ts";
import { CreateProductCommand } from "../modules/product/commands/create-product-command.ts";
import { AddStockWriter } from "../modules/product/data/add-stock-writer.ts";
import { RestockProductCommand } from "../modules/product/commands/restock-product-command.ts";
import { SubtrackStockWriter } from "../modules/product/data/subtract-stock-writer.ts";
import { SellProductCommand } from "../modules/product/commands/sell-product-command.ts";

export const createDependencies = async ({ db }: { db: Knex }) => {
  const getProductsQuery = new GetProductsQuery(db);
  const createProductCommand = new CreateProductCommand(db);
  const addStockWriter = new AddStockWriter(db);
  const restockProductCommand = new RestockProductCommand(addStockWriter);
  const subtrackStockWriter = new SubtrackStockWriter(db);
  const sellProductCommand = new SellProductCommand(db, subtrackStockWriter);
  
  return {
    getProductsQuery,
    createProductCommand,
    restockProductCommand,
    sellProductCommand,
  };
};

export type AppDependencies = Awaited<ReturnType<typeof createDependencies>>;
