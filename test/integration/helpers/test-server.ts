import type { Knex } from "knex";
import { RootDir } from "../../../root.ts";
import { buildApp } from "../../../src/app/build-app.ts";
import { createDependencies } from "../../../src/app/dependencies.ts";
import { initDb } from "../../../src/infra/db/db.ts";
import DbConfig from "../../../knexfile.js";
import path from "node:path";
import type { Server } from "node:http";

async function createDb(): Promise<{ db: Knex }> {
  const db = await initDb(DbConfig.test());
  await db.migrate.latest({
    directory: path.join(RootDir, "db", "migrations"),
  });
  return { db };
}

async function buildTestApp(db: Knex) {
  const dependencies = await createDependencies({ db });
  return buildApp({ dependencies });
}

export async function startTestServer() {
  const { db } = await createDb();
  const app = await buildTestApp(db);
  const server = await new Promise<Server>((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const { port } = server.address() as { port: number };
  const baseUrl = `http://localhost:${port}`;

  return { server, db, baseUrl };
}

export async function stopServer(server: Server, db: Knex) {
  await new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve()))
  );
  await db.destroy();
}
