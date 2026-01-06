import { DiscountReason } from "../../shared/contracts/pricing/model/constants.ts";
import { ProductCategory } from "../../shared/contracts/product/model/constants.ts";

export type OrderItem = {
  productId: string;
  category: ProductCategory;
  quantity: number;
  unitPriceMinor: number;
  lineTotalMinor: number;
};

export class Order {
  items: OrderItem[];
  discountPercent: number;
  discountReason: DiscountReason;
  totalMinor: number;

  constructor(params: {
    items: OrderItem[];
    discount: {
      percent: number;
      reason: DiscountReason;
    };
  }) {
    if (params.items.length === 0) {
      throw new Error("Order must have at least one item");
    }

    for (const item of params.items) {
      if (item.quantity <= 0) {
        throw new Error("Quantity must be > 0");
      }
    }

    if (params.discount.percent < 0 || params.discount.percent > 100) {
      throw new Error("Invalid discount percent");
    }

    this.items = params.items;
    this.discountPercent = params.discount.percent;
    this.discountReason = params.discount.reason;
    const subtotalMinor = params.items.reduce((s, i) => s + i.lineTotalMinor, 0);
    this.totalMinor = Math.floor(subtotalMinor * (1 - this.discountPercent / 100));
  }
}
