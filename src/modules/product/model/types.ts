import { ProductCategory } from "../../shared/contracts/product/model/constants.ts";

// app
export type ProductView = {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  priceMinor: number;
  stock: number;
};

export type CreateProductInput = {
  name: string;
  description: string;
  category: ProductCategory;
  priceMinor: number;
  stock: number;
};

export type CreateProductOutput = {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  priceMinor: number;
  stock: number;
};

// api
export type GetProductsResponse = ProductView[];
export type CreateProductRequest = CreateProductInput;
export type CreateProductResponse = CreateProductOutput;