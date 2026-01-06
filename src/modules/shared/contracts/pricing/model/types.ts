import { CustomerLocation } from "../../customer/model/constants.ts";
import { ProductCategory } from "../../product/model/constants.ts";

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
