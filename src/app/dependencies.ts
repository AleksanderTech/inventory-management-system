import type { Knex } from "knex";
import { GetProductsQuery } from "../modules/product/queries/get-products-query.ts";
import { CreateProductCommand } from "../modules/product/commands/create-product-command.ts";
import { AddStockWriter } from "../modules/product/data/add-stock-writer.ts";
import { RestockProductCommand } from "../modules/product/commands/restock-product-command.ts";
import { SubtrackStockWriter } from "../modules/product/data/subtract-stock-writer.ts";
import { SellProductCommand } from "../modules/product/commands/sell-product-command.ts";
import { MainCustomerReader } from "../modules/customer/data/main-customer-reader.ts";
import { MainPriceCalculator } from "../modules/pricing/domain/main-price-calculator.ts";
import { MainDiscountPolicy } from "../modules/pricing/domain/discount/main-discount-policy.ts";
import { DiscountRules } from "../modules/pricing/domain/discount/rules.ts";
import { OrderPricing } from "../modules/order/domain/order-pricing.ts";
import { OrderWriter } from "../modules/order/data/order-writer.ts";
import { CreateOrderCommand } from "../modules/order/commands/create-order-command.ts";
import { MainProductsWithStockReader } from "../modules/product/data/main-products-with-stock-reader.ts";

export const createDependencies = async ({ db }: { db: Knex }) => {
  const getProductsQuery = new GetProductsQuery(db);
  const createProductCommand = new CreateProductCommand(db);
  const addStockWriter = new AddStockWriter(db);
  const restockProductCommand = new RestockProductCommand(addStockWriter);
  const subtrackStockWriter = new SubtrackStockWriter(db);
  const sellProductCommand = new SellProductCommand(db, subtrackStockWriter);
  const mainCustomerReader = new MainCustomerReader(db);
  const mainProductsWithStockReader = new MainProductsWithStockReader(db);
  const orderWriter = new OrderWriter(db);
  const mainPriceCalculator = new MainPriceCalculator();
  const mainDiscountPolicy = new MainDiscountPolicy(DiscountRules);
  const orderPricing = new OrderPricing(mainPriceCalculator, mainDiscountPolicy);
  const createOrderCommand = new CreateOrderCommand(
    db,
    orderPricing,
    mainCustomerReader,
    mainProductsWithStockReader,
    subtrackStockWriter,
    orderWriter
  );

  return {
    getProductsQuery,
    createProductCommand,
    restockProductCommand,
    sellProductCommand,
    createOrderCommand,
  };
};

export type AppDependencies = Awaited<ReturnType<typeof createDependencies>>;
