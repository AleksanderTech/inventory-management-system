import assert from "node:assert/strict";
import type { Server } from "node:http";
import { afterEach, beforeEach, describe, it } from "node:test";
import type { Knex } from "knex";
import { startTestServer, stopServer } from "./helpers/test-server.ts";
import { requestJson } from "./helpers/request-json.ts";
import { Endpoint } from "./helpers/endpoint.ts";

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

  it("returns empty list", async () => {
    const { status, body } = await requestJson<{ id: string }[]>(baseUrl, Endpoint.products, {
      method: "GET",
    });

    assert.equal(status, 200);
    assert.equal(body?.length, 0);
  });
});
