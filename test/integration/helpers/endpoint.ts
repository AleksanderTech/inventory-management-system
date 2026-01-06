export const Endpoint = {
  products: "/products",
  restockProduct: (id: string) => `/products/${id}/restock`,
} as const;
