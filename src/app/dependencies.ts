import type { Knex } from "knex";
import { GetProductsQuery } from "../modules/product/queries/get-products-query.ts";

export const createDependencies = async ({ db }: { db: Knex }) => {
  const getProductsQuery = new GetProductsQuery(db);

  return {
    getProductsQuery,
  };
};

export type AppDependencies = Awaited<ReturnType<typeof createDependencies>>;
