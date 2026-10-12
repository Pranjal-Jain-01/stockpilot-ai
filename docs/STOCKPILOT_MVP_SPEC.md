# StockPilot AI — MVP Specification

> **Version:** 1.0  
> **Status:** Proposed / ready for team review  
> **Last updated:** 2026-10-12  
> **Audience:** Frontend engineer, backend engineer, project reviewers  
> **Scope:** Beginner-friendly, portfolio-grade inventory decision-support MVP

## Document purpose

This document is the source of truth for the initial StockPilot AI MVP. It combines the **Business Requirements Document (BRD)**, **Product Requirements Document (PRD)**, and **Frontend Implementation Plan**. Requirements and API shapes are proposals until agreed by both contributors. The application supports **simulated** procurement and transfers; it does not place real orders or move physical stock.

---

# Part I — Business Requirements Document (BRD)

## 1. Executive summary

StockPilot AI is a web-based inventory decision-support application for multi-store retailers. It identifies potential stockouts, slow-moving or excess inventory, and delayed supplier orders. For shortages, it compares feasible inter-store transfers with purchase orders based on stock availability, coverage, arrival time, and relevant costs. It provides evidence-backed explanations and requires human approval before recording a simulated action.

## 2. Problem statement

Inventory managers often lack a consolidated view of store-level stock, replenishment timing, and supplier performance. This can lead to stockouts, overstock, unnecessary purchasing, and poorly explained decisions.

| Problem | Impact | MVP response |
|---|---|---|
| Potential stockouts | Lost sales or service interruptions | Flag at-risk SKUs using demand, stock, and replenishment timing |
| Excess or slow-moving inventory | Capital tied up in stock | Surface low movement and surplus by store |
| Supplier delays | Uncertain replenishment | Flag overdue open purchase orders |
| Transfer vs purchase uncertainty | Higher cost or late arrival | Compare feasible alternatives with evidence |
| Unclear accountability | Decisions hard to audit | Human approval and persistent decision history |

## 3. Objectives

1. Provide a consolidated view of inventory across seeded stores.
2. Surface actionable stockout, excess-stock, slow-moving, and supplier-delay risks.
3. Generate transparent, deterministic replenishment comparisons.
4. Present evidence-backed recommendations in an understandable interface.
5. Require approval or rejection before recording a simulated action.
6. Persist an auditable decision history.

## 4. Stakeholders and users

- **Inventory manager (primary):** monitors stock, investigates alerts, and reviews recommendations.
- **Procurement manager (secondary):** evaluates supplier lead times and purchase costs.
- **Store manager (secondary):** examines store-specific shortages and potential transfers.
- **Development team:** two beginner contributors; frontend and backend ownership with cross-review.

**MVP assumption:** one demo user with full access; authentication and role-based access are deferred.

## 5. Business success criteria

These are **MVP test targets**, not claims of measured business impact.

| Measure | Acceptance target |
|---|---|
| Inventory coverage | All seeded products and stores are visible |
| Risk detection | Defined fixture scenarios yield expected classifications |
| Recommendation transparency | Every recommendation shows inputs, comparison, and rationale |
| Human control | Every action is pending until explicitly approved or rejected |
| Auditability | Approved/rejected actions persist with decision and timestamp |
| Demo completeness | A reviewer can complete the workflow without developer intervention |

## 6. Constraints and assumptions

- Use synthetic/seeded data initially; do not imply real operational integrations.
- Procurement and transfer actions are simulated, not executed.
- Stock movement/demand history must exist to calculate demand and slow movement.
- The rule engine, not an LLM, determines numeric outputs and feasibility.
- AI-generated explanation text is optional for the MVP; a deterministic template is a valid fallback.
- Project timing assumes roughly 2–3 focused hours per person per day and may change as the team learns.

## 7. Out of scope for MVP

Real purchase placement, warehouse integrations, real-time POS synchronization, complex authentication/permissions, trained demand-forecasting models, autonomous multi-agent execution, and enterprise-scale optimization.

