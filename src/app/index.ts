import { initDb } from "../infra/db/db.ts";
import { buildApp } from "./build-app.ts";
import { Config } from "./config.ts";
import DbConfig from "../../knexfile.js";
import { createDependencies } from "./dependencies.ts";

const db = await initDb(DbConfig[Config.env as keyof typeof DbConfig]());
const dependencies = await createDependencies({ db });
const app = buildApp({ dependencies });

app.listen(Config.port, () => {
  console.log(`API listening on port: ${Config.port}`);
});
