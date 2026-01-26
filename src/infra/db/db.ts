import knex from "knex";

export async function initDb(config: knex.Knex.Config) {
  const db = knex(config);

  try {
    await db.raw("select 1");
  } catch (err) {
    console.error("DB init failed", err);
    process.exit(1);
  }

  return db;
}
