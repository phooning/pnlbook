# PnLBook

PnLBook is a minimalist persistent PnL calendar with basic watchlists. The app is built on Bun, Vite, TanStack Start/Router, TanStack Query, TanStack DB, Tailwind CSS, shadcn/ui, and Drizzle.

## Getting Started

```bash
bun i
bun dev
```

The dev server runs on port `3000` by default.

## Scripts

```bash
bun run build
bun run test
bun lint
bun format
bun check
```

## Database

Drizzle reads `DATABASE_URL` from `.env.local` or `.env`.

```bash
bun run db:generate
bun run db:migrate
bun run db:push
bun run db:studio
```

The initial schema covers accounts, instruments, positions, daily PnL entries, watchlists, and watchlist symbols.

## App Structure

- `src/routes` contains TanStack Router file routes.
- `src/data/bootstrap.ts` contains typed seed data used by the current homepage.
- `src/db/schema.ts` contains the Drizzle schema for persistent records.
- `src/db-collections` contains local TanStack DB collection definitions that mirror the app's near-term client state.
- `src/components/ui` contains shadcn/ui primitives.

## Environment

Client variables must use the `VITE_` prefix.

```ts
import { env } from "#/env";

console.log(env.VITE_APP_TITLE);
```

## UI Components

Add shadcn/ui components with the latest CLI:

```bash
pnpm dlx shadcn@latest add button
```