---

# Part II — Product Requirements Document (PRD)

## 8. Product vision

**Help inventory managers identify inventory risks, compare feasible replenishment options, and approve evidence-backed simulated decisions from one application.**

## 9. Core user journey

1. Open the dashboard to inspect inventory health.
2. Browse inventory by store, SKU, or status.
3. Open a risk to inspect quantities, demand, coverage, and lead-time evidence.
4. Review a recommendation comparing transfer and purchase options.
5. Approve or reject the proposed simulated action.
6. Inspect decision history and supporting evidence.

## 10. MVP screens and routes

| Screen | Route | Purpose | Essential UI |
|---|---|---|---|
| Dashboard | `/` | Inventory health overview | KPI cards, risk summary, recent recommendations |
| Inventory | `/inventory` | Browse stock | Searchable/filterable table, details view |
| Risk Center | `/risks` | Investigate alerts | Severity/type filters, evidence panel |
| Recommendations | `/recommendations` | Compare actions | Transfer vs purchase, rationale, approval dialog |
| Decision History | `/history` | Review decisions | Decision list, timestamps, status, evidence |

A responsive sidebar/top navigation is shared across screens.

## 11. Functional requirements

**Priority definitions:** P0 = required for MVP; P1 = optional enhancement; Later = excluded from MVP.

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Display inventory summary KPIs | P0 |
| FR-02 | Browse searchable inventory table | P0 |
| FR-03 | Filter inventory by store and risk status | P0 |
| FR-04 | Show risk type and severity | P0 |
| FR-05 | Show product-level evidence behind risk | P0 |
| FR-06 | Compare transfer and purchase options | P0 |
| FR-07 | Display recommendation rationale and evidence | P0 |
| FR-08 | Approve/reject pending simulated recommendations | P0 |
| FR-09 | Persist and display decision history | P0 |
| FR-10 | Handle loading, empty, and error states | P0 |
| FR-11 | CSV import UI | P1 |
| FR-12 | LLM-generated explanation | P1 |
| FR-13 | Historical charts and trends | P1 |
| FR-14 | Authentication and user roles | Later |

## 12. User stories and acceptance criteria

### US-01 — Dashboard overview

**As an** inventory manager, **I want** to see inventory health KPIs **so that** I can prioritize issues.

- KPI values come from the API or clearly labeled mock data.
- Counts correspond to the active dataset/scope.
- Loading, error, and no-data states are visible.

### US-02 — Inventory exploration

**As an** inventory manager, **I want** to search and filter inventory **so that** I can find affected SKUs.

- Search matches SKU and product name.
- Store and risk-status filters can be combined.
- Empty results display a helpful message.
- Quantities and coverage values have units and consistent formatting.

### US-03 — Risk investigation

**As an** inventory manager, **I want** to understand why an item is flagged **so that** I can act appropriately.

- Each alert displays type, severity, product, and store where relevant.
- Stockout evidence shows stock, demand, coverage, and replenishment lead time.
- Supplier-delay evidence shows expected date, order status, and delay duration where available.
- Missing evidence is labeled unavailable, not fabricated.

### US-04 — Recommendation comparison

**As an** inventory manager, **I want** to compare replenishment options **so that** I can make a defensible decision.

- Transfer and purchase alternatives show feasible quantity, estimated arrival, relevant cost, and feasibility.
- Infeasible options explain why they cannot be chosen.
- The recommended option is explicitly identified, or the system indicates no feasible option.
- All displayed numeric values originate from structured backend evidence.

### US-05 — Approval and history

**As an** inventory manager, **I want** to approve or reject a proposed action **so that** decisions remain human-controlled.

- Only `pending` recommendations can be decided.
- A confirmation dialog summarizes the action before submission.
- The UI prevents duplicate submissions and handles server conflicts.
- Successful decisions persist and appear in history after refresh.
- Approval records a **simulated** action; it does not imply stock or purchasing execution.

