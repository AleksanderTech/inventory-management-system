import express from "express";

export const buildApp = () => {
  const app = express();
  app.use(express.json());

  return app;
};
