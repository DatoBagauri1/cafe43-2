# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Project: CAFE 43

A fully responsive, dynamic pastry shop website for "CAFE 43" — a real shop at 189 David Agmashenebeli Ave, Tbilisi (rating 4.6, 77 base reviews + dynamic, opens daily 10:00–22:00). Currency: Georgian Lari (₾). Languages: English + Georgian (KA).

### Artifacts
- `artifacts/cafe43` (web) — React + Vite frontend, mounted at `/`
- `artifacts/api-server` (api) — Express 5 API, mounted at `/api`. Also serves stock images at `/api/assets/*` from `attached_assets/stock_images/`.

### Backend
- OpenAPI spec at `lib/api-spec/openapi.yaml`. Run `pnpm --filter @workspace/api-spec run codegen` after changes.
- Drizzle schemas in `lib/db/src/schema/{menuItems,reviews,gallery,orders}.ts`.
- API routes in `artifacts/api-server/src/routes/{menu,reviews,gallery,orders,shop}.ts`. Tbilisi-time open/closed logic and blended rating live in `routes/shop.ts`.
- Orders snapshot menu items into a `jsonb` column at order time so price changes don't mutate history.
- Seed via `pnpm --filter @workspace/api-server run seed`.

### Frontend
- Wouter routing, React Query via Orval-generated hooks in `@workspace/api-client-react`.
- Cart state: `src/lib/cart.tsx` (Context, persisted to localStorage `cafe43.cart`).
- i18n EN/KA: `src/lib/i18n.tsx` (Context, persisted to localStorage `cafe43.lang`). MenuItem rows have `name`/`nameKa` and `description`/`descriptionKa`.
- Dark mode via `next-themes` with class strategy. Warm patisserie palette in `src/index.css`.
- Admin gate: localStorage passcode "cafe43admin".
- Typography: Playfair Display (serif) + Plus Jakarta Sans (sans).
