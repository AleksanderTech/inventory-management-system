import type { Knex } from "knex";
import type { ProductWithStock } from "../model/types.ts";

export interface ProductsWithStockReader {
  getMapByIds(productIds: string[], trx?: Knex.Transaction): Promise<Map<string, ProductWithStock>>;
}
