import { CustomerLocation } from "../../customer/model/constants.ts";
import { ProductCategory } from "../../product/model/constants.ts";
import { DiscountReason } from "./constants.ts";

export type DiscountPolicyParams = {
  totalUnits: number;
  date: Date;
  categories: ProductCategory[];
};

export type DiscountPolicyResult = {
  percent: number;
  reason: DiscountReason;
};

export type PriceCalculationParams = {
  unitPriceMinor: number;
  quantity: number;
  location: CustomerLocation;
  category: ProductCategory;
  date: Date;
};

export type PriceCalculationResult = {
  unitPriceMinor: number;
  lineTotalMinor: number;
};
