import type { Knex } from "knex";

export class SubtractStockWriter {
  #db: Knex;

  constructor(db: Knex) {
    this.#db = db;
  }

  async subtractStock(
    productId: string,
    amount: number,
    updatedAt: number,
    trx?: Knex.Transaction
  ): Promise<number | null> {
    const conn = trx ?? this.#db;
    const rows = await conn("inventory")
      .where({ product_id: productId })
      .where("stock", ">=", amount)
      .update({
        stock: conn.raw("stock - ?", [amount]),
        updated_at: updatedAt,
      })
      .returning("stock");

    return rows[0]?.stock ?? null;
  }
}
