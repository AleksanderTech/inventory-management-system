import type { Knex } from "knex";
import { AppError } from "../../shared/error/app-error.ts";
import { ErrorCode } from "../../shared/error/error-code.ts";
import type { SellProductOutput } from "../model/types.ts";
import { SubtractStockWriter } from "../data/subtract-stock-writer.ts";

export class SellProductCommand {
  #db;
  #subtractStockWriter;

  constructor(db: Knex, subtractStockWriter: SubtractStockWriter) {
    this.#db = db;
    this.#subtractStockWriter = subtractStockWriter;
  }

  async execute(productId: string, amount: number): Promise<SellProductOutput> {
    return this.#db.transaction(async (trx) => {
      const now = Date.now();
      const updatedStock = await this.#subtractStockWriter.subtractStock(
        productId,
        amount,
        now,
        trx
      );

      if (updatedStock === null) {
        const inventory = await trx("inventory").where({ product_id: productId }).first("stock");

        if (!inventory) {
          throw new AppError({
            errorCode: ErrorCode.resourceNotFound,
            message: "Product not found",
          });
        }

        throw new AppError({
          errorCode: ErrorCode.insufficientStock,
          message: "Insufficient stock",
        });
      }

      return { productId, stock: updatedStock };
    });
  }
}
