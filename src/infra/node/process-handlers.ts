import type { Server } from "node:http";
import type knex from "knex";

export function registerProcessErrorHandlers() {
  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled promise rejection", reason);
    process.exit(1);
  });

  process.on("uncaughtException", (err) => {
    console.error("Uncaught exception", err);
    process.exit(1);
  });
}

export function registerGracefulShutdown(server: Server, db: knex.Knex) {
  let isShuttingDown = false;

  async function shutdown(signal: string) {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`Received ${signal}, shutting down...`);
    server.close(async () => {
      try {
        await db.destroy();
        process.exit(0);
      } catch (err) {
        console.error("Failed to close DB", err);
        process.exit(1);
      }
    });
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}
