import type { CreateOrderItemInput } from "../model/types.ts";

export function normalizeOrderItems(items: CreateOrderItemInput[]): CreateOrderItemInput[] {
  const map = new Map<string, number>();

  for (const item of items) {
    map.set(item.productId, (map.get(item.productId) ?? 0) + item.quantity);
  }

  return [...map.entries()].map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
}
