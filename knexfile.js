import { RootDir } from "./root.ts";
import path from "path";

export default {
  development: ({ filename } = {}) => ({
    client: "better-sqlite3",
    connection: {
      filename: filename || path.join(RootDir, "db", "db", "db.sqlite"),
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
  }),
};
