import { CustomerLocation } from "../../shared/contracts/customer/model/constants";
import { DiscountReason } from "../../shared/contracts/pricing/model/constants";
import { ProductCategory } from "../../shared/contracts/product/model/constants";

// data
export type OrderRecord = {
  id: string;
  customerId: string;
  totalMinor: number;
  discountPercent: number;
  discountReason: DiscountReason;
  createdAt: number;
};

export type OrderItemRecord = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPriceMinor: number;
  lineTotalMinor: number;
};

export type OrderWriteParams = OrderRecord & { items: OrderItemRecord[] };
export type OrderWriteResult = OrderWriteParams;

// app
export type CreateOrderItemInput = {
  productId: string;
  quantity: number;
};

export type CreateOrderInput = {
  customerId: string;
  products: CreateOrderItemInput[];
};

export type CreateOrderOutput = {
  id: string;
  customerId: string;
  totalMinor: number;
  discountPercent: number;
  discountReason: DiscountReason;
  items: {
    id: string;
    productId: string;
    quantity: number;
    unitPriceMinor: number;
    lineTotalMinor: number;
  }[];
};

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

// api
export type CreateOrderRequest = CreateOrderInput;
export type CreateOrderResponse = CreateOrderOutput;
