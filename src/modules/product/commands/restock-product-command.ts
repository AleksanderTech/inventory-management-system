import { AppError } from "../../shared/error/app-error.ts";
import { ErrorCode } from "../../shared/error/error-code.ts";
import type { RestockProductOutput } from "../model/types.ts";
import { AddStockWriter } from "../data/add-stock-writer.ts";

export class RestockProductCommand {
  #addStockWriter;

  constructor(addStockWriter: AddStockWriter) {
    this.#addStockWriter = addStockWriter;
  }

  async execute(productId: string, amount: number): Promise<RestockProductOutput> {
    const now = Date.now();
    const stock = await this.#addStockWriter.addStock(productId, amount, now);

    if (stock === null) {
      throw new AppError({
        errorCode: ErrorCode.resourceNotFound,
        message: "Product not found",
      });
    }

    return { productId, stock };
  }
}
