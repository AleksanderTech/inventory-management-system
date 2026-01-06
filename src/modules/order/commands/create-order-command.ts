import crypto from "node:crypto";
import type { Knex } from "knex";
import { AppError } from "../../shared/error/app-error.ts";
import { ErrorCode } from "../../shared/error/error-code.ts";
import type { CreateOrderInput, CreateOrderOutput } from "../model/types.ts";
import { OrderPricing } from "../domain/order-pricing.ts";
import { normalizeOrderItems } from "./normalize-order-items.ts";
import type { CustomerReader } from "../../shared/contracts/customer/data/customer-reader.ts";
import type { ProductsWithStockReader } from "../../shared/contracts/product/data/products-with-stock-reader.ts";
import {
  toCreateOrderOutput,
  toOrderPricingParams,
  toOrderWriteParams,
} from "./create-order-mappers.ts";
import { SubtrackStockWriter } from "../../product/data/subtract-stock-writer.ts";
import { OrderWriter } from "../data/order-writer.ts";

export class CreateOrderCommand {
  #db: Knex;
  #orderPricing: OrderPricing;
  #customerReader: CustomerReader;
  #productsReader: ProductsWithStockReader;
  #substractStockWriter: SubtrackStockWriter;
  #orderWriter: OrderWriter;

  constructor(
    db: Knex,
    orderPricing: OrderPricing,
    customerReader: CustomerReader,
    productsReader: ProductsWithStockReader,
    substractStockWriter: SubtrackStockWriter,
    orderWriter: OrderWriter
  ) {
    this.#db = db;
    this.#orderPricing = orderPricing;
    this.#customerReader = customerReader;
    this.#productsReader = productsReader;
    this.#substractStockWriter = substractStockWriter;
    this.#orderWriter = orderWriter;
  }

  async execute(input: CreateOrderInput): Promise<CreateOrderOutput> {
    const now = new Date();
    const nowMs = now.getTime();
    const normalizedOrderItems = normalizeOrderItems(input.products);

    return this.#db.transaction(async (trx) => {
      // check customer
      const customer = await this.#customerReader.getCustomer(input.customerId, trx);
      if (!customer) {
        throw new AppError({
          errorCode: ErrorCode.resourceNotFound,
          message: "Customer not found",
        });
      }

      // check if products exist
      const products = await this.#productsReader.getMapByIds(
        normalizedOrderItems.map((i) => i.productId),
        trx
      );
      if (products.size !== normalizedOrderItems.length) {
        throw new AppError({
          errorCode: ErrorCode.resourceNotFound,
          message: "One or more products not found",
        });
      }

      // price order
      const order = this.#orderPricing.priceOrder(
        toOrderPricingParams({
          location: customer.location,
          date: now,
          items: normalizedOrderItems,
          products,
        })
      );

      // insert order
      const createdOrder = await this.#orderWriter.create(
        toOrderWriteParams({
          orderId: crypto.randomUUID(),
          customerId: customer.id,
          createdAt: nowMs,
          order,
        }),
        trx
      );

      // update stock
      for (const item of order.items) {
        const updatedStock = await this.#substractStockWriter.subtractStock(
          item.productId,
          item.quantity,
          nowMs,
          trx
        );

        if (updatedStock === null) {
          throw new AppError({
            errorCode: ErrorCode.insufficientStock,
            message: `Insufficient stock for product ${item.productId}`,
          });
        }
      }

      return toCreateOrderOutput(createdOrder) satisfies CreateOrderOutput;
    });
  }
}