## 13. Inventory decision rules (backend-owned)

These are starter rules and must be agreed on and covered by unit tests.

- **Usable stock:** `max(on_hand_quantity - reserved_quantity, 0)`.
- **Average daily demand:** observed units consumed over an agreed lookback window divided by observed days; avoid silently treating missing demand as zero.
- **Coverage days:** `usable_stock / average_daily_demand` when demand is positive; otherwise return `null` and explain why.
- **Stockout risk:** compare coverage against replenishment lead time plus a configurable safety buffer.
- **Slow-moving inventory:** classify from units moved over a documented lookback period and threshold.
- **Excess inventory:** compare stock coverage or quantity with a documented upper threshold.
- **Supplier delay:** an open PO is overdue if `expected_delivery_date < current_date` and no completed receipt supersedes it.
- **Transfer feasibility:** donor store has transferable surplus after protecting its own safety stock; quantity and arrival time meet recipient needs.
- **Purchase feasibility:** supplier can provide the required quantity within its documented lead time and constraints.
- **Comparison:** rank feasible options by timing and total relevant costs; disclose trade-offs and return `no_feasible_option` if needed.

**Important:** unit cost, shipping/transfer cost, and total procurement cost are distinct. Do not compare partial cost figures as though they were full landed costs.

## 14. Non-functional requirements

- Responsive desktop and mobile layouts; dense tables may scroll horizontally on narrow screens.
- Semantic controls, labels, keyboard access, visible focus states, and sufficient contrast.
- Clear validation, loading, empty, retry, and API-error states.
- Avoid exposing API keys in frontend code or environment variables shipped to browsers.
- Target an initial dashboard load around 3 seconds for the seeded demo under normal test conditions; measure rather than promise it.
- Prevent stale UI after approvals by invalidating relevant API queries.

## 15. Data entities

| Entity | Key fields |
|---|---|
| `products` | id, sku, name, unit_cost |
| `stores` | id, name, location |
| `inventory` | product_id, store_id, on_hand_quantity, reserved_quantity |
| `inventory_movements` | id, product_id, store_id, quantity, movement_type, occurred_at |
| `suppliers` | id, name, lead_time_days |
| `purchase_orders` | id, product_id, supplier_id, quantity, expected_delivery_date, status |
| `recommendations` | id, product_id, destination_store_id, preferred_option, evidence, status |
| `action_history` | id, recommendation_id, decision, decided_at, actor_label |

The backend may normalize or extend this schema; document changes before frontend integration.

---

# Part III — Frontend Implementation Plan

## 16. Proposed technology stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React + TypeScript + Vite | Fast feedback and typed components |
| Styling | Tailwind CSS | Consistent responsive UI |
| Navigation | React Router | Client-side routes |
| Server state | TanStack Query | Fetching, caching, invalidation, mutations |
| HTTP | Fetch or Axios | Choose one and standardize |
| Charts | Recharts | Simple analytics visualizations |
| Icons | Lucide React | Consistent iconography |
| Tests | Vitest + React Testing Library | Component and interaction tests |
| Mocking | MSW | Develop against agreed API contracts |
| Backend | FastAPI + SQLite | Backend teammate owns API and persistence |

**Visual direction:** clean enterprise SaaS UI with neutral surfaces, restrained blue accents, readable tables, and clear severity labels. This is a proposed default pending team approval.

## 17. Frontend architecture

```text
React pages / components
        |
TanStack Query hooks
        |
Typed API service layer
        |
FastAPI REST endpoints
        |
SQLite + deterministic inventory/recommendation engine
```

Keep business calculations on the backend. The frontend formats, filters, explains, and submits user decisions; it must not independently recalculate authoritative recommendations.

## 18. Proposed folder structure

