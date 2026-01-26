import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateCreateOrder } from "../../../../../src/modules/order/validators/order-validator.ts";
import { AppError } from "../../../../../src/modules/shared/error/app-error.ts";
import { ErrorCode } from "../../../../../src/modules/shared/error/error-code.ts";
import type { CreateOrderInput } from "../../../../../src/modules/order/model/types.ts";

describe("unit tests: validateCreateOrder", () => {
  const basePayload: CreateOrderInput = {
    customerId: crypto.randomUUID(),
    products: [{ productId: crypto.randomUUID(), quantity: 1 }],
  };

  it("accepts valid payload", () => {
    const result = validateCreateOrder(basePayload);
    assert.deepStrictEqual(result, basePayload);
  });

  const cases: { name: string; payload: unknown }[] = [
    { name: "missing customerId", payload: { ...basePayload, customerId: undefined } },
    { name: "invalid customerId", payload: { ...basePayload, customerId: "not-a-uuid" } },
    { name: "missing products", payload: { ...basePayload, products: undefined } },
    { name: "empty products", payload: { ...basePayload, products: [] } },
    {
      name: "missing productId",
      payload: { ...basePayload, products: [{ quantity: 1 }] },
    },
    {
      name: "invalid productId",
      payload: { ...basePayload, products: [{ productId: "invalid", quantity: 1 }] },
    },
    {
      name: "quantity below min",
      payload: {
        ...basePayload,
        products: [{ productId: basePayload.products[0].productId, quantity: 0 }],
      },
    },
    {
      name: "quantity not integer",
      payload: {
        ...basePayload,
        products: [{ productId: basePayload.products[0].productId, quantity: 1.5 }],
      },
    },
  ];

  for (const { name, payload } of cases) {
    it(`rejects when ${name}`, () => {
      assert.throws(
        () => validateCreateOrder(payload),
        (error) => {
          assert.ok(error instanceof AppError);
          assert.equal(error.errorCode, ErrorCode.validationError);
          return true;
        }
      );
    });
  }
});
