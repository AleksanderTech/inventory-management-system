import type { Knex } from "knex";

export const createDependencies = async ({ db }: { db: Knex }) => {
  return {};
};

export type AppDependencies = Awaited<ReturnType<typeof createDependencies>>;
