# Notes / Assumptions

## 1) Assumptions & Simplifications

- Key assumptions made during implementation:
  - Single warehouse: one inventory row per product (`db/migrations/20260105184116_init.js`).
  - No multi-warehouse or per-location inventory; separate inventory IDs would be
    overengineering for this scope.
  - Prices are stored in minor units (integers) and the system assumes a single currency.
  - Product categories are a fixed in-code set (`src/modules/shared/contracts/product/model/constants.ts`).
  - Orders are create-only; no updates, cancellations, or refunds.
  - Customers already exist; the API does not create or manage customers.
  - Customer location is stored on the customer entity and is required for pricing.
- Intentionally omitted elements + rationale:
  - Customer CRUD endpoints and auth; out of scope for the task.
  - Product update/delete endpoints; not required by the explicit endpoint list.
  - Pagination for `GET /products` (not specified).
- Interpretation of ambiguous requirements:
  - Product category is assigned at creation.
  - Black Friday is defined as the Friday after the 4th Thursday of November, evaluated in
    `Europe/Warsaw` local date (`src/modules/pricing/domain/discount/black-friday.ts`).
  - Holiday discount uses fixed-date Polish bank holidays only; movable holidays (example: Easter, Corpus Christi) are intentionally omitted to keep the logic focused (`src/modules/pricing/model/constants.ts`).
  - Holiday sale triggers if the order contains any eligible category (mugs/coffee) and applies to the entire order total, not just items in eligible categories.
  - Volume discount is based on total units in the order and applied to the entire order total (not per line).
  - Location-based pricing uses `Customer.location` and supports only
    `unitedStates`, `europe`, `asia` (`src/modules/pricing/domain/main-price-calculator.ts`).
  - Pricing order: location multiplier first (per line), then discount.

## 2) Technical Decisions

- Database choice:
  - SQLite via Knex + better-sqlite3 for zero-infra local setup, repeatable runs, and real
    transactions to keep stock updates consistent
    (`knexfile.js`, `db/migrations/20260105184116_init.js`).
  - A MongoDB schema could be just three collections (product with stock, order, customer),
    but I chose relational tables to get full support for relations and transactional consistency without extra infra.
- Project structure:
  - Module-per-domain with shared contracts and utils to avoid cross-module coupling
    (`src/modules/*`, `src/modules/shared/*`).
  - Shared module contains contracts only and no domain logic; dependency graph is
    module -> shared, never the other way around.
  - `src/app/index.ts` + `src/app/dependencies.ts` act as the composition root and the
    only place that imports across modules.
- CQRS approach:
  - Simple command/query classes without a bus
    (`src/modules/product/commands/*`, `src/modules/product/queries/*`,
    `src/modules/order/commands/*`).
- Brief explanation of command / query separation:
  - Queries are read-only; commands persist state changes and run domain checks.
- Abstraction decisions:
  - For simple flows (example: `GetProductsQuery`, `CreateProductCommand`) I avoided extra
    layers where they would not add reuse, testability, or clarity.
  - I introduced extra layers only where logic grew (pricing, discount policy, order
    pricing), or where separation helped testing.
- Dependencies:
  - Kept dependency list minimal to reduce setup friction.
- Data access objects accept a Knex connection/transaction explicitly to make transactions easy.

## 3) Business Logic

- How the discount system works (step by step):
  1. Normalize order items (merge duplicate product IDs) and count total units
     (`src/modules/order/commands/normalize-order-items.ts`).
  2. Price each line using the customer location multiplier; round unit price down with
     `Math.floor` (`src/modules/pricing/domain/main-price-calculator.ts`).
  3. Sum line totals into the order subtotal.
  4. Check discount rules: volume (5/10/50), Black Friday, holiday sale
     (`src/modules/pricing/domain/discount/rules.ts`).
  5. Pick the single highest percent that applies (no stacking)
     (`src/modules/pricing/domain/discount/main-discount-policy.ts`).
  6. Apply that discount to the whole order subtotal; round down the final total with
     `Math.floor` (`src/modules/order/domain/order.ts`).

- How stock consistency is ensured (no negative stock):
  - Stock updates use an atomic SQL update with `stock >= amount`
    (`src/modules/product/data/subtract-stock-writer.ts`).
  - Order creation wraps price calculation, order insert, and stock updates in a single transaction; any failure rolls back
    (`src/modules/order/commands/create-order-command.ts`).

- Key edge cases that were taken into account:
  - Duplicate product IDs in an order are merged before pricing.
  - Order fails if any product is missing or has insufficient stock (transaction rollback).
  - Validation rejects non-positive quantities, invalid IDs, and invalid numeric values.

## 4) Testing

- What is covered by tests (and why):
  - Unit tests: product validation, order validation, discount policy, price calculator,
    order pricing (`test/unit/...`).
  - Integration tests: product endpoints (list/create/restock/sell + error paths) and
    order creation + error cases (`test/integration/...`).
- What is not covered, but would be required in production:
  - Transaction handling/rollback failure scenarios.
  - Concurrency/race cases.
  - Verifying stock is actually reduced after a successful order.
  - Time‑zone boundaries.

### Trade-offs & Alternatives

- One concrete design decision you made that you would change if you had more time:
  - Passing `trx` to data access objects in the order flow
    (`src/modules/order/commands/create-order-command.ts`,
    `src/modules/order/data/order-writer.ts`,
    `src/modules/product/data/subtract-stock-writer.ts`,
    `src/modules/product/commands/sell-product-command.ts`).
- One alternative solution considered but rejected:
  - Transaction wrapper and `Knex` wrapper so that data access objects do not need to accept `trx` as an argument.
- Why the chosen solution was selected over the alternative, including its downsides:
  - Given the task focus, I skipped extra abstraction layers and chose a straightforward, faster implementation; improving the transaction/DB abstraction was lower priority.
