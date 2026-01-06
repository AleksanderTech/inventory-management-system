import { requestJson } from "./request-json.ts";
import { Endpoint } from "./endpoint.ts";
import type {
  CreateProductRequest,
  CreateProductResponse,
} from "../../../src/modules/product/model/types.ts";
import { ProductCategory } from "../../../src/modules/shared/contracts/product/model/constants.ts";

export function buildProduct(overrides: Partial<CreateProductRequest> = {}): CreateProductRequest {
  return {
    name: "Classic Mug",
    description: "Blue mug",
    category: ProductCategory.mugs,
    priceMinor: 1299,
    stock: 10,
    ...overrides,
  };
}

export async function createProduct(
  baseUrl: string,
  overrides: Partial<CreateProductRequest> = {}
): Promise<CreateProductResponse> {
  const payload = buildProduct(overrides);
  const { status, body } = await requestJson<CreateProductResponse>(baseUrl, Endpoint.products, {
    method: "POST",
    body: payload,
  });

  if (status !== 201 || !body) {
    throw new Error(`Expected 201, got ${status}`);
  }

  return body;
}

export async function createProducts(
  baseUrl: string,
  inputs: Partial<CreateProductRequest>[]
): Promise<CreateProductResponse[]> {
  const results: CreateProductResponse[] = [];
  for (const input of inputs) {
    results.push(await createProduct(baseUrl, input));
  }
  return results;
}
