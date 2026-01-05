import type { Knex } from "knex";
import type { ProductView } from "../model/types.ts";

export class GetProductsQuery {
  #db;

  constructor(db: Knex) {
    this.#db = db;
  }

  async query(): Promise<ProductView[]> {
    const rows = await this.#db("product")
      .join("inventory", "product.id", "inventory.product_id")
      .select(
        "product.id",
        "product.name",
        "product.description",
        "product.category",
        "product.price_minor",
        "inventory.stock"
      );

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category,
      priceMinor: row.price_minor,
      stock: row.stock,
    }));
  }
}
