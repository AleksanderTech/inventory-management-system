/** @type {import('knex').Knex} */

export async function up(knex) {
  await knex.raw(`
    CREATE TABLE product (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      price_minor INTEGER NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
    ) STRICT;
  `);

  await knex.raw(`
    CREATE TABLE inventory (
      product_id TEXT PRIMARY KEY REFERENCES product(id) ON DELETE CASCADE,
      stock INTEGER NOT NULL,
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
    ) STRICT;
  `);

  await knex.raw(`
    CREATE TABLE customer (
      id TEXT PRIMARY KEY,
      location TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
    ) STRICT;
  `);

  await knex.raw(`
    CREATE TABLE "order" (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL REFERENCES customer(id) ON DELETE RESTRICT,
      total_minor INTEGER NOT NULL,
      discount_percent INTEGER NOT NULL,
      discount_reason TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
    ) STRICT;
  `);

  await knex.raw(`
    CREATE TABLE order_item (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL REFERENCES product(id) ON DELETE RESTRICT,
      quantity INTEGER NOT NULL,
      unit_price_minor INTEGER NOT NULL,
      line_total_minor INTEGER NOT NULL
    ) STRICT;
  `);
}

export async function down(knex) {
  await knex.raw(`DROP TABLE IF EXISTS order_item;`);
  await knex.raw(`DROP TABLE IF EXISTS "order";`);
  await knex.raw(`DROP TABLE IF EXISTS customer;`);
  await knex.raw(`DROP TABLE IF EXISTS inventory;`);
  await knex.raw(`DROP TABLE IF EXISTS product;`);
}
