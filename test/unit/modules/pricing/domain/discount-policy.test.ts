import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MainDiscountPolicy,
} from "../../../../../src/modules/pricing/domain/discount/main-discount-policy.ts";
import { DiscountReason } from "../../../../../src/modules/shared/contracts/pricing/model/constants.ts";
import { ProductCategory } from "../../../../../src/modules/shared/contracts/product/model/constants.ts";
import type { DiscountPolicyParams } from "../../../../../src/modules/shared/contracts/pricing/model/types.ts";
import { DiscountRules } from "../../../../../src/modules/pricing/domain/discount/rules.ts";
import { PolishBankHolidayMonthDays, HolidayDiscountCategoriesList } from "../../../../../src/modules/pricing/model/constants.ts";

describe("unit tests: MainDiscountPolicy", () => {
  const policy = new MainDiscountPolicy(DiscountRules);
  const holidayDate = new Date(`2025-${PolishBankHolidayMonthDays[0]}T12:00:00Z`);
  const holidayCategory = HolidayDiscountCategoriesList[0];

  const baseParams: DiscountPolicyParams = {
    totalUnits: 1,
    date: new Date("2025-02-10T12:00:00Z"),
    categories: [ProductCategory.mugs],
  };

  const cases = [
    {
      name: "no discount when no rules match",
      params: { ...baseParams, totalUnits: 1, categories: [ProductCategory.brewers] },
      expected: { percent: 0, reason: DiscountReason.none },
    },
    {
      name: "volume 5 applies at threshold",
      params: { ...baseParams, totalUnits: 5 },
      expected: { percent: 10, reason: DiscountReason.volume5 },
    },
    {
      name: "volume 10 applies at threshold",
      params: { ...baseParams, totalUnits: 10 },
      expected: { percent: 20, reason: DiscountReason.volume10 },
    },
    {
      name: "volume 50 applies at threshold",
      params: { ...baseParams, totalUnits: 50 },
      expected: { percent: 30, reason: DiscountReason.volume50 },
    },
    {
      name: "black friday applies",
      params: {
        ...baseParams,
        totalUnits: 1,
        date: new Date("2025-11-28T12:00:00Z"),
        categories: [ProductCategory.brewers],
      },
      expected: { percent: 25, reason: DiscountReason.blackFriday },
    },
    {
      name: "holiday sale applies only for eligible categories",
      params: {
        ...baseParams,
        totalUnits: 1,
        date: holidayDate,
        categories: [holidayCategory],
      },
      expected: { percent: 15, reason: DiscountReason.holidaySale },
    },
    {
      name: "holiday sale skipped for ineligible categories",
      params: {
        ...baseParams,
        totalUnits: 1,
        date: holidayDate,
        categories: [ProductCategory.accessories],
      },
      expected: { percent: 0, reason: DiscountReason.none },
    },
    {
      name: "uses highest percent when multiple rules match",
      params: {
        ...baseParams,
        totalUnits: 50,
        date: new Date("2025-11-28T12:00:00Z"),
        categories: [ProductCategory.coffee],
      },
      expected: { percent: 30, reason: DiscountReason.volume50 },
    },
  ];

  for (const { name, params, expected } of cases) {
    it(`resolves discount: ${name}`, () => {
      const result = policy.resolve(params);
      assert.deepStrictEqual(result, expected);
    });
  }
});
