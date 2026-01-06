import type { Knex } from "knex";
import type { OrderWriteParams, OrderWriteResult } from "../model/types.ts";

export class OrderWriter {
  #db: Knex;

  constructor(db: Knex) {
    this.#db = db;
  }

  async create(params: OrderWriteParams, trx?: Knex.Transaction): Promise<OrderWriteResult> {
    const conn = trx ?? this.#db;

    await conn("order").insert({
      id: params.id,
      customer_id: params.customerId,
      total_minor: params.totalMinor,
      discount_percent: params.discountPercent,
      discount_reason: params.discountReason,
      created_at: params.createdAt,
    });
    await conn("order_item").insert(
      params.items.map((item) => ({
        id: item.id,
        order_id: item.orderId,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price_minor: item.unitPriceMinor,
        line_total_minor: item.lineTotalMinor,
      }))
    );

    return params;
  }
}
