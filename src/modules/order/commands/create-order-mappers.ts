import crypto from "node:crypto";
import type {
  CreateOrderItemInput,
  CreateOrderOutput,
  OrderPricingParams,
  OrderWriteParams,
  OrderWriteResult,
} from "../model/types.ts";
import type { CustomerLocation } from "../../shared/contracts/customer/model/constants.ts";
import type { ProductWithStock } from "../../shared/contracts/product/model/types.ts";
import type { Order } from "../domain/order.ts";

export function toOrderPricingParams(params: {
  location: CustomerLocation;
  date: Date;
  items: CreateOrderItemInput[];
  products: Map<string, ProductWithStock>;
}): OrderPricingParams {
  return {
    location: params.location,
    date: params.date,
    lines: params.items.map((item) => {
      const product = params.products.get(item.productId)!;
      return {
        productId: product.id,
        category: product.category,
        quantity: item.quantity,
        unitPriceMinor: product.priceMinor,
      };
    }),
  };
}

export function toOrderWriteParams(params: {
  orderId: string;
  customerId: string;
  createdAt: number;
  order: Order;
}): OrderWriteParams {
  return {
    id: params.orderId,
    customerId: params.customerId,
    totalMinor: params.order.totalMinor,
    discountPercent: params.order.discountPercent,
    discountReason: params.order.discountReason,
    createdAt: params.createdAt,
    items: params.order.items.map((item) => ({
      id: crypto.randomUUID(),
      orderId: params.orderId,
      productId: item.productId,
      quantity: item.quantity,
      unitPriceMinor: item.unitPriceMinor,
      lineTotalMinor: item.lineTotalMinor,
    })),
  };
}

export function toCreateOrderOutput(createdOrder: OrderWriteResult): CreateOrderOutput {
  return {
    id: createdOrder.id,
    customerId: createdOrder.customerId,
    totalMinor: createdOrder.totalMinor,
    discountPercent: createdOrder.discountPercent,
    discountReason: createdOrder.discountReason,
    items: createdOrder.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPriceMinor: item.unitPriceMinor,
      lineTotalMinor: item.lineTotalMinor,
    })),
  };
}
