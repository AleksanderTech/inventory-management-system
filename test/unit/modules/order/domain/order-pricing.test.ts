import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { OrderPricing } from "../../../../../src/modules/order/domain/order-pricing.ts";
import { DiscountReason } from "../../../../../src/modules/shared/contracts/pricing/model/constants.ts";
import { CustomerLocation } from "../../../../../src/modules/shared/contracts/customer/model/constants.ts";
import { ProductCategory } from "../../../../../src/modules/shared/contracts/product/model/constants.ts";
import type { DiscountPolicyResult } from "../../../../../src/modules/shared/contracts/pricing/model/types.ts";
import type {
  PriceCalculationParams,
  PriceCalculationResult,
} from "../../../../../src/modules/shared/contracts/pricing/model/types.ts";

describe("unit tests: OrderPricing", () => {
  it("prices lines and applies discount to total", () => {
    // given
    const discountPercent = 10;
    const priceCalculator = {
      calculate: (params: PriceCalculationParams): PriceCalculationResult => ({
        unitPriceMinor: params.unitPriceMinor,
        lineTotalMinor: params.unitPriceMinor * params.quantity,
      }),
    };
    const discountPolicy = {
      resolve: (): DiscountPolicyResult => ({
        percent: discountPercent,
        reason: DiscountReason.volume10,
      }),
    };
    const orderPricing = new OrderPricing(priceCalculator, discountPolicy);
    const date = new Date("2025-01-15T12:00:00Z");

    // when
    const order = orderPricing.priceOrder({
      location: CustomerLocation.unitedStates,
      date,
      lines: [
        {
          productId: "p1",
          category: ProductCategory.mugs,
          quantity: 2,
          unitPriceMinor: 100,
        },
        {
          productId: "p2",
          category: ProductCategory.coffee,
          quantity: 1,
          unitPriceMinor: 200,
        },
      ],
    });

    // then
    assert.deepStrictEqual(order.items, [
      {
        productId: "p1",
        category: ProductCategory.mugs,
        quantity: 2,
        unitPriceMinor: 100,
        lineTotalMinor: 200,
      },
      {
        productId: "p2",
        category: ProductCategory.coffee,
        quantity: 1,
        unitPriceMinor: 200,
        lineTotalMinor: 200,
      },
    ]);
    assert.equal(order.discountPercent, discountPercent);
    assert.equal(order.discountReason, DiscountReason.volume10);
    assert.equal(order.totalMinor, 360);
  });
});
