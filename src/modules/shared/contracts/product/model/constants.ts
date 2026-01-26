export const ProductCategory = {
  mugs: "mugs",
  coffee: "coffee",
  brewers: "brewers",
  accessories: "accessories",
} as const;

export type ProductCategory = (typeof ProductCategory)[keyof typeof ProductCategory];
