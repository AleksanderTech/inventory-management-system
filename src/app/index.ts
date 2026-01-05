import { buildApp } from "./build-app.ts";

const app = buildApp();

const port = 5000;

app.listen(port, () => {
  console.log(`API listening on port: ${port}`);
});
