import crypto from "node:crypto";
import type { Knex } from "knex";
import type { CreateProductInput, CreateProductOutput } from "../model/types.ts";

export class CreateProductCommand {
  #db;

  constructor(db: Knex) {
    this.#db = db;
  }

  async execute(input: CreateProductInput): Promise<CreateProductOutput> {
    const now = Date.now();
    const id = crypto.randomUUID();

    await this.#db.transaction(async (trx) => {
      await trx("product").insert({
        id,
        name: input.name,
        description: input.description,
        category: input.category,
        price_minor: input.priceMinor,
        created_at: now,
      });
      await trx("inventory").insert({
        product_id: id,
        stock: input.stock,
        updated_at: now,
      });
    });

    return {
      id,
      name: input.name,
      description: input.description,
      category: input.category,
      priceMinor: input.priceMinor,
      stock: input.stock,
    } satisfies CreateProductOutput;
  }
}
