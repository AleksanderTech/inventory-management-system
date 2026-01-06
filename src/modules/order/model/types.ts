import { CustomerLocation } from "../../shared/contracts/customer/model/constants";
import { ProductCategory } from "../../shared/contracts/product/model/constants";

// domain
export type OrderPricingParams = {
  location: CustomerLocation;
  date: Date;
  lines: {
    productId: string;
    category: ProductCategory;
    quantity: number;
    unitPriceMinor: number;
  }[];
};