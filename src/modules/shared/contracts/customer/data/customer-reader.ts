import type { Knex } from "knex";
import type { Customer } from "../model/types.ts";

export interface CustomerReader {
  getCustomer(customerId: string, trx?: Knex.Transaction): Promise<Customer | null>;
}
