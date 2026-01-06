import assert from "node:assert/strict";
import crypto from "node:crypto";
import type { Server } from "node:http";
import { afterEach, beforeEach, describe, it } from "node:test";
import type { Knex } from "knex";
import { startTestServer, stopServer } from "./helpers/test-server.ts";
import { requestJson } from "./helpers/request-json.ts";
import { Endpoint } from "./helpers/endpoint.ts";
import type { CreateOrderRequest, CreateOrderResponse } from "../../src/modules/order/model/types.ts";
import { CustomerLocation } from "../../src/modules/shared/contracts/customer/model/constants.ts";
import { ProductCategory } from "../../src/modules/shared/contracts/product/model/constants.ts";
import { DiscountReason } from "../../src/modules/shared/contracts/pricing/model/constants.ts";
import { ErrorCode } from "../../src/modules/shared/error/error-code.ts";
import type { ApiErrorResponse } from "../../src/infra/express/error/api-error-response.ts";
import { createProduct } from "./helpers/product-fixtures.ts";

describe("integration tests: orders", () => {
  let server: Server;
  let db: Knex;
  let baseUrl: string;

  beforeEach(async () => {
    ({ server, db, baseUrl } = await startTestServer());
  });

  afterEach(async () => {
    await stopServer(server, db);
  });

  async function insertCustomer(location: CustomerLocation = CustomerLocation.unitedStates) {
    const id = crypto.randomUUID();
    await db("customer").insert({
      id,
      location,
      created_at: Date.now(),
    });

    return { id, location };
  }

  it("creates order and returns it", async () => {
    const customer = await insertCustomer();
    const product = await createProduct(baseUrl, {
      name: "Bulk Mugs",
      category: ProductCategory.mugs,
      priceMinor: 100,
      stock: 100,
    });

    const payload: CreateOrderRequest = {
      customerId: customer.id,
      products: [{ productId: product.id, quantity: 50 }],
    };

    const { status, body } = await requestJson<CreateOrderResponse>(baseUrl, Endpoint.orders, {
      method: "POST",
      body: payload,
    });

    assert.equal(status, 201);
    assert.ok(body);
    assert.ok(body.id);
    assert.equal(body.customerId, customer.id);
    assert.equal(body.discountPercent, 30);
    assert.equal(body.discountReason, DiscountReason.volume50);
    assert.equal(body.items.length, 1);

    const item = body.items[0];
    assert.ok(item.id);
    assert.equal(item.productId, product.id);
    assert.equal(item.quantity, 50);
    assert.equal(item.unitPriceMinor, 100);
    assert.equal(item.lineTotalMinor, 5000);
    assert.equal(body.totalMinor, 3500);
  });

  it("rejects invalid payload", async () => {
    const { status, body } = await requestJson<ApiErrorResponse>(baseUrl, Endpoint.orders, {
      method: "POST",
      body: { customerId: "not-a-uuid", products: [] },
    });

    assert.equal(status, 400);
    assert.ok(body);
    assert.equal(body.errorCode, ErrorCode.validationError);
    assert.ok(body.message);
  });

  it("returns not found when customer is missing", async () => {
    const product = await createProduct(baseUrl, {
      name: "Order Beans",
      category: ProductCategory.coffee,
      priceMinor: 500,
      stock: 10,
    });

    const payload: CreateOrderRequest = {
      customerId: crypto.randomUUID(),
      products: [{ productId: product.id, quantity: 1 }],
    };

    const { status, body } = await requestJson<ApiErrorResponse>(baseUrl, Endpoint.orders, {
      method: "POST",
      body: payload,
    });

    assert.equal(status, 404);
    assert.ok(body);
    assert.equal(body.errorCode, ErrorCode.resourceNotFound);
    assert.ok(body.message);
  });

  it("returns not found when product is missing", async () => {
    const customer = await insertCustomer(CustomerLocation.europe);

    const payload: CreateOrderRequest = {
      customerId: customer.id,
      products: [{ productId: crypto.randomUUID(), quantity: 1 }],
    };

    const { status, body } = await requestJson<ApiErrorResponse>(baseUrl, Endpoint.orders, {
      method: "POST",
      body: payload,
    });

    assert.equal(status, 404);
    assert.ok(body);
    assert.equal(body.errorCode, ErrorCode.resourceNotFound);
    assert.ok(body.message);
  });

  it("rejects insufficient stock", async () => {
    const customer = await insertCustomer();
    const product = await createProduct(baseUrl, {
      name: "Limited Beans",
      category: ProductCategory.coffee,
      priceMinor: 1200,
      stock: 1,
    });

    const payload: CreateOrderRequest = {
      customerId: customer.id,
      products: [{ productId: product.id, quantity: 2 }],
    };

    const { status, body } = await requestJson<ApiErrorResponse>(baseUrl, Endpoint.orders, {
      method: "POST",
      body: payload,
    });

    assert.equal(status, 409);
    assert.ok(body);
    assert.equal(body.errorCode, ErrorCode.insufficientStock);
    assert.ok(body.message);
  });
});
