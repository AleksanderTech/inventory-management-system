import assert from "node:assert/strict";
import type { Server } from "node:http";
import { afterEach, beforeEach, describe, it } from "node:test";
import type { Knex } from "knex";
import { startTestServer, stopServer } from "./helpers/test-server.ts";
import { requestJson } from "./helpers/request-json.ts";
import { Endpoint } from "./helpers/endpoint.ts";
import type {
  CreateProductRequest,
  CreateProductResponse,
  GetProductsResponse,
  RestockProductRequest,
  RestockProductResponse,
  SellProductRequest,
  SellProductResponse,
} from "../../src/modules/product/model/types.ts";
import { ProductCategory } from "../../src/modules/shared/contracts/product/model/constants.ts";
import { ErrorCode } from "../../src/modules/shared/error/error-code.ts";
import type { ApiErrorResponse } from "../../src/infra/express/error/api-error-response.ts";
import { createProduct, createProducts } from "./helpers/product-fixtures.ts";

describe("integration tests: products", () => {
  let server: Server;
  let db: Knex;
  let baseUrl: string;

  beforeEach(async () => {
    ({ server, db, baseUrl } = await startTestServer());
  });

  afterEach(async () => {
    await stopServer(server, db);
  });

  it("returns empty list on empty database", async () => {
    const { status, body } = await requestJson<GetProductsResponse>(baseUrl, Endpoint.products, {
      method: "GET",
    });

    assert.equal(status, 200);
    assert.equal(body?.length, 0);
  });

  it("creates product and returns it", async () => {
    const payload: CreateProductRequest = {
      name: "Cappuccino Mug",
      description: "Wide mug",
      category: ProductCategory.mugs,
      priceMinor: 1599,
      stock: 7,
    };

    const { status, body } = await requestJson<CreateProductResponse>(baseUrl, Endpoint.products, {
      method: "POST",
      body: payload,
    });

    assert.equal(status, 201);
    assert.ok(body);
    assert.equal(body.name, payload.name);
    assert.equal(body.description, payload.description);
    assert.equal(body.category, payload.category);
    assert.equal(body.priceMinor, payload.priceMinor);
    assert.equal(body.stock, payload.stock);
  });

  it("rejects invalid product payload", async () => {
    const { status, body } = await requestJson<ApiErrorResponse>(baseUrl, Endpoint.products, {
      method: "POST",
      body: {
        name: "Missing fields",
      },
    });

    assert.equal(status, 400);
    assert.ok(body);
    assert.equal(body.errorCode, ErrorCode.validationError);
    assert.ok(body.message);
  });

  it("rejects invalid numeric values", async () => {
    const { status, body } = await requestJson<ApiErrorResponse>(baseUrl, Endpoint.products, {
      method: "POST",
      body: {
        name: "Bad numbers",
        description: "Invalid price and stock",
        category: ProductCategory.mugs,
        priceMinor: 0,
        stock: -1,
      },
    });

    assert.equal(status, 400);
    assert.ok(body);
    assert.equal(body.errorCode, ErrorCode.validationError);
    assert.ok(body.message);
  });

  it("creates products and returns them", async () => {
    const created = await createProducts(baseUrl, [
      {
        name: "Great Mug",
      },
      {
        name: "Espresso Beans",
        description: "Dark roast",
        category: ProductCategory.coffee,
        priceMinor: 2499,
        stock: 5,
      },
    ]);

    const { status: listStatus, body: listBody } = await requestJson<GetProductsResponse>(
      baseUrl,
      Endpoint.products,
      { method: "GET" }
    );

    assert.equal(listStatus, 200);
    assert.ok(listBody);
    assert.equal(listBody.length, created.length);

    const listedById = new Map(listBody.map((product) => [product.id, product]));

    for (const product of created) {
      assert.deepStrictEqual(listedById.get(product.id), product);
    }
  });

  it("restocks product and returns updated stock", async () => {
    const created = await createProduct(baseUrl);

    const { status, body } = await requestJson<RestockProductResponse>(
      baseUrl,
      Endpoint.restockProduct(created.id),
      {
        method: "POST",
        body: { amount: 3 } satisfies RestockProductRequest,
      }
    );

    assert.equal(status, 200);
    assert.ok(body);
    assert.equal(body.productId, created.id);
    assert.equal(body.stock, created.stock + 3);
  });

  it("rejects invalid restock payload", async () => {
    const created = await createProduct(baseUrl);

    const { status, body } = await requestJson<ApiErrorResponse>(
      baseUrl,
      Endpoint.restockProduct(created.id),
      {
        method: "POST",
        body: { amount: 0 },
      }
    );

    assert.equal(status, 400);
    assert.ok(body);
    assert.equal(body.errorCode, ErrorCode.validationError);
    assert.ok(body.message);
  });

  it("returns not found when restocking unknown product", async () => {
    const { status, body } = await requestJson<ApiErrorResponse>(
      baseUrl,
      Endpoint.restockProduct(crypto.randomUUID()),
      {
        method: "POST",
        body: { amount: 2 },
      }
    );

    assert.equal(status, 404);
    assert.ok(body);
    assert.equal(body.errorCode, ErrorCode.resourceNotFound);
    assert.ok(body.message);
  });

  it("sells product and returns updated stock", async () => {
    const created = await createProduct(baseUrl, { stock: 5 });

    const { status, body } = await requestJson<SellProductResponse>(
      baseUrl,
      Endpoint.sellProduct(created.id),
      {
        method: "POST",
        body: { amount: 3 } satisfies SellProductRequest,
      }
    );

    assert.equal(status, 200);
    assert.ok(body);
    assert.equal(body.productId, created.id);
    assert.equal(body.stock, created.stock - 3);
  });

  it("rejects invalid sell payload", async () => {
    const created = await createProduct(baseUrl);

    const { status, body } = await requestJson<ApiErrorResponse>(
      baseUrl,
      Endpoint.sellProduct(created.id),
      {
        method: "POST",
        body: { amount: 0 },
      }
    );

    assert.equal(status, 400);
    assert.ok(body);
    assert.equal(body.errorCode, ErrorCode.validationError);
    assert.ok(body.message);
  });

  it("returns not found when selling unknown product", async () => {
    const { status, body } = await requestJson<ApiErrorResponse>(
      baseUrl,
      Endpoint.sellProduct(crypto.randomUUID()),
      {
        method: "POST",
        body: { amount: 2 },
      }
    );

    assert.equal(status, 404);
    assert.ok(body);
    assert.equal(body.errorCode, ErrorCode.resourceNotFound);
    assert.ok(body.message);
  });

  it("rejects selling more than stock", async () => {
    const created = await createProduct(baseUrl, { stock: 1 });

    const { status, body } = await requestJson<ApiErrorResponse>(
      baseUrl,
      Endpoint.sellProduct(created.id),
      {
        method: "POST",
        body: { amount: 2 },
      }
    );

    assert.equal(status, 409);
    assert.ok(body);
    assert.equal(body.errorCode, ErrorCode.insufficientStock);
    assert.ok(body.message);
  });
});
