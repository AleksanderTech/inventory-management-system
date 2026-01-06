import { ProductCategory } from "./constants.ts";

export type ProductWithStock = {
  id: string;
  category: ProductCategory;
  priceMinor: number;
  stock: number;
};