```text
stockpilot-ai/
├── docs/
│   └── STOCKPILOT_MVP_SPEC.md
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.tsx
│   │   │   └── router.tsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── ui/
│   │   │   ├── inventory/
│   │   │   ├── risks/
│   │   │   └── recommendations/
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── InventoryPage.tsx
│   │   │   ├── RisksPage.tsx
│   │   │   ├── RecommendationsPage.tsx
│   │   │   └── HistoryPage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── mocks/
│   │   ├── utils/
│   │   ├── index.css
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
└── backend/
```

## 19. API contract — proposed, to finalize with backend

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/dashboard/summary` | KPIs and risk counts |
| GET | `/api/inventory` | Inventory listing and filters |
| GET | `/api/risks` | Risk alerts |
| POST | `/api/recommendations/generate` | Generate/refresh recommendation |
| GET | `/api/recommendations` | List recommendations |
| GET | `/api/recommendations/{id}` | Recommendation details |
| POST | `/api/recommendations/{id}/decision` | Approve/reject |
| GET | `/api/history` | Decision audit trail |
| POST | `/api/import/csv` | Optional P1 import |

Agree on pagination, filtering parameters, date formats (ISO 8601), currencies, units, null behavior, and error envelopes before integration.

### Example TypeScript interfaces

```ts
type RiskStatus = "healthy" | "low" | "critical" | "excess" | "unknown";
type RecommendationStatus = "pending" | "approved" | "rejected";

interface InventoryItem {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  storeId: string;
  storeName: string;
  onHandQuantity: number;
  reservedQuantity: number;
  averageDailyDemand: number | null;
  coverageDays: number | null;
  riskStatus: RiskStatus;
}

interface ReplenishmentOption {
  id: string;
  type: "transfer" | "purchase";
  feasible: boolean;
  quantity: number;
  sourceStoreId?: string; // required for a transfer
  supplierId?: string;    // required for a purchase
  estimatedTotalCost: number | null;
  currency: string;
  leadTimeDays: number | null;
  infeasibilityReason?: string;
}

interface Recommendation {
  id: string;
  productId: string;
  destinationStoreId: string;
  preferredOptionId: string | null;
  options: ReplenishmentOption[];
  explanation: string;
  evidence: Record<string, string | number | boolean | null>;
  status: RecommendationStatus;
}

