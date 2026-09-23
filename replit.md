# MenuStack — Restaurant POS System

## Overview

Full-stack restaurant ordering & POS system. Production-quality, market-ready application targeting $60k+ quality against Toast, Square, Clover, Talabat, and Elmenus.
pnpm workspace monorepo using TypeScript.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5 + Helmet + express-rate-limit + compression
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec in `lib/api-spec/openapi.yaml`)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React 19 + Vite + TailwindCSS 4 + shadcn/ui + TanStack Query v5 + Wouter

## Artifacts

| Artifact | Port | Path | Purpose |
|---|---|---|---|
| `artifacts/api-server` | 8080 | `/api` | Express REST API |
| `artifacts/menustack` | 25130 | `/` | React POS frontend |
| `artifacts/mockup-sandbox` | 8081 | `/__mockup` | Canvas component previews (10 themes) |

## Application Pages

| Route | Page | Key Features |
|---|---|---|
| `/` | Customer Menu | Sticky category nav, food cards, cart sheet, mobile floating button |
| `/dashboard` | Analytics | Revenue chart, orders by status donut, top items, live stats |
| `/kitchen` | KDS | 3-column urgency queue, URGENT badge, auto-refresh every 8s |
| `/cashier` | Cashier | Unpaid orders, tip presets, payment modal, receipt + print |
| `/tables` | Floor Plan | 12 tables, live status, click-to-order panel |
| `/orders` | Order History | Filters, CSV export, inline order detail |
| `/menu` | Menu Manager | Full CRUD categories + items, availability toggle |

## Design Themes (10 variations)

Live-switchable via the palette button at the bottom of the sidebar:

| ID | Label | Inspiration |
|---|---|---|
| `default` | MenuStack Orange | Original brand |
| `toast-dark` | Toast Dark | Toast POS (dark, amber) |
| `square-clean` | Square Clean | Square POS (blue, minimal) |
| `clover-green` | Clover Green | Clover POS (emerald) |
| `midnight-navy` | Midnight Navy | Premium dark (violet) |
| `rose-gold` | Rose Gold | Luxury fine dining |
| `forest` | Forest Bistro | Café/earthy tones |
| `slate` | Slate Pro | Enterprise SaaS (indigo) |
| `ember` | Ember Fine | Fine dining (burgundy) |
| `arctic` | Arctic Fresh | Fast-casual (teal) |

CSS variables: `artifacts/menustack/src/themes/index.css`
ThemeSwitcher component: `artifacts/menustack/src/components/theme-switcher.tsx`
Persisted in `localStorage` key `menustack-theme`; dark themes also toggle `.dark` class on `<html>`.

## Security

- Helmet.js (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- express-rate-limit (500 req/15min global, 30 req/min on /api/orders)
- CORS with configurable `ALLOWED_ORIGINS` env var
- gzip compression
- Zod validation on all request bodies + query params
- Stack traces never sent to client in production
- Pino structured logging (no PII)

## Health Check

`GET /api/healthz` → `{ status, uptime, database, timestamp }`
- Pings PostgreSQL via `SELECT 1`
- Returns 503 if DB unreachable
- Used by Docker HEALTHCHECK and k8s readiness probes

## DevOps Files

| File | Purpose |
|---|---|
| `docker-compose.yml` | Full stack: postgres + api + web with health checks |
| `artifacts/api-server/Dockerfile` | Multi-stage Node 22 Alpine build |
| `artifacts/menustack/Dockerfile` | Vite build → Nginx Alpine |
| `artifacts/menustack/nginx.conf` | SPA routing, asset caching, security headers |
| `.env.example` | All env vars documented |
| `README.md` | Full docs, competitor analysis, API reference, market positioning |

## Canvas Design Variations

10 theme variation iframes placed on the Canvas board at:
`/__mockup/preview/themes/{ThemeName}`

Components: `artifacts/mockup-sandbox/src/components/mockups/themes/`

## Important Pricing Rule

Prices stored as PostgreSQL `numeric` → serialized as `Number()` on backend → `.toFixed(2)` on frontend.
**NEVER divide by 100** — prices are already in dollars.

## API Base Path

All routes served at `/api`. The `lib/api-spec/openapi.yaml` is the single source of truth.
Run `pnpm --filter @workspace/api-spec run codegen` after any spec changes.

## Competitor Analysis Reference

Screenshots in `attached_assets/screenshots/`:
- `talabat_com_uae.png` — orange brand, card-based ordering, food photography
- `pos_toasttab_com.png` — dark cinematic, split order panel
- `squareup_com_*.png` — clean white, color-coded category tiles
- `clover_com_*.png` — green brand, segment-based
- `elmenus_com.png` — dark hero, search + city selector
