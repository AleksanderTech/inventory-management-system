# Inventory Management System

REST API for inventory and order management.

## Requirements

- Node.js 24+

## Setup

1) Install dependencies:

```
npm ci
```

2) Create env files:

```
cp .env.example .env.development
```

## Run

- Development:

```
npm run dev
```

- Production-like:

```
npm run start
```

Note: `dev` and `start` run migrations automatically before starting the server.

## Migrations

- Apply latest:

```
npm run migrate-up
```

- Roll back latest:

```
npm run migrate-down
```

- Create a new migration:

```
npm run make-migration -- <name>
```

## Tests

- Unit:

```
npm run test-unit
```

- Integration:

```
npm run test-integration
```

- All:

```
npm run test
```
