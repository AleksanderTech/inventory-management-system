export const Endpoint = {
  products: "/products",
  restockProduct: (id: string) => `/products/${id}/restock`,
  sellProduct: (id: string) => `/products/${id}/sell`,
} as const;
