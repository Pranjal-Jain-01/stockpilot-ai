# StockPilot AI — Phase 1

A beginner-friendly React frontend for the foundation milestone (days 1–3) in `docs/STOCKPILOT_MVP_SPEC.md`. The five routes contain useful sample views so the shared layout, components, and states can be reviewed immediately.

## Run locally

Install Node.js **24 or newer**, then open a terminal in `stockpilot-ai`:

```sh
cd frontend
npm ci
npm run dev
```

Open the local URL printed by Vite, usually `http://127.0.0.1:5173`. The current workspace already has dependencies installed. `npm ci` makes a fresh installation from the committed lockfile.

## What you can review

| Route | Sample experience |
| --- | --- |
| `/` | Dataset-based KPI counts, inventory health, risk breakdown, priority watchlist |
| `/inventory` | Combined product/SKU search, location and status filters, expandable details |
| `/risks` | Type and priority filters, expandable evidence, links from the dashboard |
| `/recommendations` | Read-only transfer/purchase comparisons, rationale, unavailable and infeasible options |
| `/history` | Prefilled simulated decisions, reviewer, rationale, timestamps in IST |

The header's **Preview state** selector exercises Ready, Loading, Empty, and Error on every data page. Loading remains visible until you select another state. Error's **Try again** restores Ready. Empty's **Restore sample data** restores Ready. You can also open `/inventory?state=error`, for example.

On narrow screens, open the menu to use navigation. Focus moves into the menu; Escape closes it and returns focus to the menu button. Tables scroll within their own panels. A skip link and visible keyboard focus are included.

## Checks

From `frontend`:

```sh
npm run check         # TypeScript, ESLint, and interaction tests
npm run format:check  # Readable, consistent formatting
npm run build         # TypeScript and a production build in dist/
npm run preview       # Preview that production build
```

Use `npm run test:watch` while editing and `npm run format` to format changes.

## Where to start editing

1. Read `frontend/src/app/router.tsx` to see the five routes.
2. Read `frontend/src/components/layout/` for the sidebar, header, and page shell.
3. Open a page in `frontend/src/pages/`; shared UI lives in `frontend/src/components/`.
4. Change sample content in `frontend/src/mocks/data.ts` and its **frontend-only view models** in `frontend/src/types/index.ts`.
5. `frontend/src/hooks/useMockDataset.tsx` handles asynchronous loading and preview states. `mocks/loadDataset.ts` loads local fixtures, with cancellation for unmounts and state changes.
6. `frontend/src/index.css` sets the Tailwind theme and reusable styles. Tailwind uses its Vite plugin, as described in the [official installation guide](https://tailwindcss.com/docs/installation/using-vite).

There is no backend folder, network API client, authentication, AI call, business-rule engine, or browser persistence. The app sends no inventory or decision requests. Numeric demand, coverage, costs, risk labels, and option rankings are authored fixture values. Frontend calculations are limited to display counts and chart proportions.

## Scope and integration decisions

Recommendations are read-only; approving/rejecting and persistent history belong to later milestones. Sample history records are fixed fixtures. Transfer cost excludes the already-owned goods' acquisition cost, while purchase cost includes new goods. The UI discloses these scopes rather than claiming equivalent landed costs.

API routes and interfaces in the spec remain **proposals**. View models here are not API contracts. Agree on DTOs, filters, pagination, units, currencies, null behavior, and error formats with the backend owner before adding a service adapter. Keep risk classification, demand calculations, feasibility, and ranking on the backend.

TanStack Query, MSW, and Recharts are deferred until their functionality is needed. This foundation uses React context for one local dataset and CSS bars for display summaries. No unused API configuration or secrets are included.

See `docs/IMPLEMENTATION_NOTES.md` for changed files, validation, and integration blockers. The supplied specification is preserved without changes.
