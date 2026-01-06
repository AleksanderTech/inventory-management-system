import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CustomerLocation } from "../../../../../src/modules/shared/contracts/customer/model/constants.ts";
import { ProductCategory } from "../../../../../src/modules/shared/contracts/product/model/constants.ts";
import { MainPriceCalculator } from "../../../../../src/modules/pricing/domain/main-price-calculator.ts";
import type { PriceCalculationParams } from "../../../../../src/modules/shared/contracts/pricing/model/types.ts";

describe("unit tests: MainPriceCalculator", () => {
  const calculator = new MainPriceCalculator();

  const baseParams: PriceCalculationParams = {
    unitPriceMinor: 1000,
    quantity: 1,
    location: CustomerLocation.unitedStates,
    category: ProductCategory.mugs,
    date: new Date("2026-01-01T00:00:00Z"),
  };

  const cases = [
    {
      name: "unitedStates keeps base price",
      params: { ...baseParams, location: CustomerLocation.unitedStates, quantity: 3 },
      expectedUnit: 1000,
      expectedLine: 3000,
    },
    {
      name: "europe applies 15% increase",
      params: { ...baseParams, location: CustomerLocation.europe, quantity: 2 },
      expectedUnit: 1150,
      expectedLine: 2300,
    },
    {
      name: "asia applies 5% decrease",
      params: { ...baseParams, location: CustomerLocation.asia, quantity: 2 },
      expectedUnit: 950,
      expectedLine: 1900,
    },
    {
      name: "rounds down unit price",
      params: { ...baseParams, location: CustomerLocation.europe, unitPriceMinor: 999 },
      expectedUnit: 1148,
      expectedLine: 1148,
    },
  ];

  for (const { name, params, expectedUnit, expectedLine } of cases) {
    it(`calculates price: ${name}`, () => {
      const result = calculator.calculate(params);
      assert.equal(result.unitPriceMinor, expectedUnit);
      assert.equal(result.lineTotalMinor, expectedLine);
    });
  }

  it("throws for unsupported location", () => {
    assert.throws(() =>
      calculator.calculate({
        ...baseParams,
        location: "africa" as CustomerLocation,
      })
    );
  });
});
