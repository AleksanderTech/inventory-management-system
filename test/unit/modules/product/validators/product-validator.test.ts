import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateCreateProduct } from "../../../../../src/modules/product/validators/product-validator.ts";
import { ProductCategory } from "../../../../../src/modules/shared/contracts/product/model/constants.ts";
import { AppError } from "../../../../../src/modules/shared/error/app-error.ts";
import { ErrorCode } from "../../../../../src/modules/shared/error/error-code.ts";
import type { CreateProductRequest } from "../../../../../src/modules/product/model/types.ts";

describe("unit tests: validateCreateProduct", () => {
  const basePayload: CreateProductRequest = {
    name: "Classic Mug",
    description: "Blue mug",
    category: ProductCategory.mugs,
    priceMinor: 1299,
    stock: 10,
  };

  it("accepts valid payload", () => {
    const result = validateCreateProduct(basePayload);
    assert.deepStrictEqual(result, basePayload);
  });

  const cases: { name: string; payload: unknown }[] = [
    { name: "missing name", payload: { ...basePayload, name: undefined } },
    { name: "missing description", payload: { ...basePayload, description: undefined } },
    { name: "missing category", payload: { ...basePayload, category: undefined } },
    { name: "missing priceMinor", payload: { ...basePayload, priceMinor: undefined } },
    { name: "missing stock", payload: { ...basePayload, stock: undefined } },
    { name: "name too long", payload: { ...basePayload, name: "a".repeat(51) } },
    { name: "description too long", payload: { ...basePayload, description: "a".repeat(51) } },
    { name: "invalid category", payload: { ...basePayload, category: "tea" } },
    { name: "priceMinor below min", payload: { ...basePayload, priceMinor: 0 } },
    { name: "stock below min", payload: { ...basePayload, stock: -1 } },
    { name: "priceMinor not integer", payload: { ...basePayload, priceMinor: 1.5 } },
    { name: "stock not integer", payload: { ...basePayload, stock: 1.5 } },
  ];

  for (const { name, payload } of cases) {
    it(`rejects when ${name}`, () => {
      assert.throws(
        () => validateCreateProduct(payload),
        (error) => {
          assert.ok(error instanceof AppError);
          assert.equal(error.errorCode, ErrorCode.validationError);
          return true;
        }
      );
    });
  }
});
