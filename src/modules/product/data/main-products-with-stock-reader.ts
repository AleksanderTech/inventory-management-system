import type { Knex } from "knex";
import type { ProductsWithStockReader } from "../../shared/contracts/product/data/products-with-stock-reader.ts";
import type { ProductWithStock } from "../../shared/contracts/product/model/types.ts";

export class MainProductsWithStockReader implements ProductsWithStockReader {
  #db: Knex;

  constructor(db: Knex) {
    this.#db = db;
  }

  async getMapByIds(
    productIds: string[],
    trx?: Knex.Transaction
  ): Promise<Map<string, ProductWithStock>> {
    const conn = trx ?? this.#db;
    const rows = await conn("product")
      .join("inventory", "product.id", "inventory.product_id")
      .whereIn("product.id", productIds)
      .select(
        "product.id",
        "product.category",
        "product.price_minor as priceMinor",
        "inventory.stock"
      );
    return new Map(rows.map((row) => [row.id, row]));
  }
}
