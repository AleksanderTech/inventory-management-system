import { DiscountReason } from "../../shared/contracts/pricing/model/constants.ts";
import type { DiscountPolicyResult } from "../../shared/contracts/pricing/model/types.ts";
import { ProductCategory } from "../../shared/contracts/product/model/constants.ts";

export const PolishBankHolidayMonthDays = [
  "01-01",
  "01-06",
  "05-01",
  "05-03",
  "11-01",
  "11-11",
  "12-25",
  "12-26",
];

export const DiscountTimeZone = "Europe/Warsaw";

export const NoDiscount: DiscountPolicyResult = {
  percent: 0,
  reason: DiscountReason.none,
};

export const HolidayDiscountCategoriesList: ProductCategory[] = [
  ProductCategory.mugs,
  ProductCategory.coffee,
];
