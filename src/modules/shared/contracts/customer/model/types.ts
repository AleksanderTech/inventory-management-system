import { CustomerLocation } from "./constants.ts";

export type Customer = {
  id: string;
  location: CustomerLocation;
  createdAt: number;
};
