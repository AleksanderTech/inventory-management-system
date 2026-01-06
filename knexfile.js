import fs from "fs";
import path from "path";
import { RootDir } from "./root.ts";

const ensureSqliteDir = (filename) => {
  if (!filename || filename === ":memory:") return;
  fs.mkdirSync(path.dirname(filename), { recursive: true });
};

export default {
  development: ({ filename } = {}) => {
    const resolvedFilename = filename || path.join(RootDir, "db", "db", "db.sqlite");
    ensureSqliteDir(resolvedFilename);

    return {
      client: "better-sqlite3",
      connection: {
        filename: resolvedFilename,
      },
      migrations: {
        stub: path.join(RootDir, "db", "migrations", "stub", "migration.stub.js"),
      },
      pool: {
        min: 1,
        max: 1,
        afterCreate: (conn, done) => {
          conn.pragma("busy_timeout = 5000");
          conn.pragma("journal_mode = WAL");
          done(null, conn);
        },
      },
      useNullAsDefault: true,
    };
  },
  test: ({ filename } = {}) => ({
    client: "better-sqlite3",
    connection: {
      filename: filename || ":memory:",
    },
    migrations: {
      stub: path.join(RootDir, "db", "migrations", "stub", "migration.stub.js"),
    },
    pool: {
      min: 1,
      max: 1,
      afterCreate: (conn, done) => {
        conn.pragma("foreign_keys = ON");
        conn.pragma("busy_timeout = 5000");
        conn.pragma("journal_mode = WAL");
        done(null, conn);
      },
    },
    useNullAsDefault: true,
  }),
};
