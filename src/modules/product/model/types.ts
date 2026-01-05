import { ProductCategory } from "../../shared/contracts/product/model/constants";

// app
export type ProductView = {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  priceMinor: number;
  stock: number;
};

// api
export type GetProductsResponse = ProductView[];
