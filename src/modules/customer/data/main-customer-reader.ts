import type { Knex } from "knex";
import type { CustomerReader } from "../../shared/contracts/customer/data/customer-reader.ts";
import type { Customer } from "../../shared/contracts/customer/model/types.ts";

export class MainCustomerReader implements CustomerReader {
  #db: Knex;

  constructor(db: Knex) {
    this.#db = db;
  }

  async getCustomer(customerId: string, trx?: Knex.Transaction): Promise<Customer | null> {
    const conn = trx ?? this.#db;

    return conn("customer").where({ id: customerId }).first("id", "location");
  }
}
