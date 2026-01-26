import { Order, type OrderItem } from "./order.ts";
import type { ProductCategory } from "../../shared/contracts/product/model/constants.ts";
import type { PriceCalculator } from "../../shared/contracts/pricing/domain/price-calculator.ts";
import type { DiscountPolicy } from "../../shared/contracts/pricing/domain/discount-policy.ts";
import type { OrderPricingParams } from "../model/types.ts";

export class OrderPricing {
  #priceCalculator: PriceCalculator;
  #discountPolicy: DiscountPolicy;

  constructor(priceCalculator: PriceCalculator, discountPolicy: DiscountPolicy) {
    this.#priceCalculator = priceCalculator;
    this.#discountPolicy = discountPolicy;
  }

  priceOrder(params: OrderPricingParams): Order {
    const categories = new Set<ProductCategory>();
    let totalUnits = 0;
    const items: OrderItem[] = [];

    for (const line of params.lines) {
      totalUnits += line.quantity;
      categories.add(line.category);

      const pricing = this.#priceCalculator.calculate({
        unitPriceMinor: line.unitPriceMinor,
        quantity: line.quantity,
        location: params.location,
        category: line.category,
        date: params.date,
      });

      items.push({
        productId: line.productId,
        category: line.category,
        quantity: line.quantity,
        unitPriceMinor: pricing.unitPriceMinor,
        lineTotalMinor: pricing.lineTotalMinor,
      });
    }

    const discount = this.#discountPolicy.resolve({
      totalUnits,
      date: params.date,
      categories: [...categories],
    });

    return new Order({ items, discount });
  }
}