interface DecisionRequest {
  decision: "approved" | "rejected";
  selectedOptionId?: string; // required when approving
  reason?: string;
}
```

The backend must validate approval state and selected-option feasibility regardless of what the UI sends.

### API error contract (proposal)

```json
{
  "error": {
    "code": "RECOMMENDATION_ALREADY_DECIDED",
    "message": "This recommendation has already been reviewed."
  }
}
```

Use meaningful HTTP status codes (`400`, `404`, `409`, `422`, `500`) and surface friendly messages in the UI.

## 20. Component inventory

| Component | Responsibility |
|---|---|
| `AppShell`, `Sidebar`, `Header` | Shared layout/navigation |
| `StatCard` | KPI summary |
| `InventoryTable`, `InventoryFilters` | Browse inventory |
| `RiskBadge`, `RiskList`, `RiskEvidencePanel` | Investigate risks |
| `RecommendationCard`, `OptionComparison` | Compare alternatives |
| `EvidenceList` | Explain supporting data |
| `DecisionDialog` | Confirm approve/reject |
| `DecisionHistoryTable` | Audit decisions |
| `LoadingState`, `EmptyState`, `ErrorState` | Resilience and feedback |

## 21. Frontend implementation schedule (14 focused days)

| Days | Milestone | Deliverable |
|---|---|---|
| 1–3 | Foundation | React setup, routes, layout, UI primitives, mock contracts |
| 4–6 | Dashboard + inventory | KPI cards, table, search, filters, details |
| 7–9 | Risks + recommendations | Alerts, evidence, option comparison, infeasibility states |
| 10–12 | Approvals + integration | Decision dialog, history, real API integration, tests |
| 13–14 | QA + deployment | Responsive polish, error testing, build, deployment, demo |

### Daily work approach

1. Read the relevant requirement and acceptance criteria.
2. Build the UI using mock API responses.
3. Add component/interaction tests.
4. Integrate with backend when endpoint is ready.
5. Review with teammate and commit a small, coherent change.

## 22. Team ownership and integration checkpoints

| Area | Frontend owner | Backend owner | Shared checkpoint |
|---|---|---|---|
| Inventory | Table, filters, states | Schema, import, listing API | Agree on item DTO and filtering |
| Risks | Risk UI and evidence | Detection rules, risk API | Validate seeded risk scenarios |
| Recommendations | Comparison and rationale UI | Feasibility, costs, ranking | Agree on units, option IDs, nulls |
| Approvals | Confirmation and mutation UX | Validation, persistence, conflict handling | Test duplicate approvals |
| History | Audit table | History API | Refresh and persistence test |

Both contributors should run the full application and review at least one change in the other's area.

## 23. Test plan

### Frontend tests

- Dashboard renders loading, success, empty, and error states.
- Inventory search and combined filters behave correctly.
- Risk details render actual evidence and handle missing values.
- Infeasible options cannot be approved.
- Approval dialog shows selected action and requires confirmation.
- Submit button is disabled while a decision request is pending.
- Server `409 Conflict` is handled without falsely reporting success.
- History updates after a successful decision and survives page refresh.
- Keyboard navigation and mobile layout are usable.

### Backend tests (shared integration acceptance)

- Zero/missing demand does not produce misleading coverage.
- Donor store cannot transfer below protected stock.
- Supplier-delayed and slow-moving fixtures classify correctly.
- Total costs use consistent units and included cost components.
- Approval cannot be repeated or applied to infeasible options.
- Action history persists and contains decision metadata.

## 24. Definition of done

A feature is complete when it:

- Meets its documented acceptance criteria.
- Uses typed, agreed API responses or clearly labeled mocks.
- Handles loading, empty, and failure states.
- Has relevant tests passing.
- Works on desktop and narrow screens where applicable.
- Has been reviewed by the other contributor.

**MVP release is complete when:** a demo user can inspect inventory, investigate a risk, compare replenishment alternatives, approve or reject a simulated recommendation, and find the decision in persistent history without manual database intervention.

## 25. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Frontend blocked by backend | MSW fixtures and contract-first development |
| Scope creep | Finish P0 requirements before P1 features |
| Misleading inventory math | Backend unit tests and evidence display |
| LLM hallucinated figures | Pass structured evidence; deterministic fallback |
| Inconsistent approval state | Server-side validation and query invalidation |
| Deployment/database limitations | Validate SQLite persistence on chosen host; avoid ephemeral storage for demos |

## 26. Open decisions for team review

- [ ] Finalize risk thresholds, safety stock, and demand lookback period.
- [ ] Decide how total transfer and purchase costs are calculated.
- [ ] Confirm whether dashboard charts are P1 or needed for demo.
- [ ] Agree on backend DTOs, query parameters, pagination, and error format.
- [ ] Decide whether CSV import is necessary for first demo.
- [ ] Choose a persistent database strategy for deployment.
- [ ] Confirm whether LLM explanations are included in the initial release.
- [ ] Approve the enterprise SaaS design direction.

---

## 27. Git workflow and document maintenance

Save this document at `docs/STOCKPILOT_MVP_SPEC.md`. Update the version/date and open decisions whenever requirements change. Make changes in feature branches and review them before merging.

```bash
mkdir -p docs
# Place STOCKPILOT_MVP_SPEC.md in docs/
git checkout -b docs/mvp-spec
git add docs/STOCKPILOT_MVP_SPEC.md
git commit -m "docs: add StockPilot AI MVP BRD PRD and frontend plan"
git push -u origin docs/mvp-spec
```

Create a pull request from `docs/mvp-spec` to your default branch and have the other contributor review it.
