export const Endpoint = {
  products: "/products",
  orders: "/orders",
  restockProduct: (id: string) => `/products/${id}/restock`,
  sellProduct: (id: string) => `/products/${id}/sell`,
} as const;
