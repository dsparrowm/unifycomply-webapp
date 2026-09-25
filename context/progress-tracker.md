# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

**Milestone 3 — Transaction Monitoring (nav unlocked)**

M1–M2 complete for unique UI + live KYC/KYB. **`CURRENT_MILESTONE = 3`** so TM sidebar
routes are clickable. **Live:** `GET /transactions` (+ `/:id`). Queues / SAR / rules /
overview remain mock. M4+ (SAR Report, Risk Score nav, PND Watchlist, Case Management)
remain disabled.

## Scope Decisions

| Decision | Value |
| -------- | ----- |
| Router | Next.js **App Router**, `app/` at project root |
| Figma scope | **WebApp page only** (`1:2`) |
| Landing page | **Out of scope** — built in another repo |
| **Active milestone** | **M3** (`lib/constants/milestones.ts`) — TM nav unlocked |
| Data | Hybrid — live auth/settings + tenant apps + KYC/KYB + **TM transactions list/detail**; lookup + TM queues/rules/SAR/overview + AML/bank mock |
| **API ↔ UI** | **UI first** — do not change Figma UI for API shape; map in BFF/`lib/api` or raise a blocker in Open Questions |

## Current Goal (M2 — live KYC/KYB)

List uses verification queue + stats. Detail is **workflow-aware** with lazy tabs and a live
verification run history panel (workflow status, checks, risk decision, and audit events).
Overview summary, high-risk count, recent activity, and API calls now read from the dashboard API
with mock fallback for unavailable responses.
KYC/KYB detail headers now expose guarded customer offboarding for live customer records.
Workflow-backed KYC/KYB detail status badges now prefer the verification workflow status, matching
the officer queue, instead of the customer lifecycle status.
Notification settings now include selected-app webhook delivery history and failed-delivery redelivery
through the app-scoped webhook API.
KYB shareholder rows now preserve editable API fields and expose a live PUT-backed edit modal when
shareholders are present.
KYB submitted document rows now expose metadata editing for type, document number, issue date, and
expiry date through the customer document PUT API.
Document requirements + KYB shareholder create + flag status PATCH are live.
Lookup / decisions / AML / bank remain mock (no API). Next: Pre-KYC/Re-KYC Start refresh.

Inventory: `design/figma/webapp/bank/README.md` + `manifest.json`.

KYC unique UI from `🪪Unifycomply (3).zip` is closed except the frame 115 **In Review** vs 79/86 **High Risk Alert** label conflict. KYB unique UI from the (4).zip cache is closed.

## M3 (unlocked 2026-09-23 — partially live)

TM Overview, all four queues, Account Statement, Rules/template reads, Case Management,
Resolve Case, Escalate Case, Place PND, and SAR rationale submission are now live
through the Core Platform. **Transactions explorer** list + detail remain live via
`GET /v1/transactions` and `GET /v1/transactions/{id}/detail`; `?mock=1` remains
available for Figma populated fixtures. PND Watchlist and SAR Reports remain pending.

Live M3 response shapes were verified against staging on 2026-09-25. Queue data is
currently empty for the staging tenant, but overview, queue envelopes, statements,
rules, and rule templates returned valid authenticated responses.

## M1 Completion Checklist

| Phase | Item | Status |
| ----- | ---- | ------ |
| 1 | Project setup (Next.js, Tailwind, routing) | Done |
| 2 | Design system + tokens | Done |
| 3 | Authentication UI (`886:48671`) | Done |
| 4 | Tenant admin (settings, users, roles, API keys) | Done |
| 5 | Dashboard shell (sidebar, header, sandbox toggle) | Done |
| 5 | Overview dashboard (`886:49385`) | Done |
| 6 | M1 hardening (responsive, loading/error, billing/api-keys placeholders) | Done |

**M1 feature development is complete.**

## M2 remaining backlog (after KYC UI gaps)

1. AML screening UI (full section — list, modals, lookup, detail) — **Done** on mocks
2. Bank analysis unique UI — **Done** on mocks (list aligned to frames 11 / 16)
3. Live KYC/KYB list/detail — **Done** (list = verification queue; lookup + decision APIs still missing)
4. Account purpose + start verification — **Done** (API-derived / no Figma)

## Design cache (2026-09-12 — Bank Analysis full section)

Imported `Bank_Analysis.zip` → `design/figma/webapp/bank/`:

| Metric | Count |
| ------ | ----- |
| Exported PNGs | 47 |
| Unique cached (SHA256) | 47 |
| Exact pixel duplicates dropped | 0 |
| Sequence gaps (not in Figma or zip) | 20–40 |

List 11–19 + detail 41–72 + run 7–12. See `design/figma/webapp/bank/README.md`.

## Design cache (2026-09-12 — AML full section)

Imported `AML.zip` → `design/figma/webapp/aml/`:

| Metric | Count |
| ------ | ----- |
| Exported PNGs | 67 |
| Unique cached (SHA256) | 63 |
| Exact pixel duplicates dropped | 4 (25=21, 23=22, 55=35, 64=48) |
| Sequence gaps (not in Figma or zip) | 28–33 |
| Stray unnamed frame | `frame-2147226157.png` (Create a New Case + browser chrome) |

List 15–27 + Customer AML 34–65 + 21 verifications variants. See `design/figma/webapp/aml/README.md`.

## Design cache (2026-09-12 — KYB full section)

Imported `🪪Unifycomply (4).zip` → `design/figma/webapp/kyb/`:

| Metric | Count |
| ------ | ----- |
| Exported KYB frames (77–137) | 54 |
| Unique cached (SHA256) | 54 |
| Exact pixel duplicates dropped | 0 |
| Sequence gaps not in zip | 90, 94, 98, 101, 104, 107, 110 |
| Stray KYC frame in same zip | 157 → `kyc/157.png` (Bulk Verification BVN) |

**Correction:** frame **84** is the **batch-file** list, not the populated business queue. Populated business list = **89**. See `design/figma/webapp/kyb/README.md`.

## Design cache (2026-09-12 — KYC full section)

Imported `🪪Unifycomply (3).zip` → `design/figma/webapp/kyc/`:

| Metric | Count |
| ------ | ----- |
| Exported KYC frames (79–156) | 78 |
| Unique cached (SHA256) | 74 |
| Exact pixel duplicates dropped | 4 (127=126, 145=144, 151=150, 156=155) |
| Wholly unbuilt screens | 0 |

KYC UI gaps from that export are closed except the frame 115 **In Review** vs 79/86 **High Risk Alert** label conflict. See `design/figma/webapp/kyc/README.md`.

## Design cache (2026-07-23 / 2026-07-24)

WebApp page (`1:2`) re-inventoried via local Framelink MCP:

| Metric | Count |
| ------ | ----- |
| Frames on page | 475 |
| Curated captures (incl. modals/drawers/click states) | 324 |
| Skipped duplicates / non-screens | 158 |
| PNGs exported so far | ~25 (mostly onboarding + partial KYC) |

**Blocked (2026-07-24):** Figma Images API returns **429** with `Retry-After ≈ 3.8 days`. Message: seat is Viewer/Collaborator on a **Starter** plan with limited API access. `get_figma_data` still works; PNG export does not until plan/seat upgrade or quota resets.

Resume order when unblocked (M2 → up): **KYC → KYB → AML → Bank → Overview/Settings → TM**.

Plan + raw inventory: `design/figma/webapp/_capture-plan.json`, `_inventory-raw.json`.  
Policy: `context/feature-specs/00-design-inventory.md`, `design/figma/webapp/README.md`.

- **M3 transaction enrichment (2026-09-23):** Core Platform exposes ingest + list/get only (`CreateTransactionDto`). Figma TM Category metrics, status/category filters, AI risk findings, rules triggered, and related transactions have no read schema — UI keeps those surfaces with defaults / empty related until backend adds TM alert/case APIs.
- **Customer onboarding wizard Figma frames:** MVP flowchart references module 1.1 (`1532:157029`) but no WebApp frame exports in `design/manifest.json`. Wizard implemented from `mvp-roadmap.md` step list; re-align when frames are exported.
- **Compliance queue:** Not a separate Figma route — reviewer workflow uses KYC/KYB list status filters (`Pending`, `In Review`, etc.) per frames 79–86. Do not add `/compliance-queue`.
- **Bank analysis fourth metric label:** Frame 11 uses **high risk alerts**; populated frame 16 / batch 18 use **high risk Entity**. List empty (`?empty=1`) uses **high risk alerts**; populated list and batch result use **high risk Entity**.
- **Bank analysis list vs zip (2026-09-12):** List now matches `016.png` (Run ID / Full Name / Type / Accounts / Analyst / Assigned To, Date / Status / Assignee / Type filters, **Run a Check**). Empty `011.png` headers (Transactions / no Type) not used. Pagination is real page count (not Figma dummy 10). Detail remains Favour Peter Soma (`ba-run-1`); list rows are the frame 16 names.
- **Bank analysis Single Lookup fields:** run-07 shows Country / Select app / Entity type / Select ID. Shipped single form still uses Select bank + Account Number. Bulk Analysis (run-12) is wired.
- **Packages / Request:** Sidebar items under BACKGROUND CHECK have **no dedicated WebApp section frames** (only nav labels). Keep placeholder routes until design adds screens.
- **KYB Validate Document:** Implemented as API-derived `/kyb/onboarding` (no Figma section frames).
- **KYC Choose action frame:** Overlay lives on frame **114** (`886:80735`), not 115 (`886:81117` is empty sandbox list). Spec notes should prefer 114 as modal reference.
- **KYC empty-list third metric (115 vs 79/86):** Frame 115 uses **In Review**; frames 79 (empty) and 86 (populated) use **High Risk Alert**. UI keeps **High Risk Alert**. Confirm with design if 115 is a newer label.
- **MFA challenge payload (resolved 2026-07-26):** Live upstream returns HTTP 401 / `status:false` with `message: "Multifactor Authentication required."` and `data: { userId }` only (no `requiresMfa` flag). BFF now detects via message + `userId` and returns `{ requiresMfa: true, userId }` so sign-in routes to `/mfa`.
- **Audit logs API:** No OpenAPI route — Settings → Audit Logs remains mock.
- **M2 Core Platform APIs now live (2026-09-11 audit):** OpenAPI at `https://unifycomply-api.rokxier.com/v1/docs-json` includes **KYC** (`/v1/customers/kyc/*`), **KYB** (`/v1/customers/kyb/*` + shareholders), **verifications** (`/v1/verifications/*`), **tenant apps** (`/v1/tenants/apps/*`), and **tenant onboarding** (`POST /v1/tenants/onboarding`). List/detail reads and onboarding create are wired; lookup/decisions remain mock. Still **no** OpenAPI for AML, bank analysis, overview, or audit logs.
- **KYC/KYB list source (2026-09-15):** Officer lists use **`GET /verifications/kyc|kyb`** (workflow queue: `displayId`, `documentType`, priority, `timeInQueueMs`, status). Metric cards use **`GET /customers/kyc|kyb/stats`**. Row `id` prefers **customerId**, falls back to workflow id when enrichment is null. **Backend note (2026-09-15):** `customerId` / `customerName` / `country` were added when list switched from customers → verifications; **legacy workflow rows return null** for those fields. **New verifications** should include enrichment. UI keeps fallback labels (`Customer {displayId}`) for old rows; detail links need a real `customerId` — legacy rows may still fail detail until backfill or a new run. Optional ask: one-time backfill + `verification-list-endpoints.md`.
- **KYC/KYB detail panels (2026-09-15):** Detail opens with optional `workflowId` from the queue. **Both KYC and KYB tabs are lazy per guide.** KYC: `documents`, `risk-score`, `aml-screening`, `device-information`, `liveness`. KYB: `business-overview`, `risk-score`, `directors-officers`, `shareholders`, `document`, `compliance-checks`. Device/liveness may return empty (`available: false` / skipped) by design. Approve/Reject/Escalate stay UI-only.
- **Visual QA detail tabs (2026-09-15):** KYC live (Palmer Luckey): all five tab GETs wired; signed MinIO previews blank/1×1; device/liveness often empty per guide. **KYB live:** workflow-only shell + all six tab GETs wired.
- **Pre-KYC / Re-KYC (planned 2026-09-14):** Not separate products or sidebar items. Tenant officers use `/kyc` and `/kyb` for both cycles. Plan: `context/feature-specs/16-prekyc-rekyc-tenant-flow.md`. Pre-KYC = first file (wizard → purpose → verify → Figma review). Re-KYC = same customer, **Start refresh** + **Due for refresh** filter. Packages/Request stay BACKGROUND CHECK placeholders. Platform admin out of scope.
- **M2 API ↔ UI flows (2026-09-11):** Full comparison in `context/feature-specs/09-m2-api-ui-flow-gap.md`. API path = create customer → documents → account purpose → (KYB shareholders) → available-checks → start verification. UI path = list/detail + Perform Lookup + KYC wizard; **no** lookup/decision APIs. **Build (no/weak Figma):** account purpose, KYB intake, verification starter, shareholder create, **settings app picker (done 2026-09-14)**, **verification queue list (done 2026-09-15)**. **Backend blockers (keep UI):** lookup/bulk, approve/reject/escalate/resubmit (flags PATCH is warning→investigating→revised only), remaining detail tabs (AML/liveness/device/directors/compliance), AML/bank/packages. **Product open:** KYC wizard business step vs KYC DTO; lookup App dropdown still sandbox/production mock. **Done 2026-09-15:** verification queue list; documents + risk-score detail tabs.
- **Settings app picker (2026-09-14):** Product authorized an App control on Settings (no Figma). API keys / approvals / PEP / notifications / compliance rules now use `/v1/tenants/apps/{appId}/…` (tenant-level copies are deprecated). Tenant-wide screens (profile, business, teams, roles, security, audit logs) unchanged. Lookup **Select app** is still mock.
- **KYC create DTO vs wizard (2026-09-11):** Live submit needs `gender` + full `AddressDto`. Personal step extended with gender + address fields (same form pattern) so create can succeed without dropping Figma steps. **Business info step is still collected in UI but not sent** on `POST /customers/kyc` (DTO has no business fields) — product must decide dual-create KYB vs relocate step.
- **Create response id shape:** OpenAPI omits read models; `extractCustomerId` accepts `id` or `customerId`. Confirm against live 201 body when Cloudflare/WAF allows.
- **RBAC vs API permissions:** UI still gates on `TenantRole` slugs; API returns fine-grained permissions (`verification:approve`, …). Migrate nav/action gating later.
- **Google OAuth upstream redirect_uri:** Core Platform Google app currently points at its own callback host (e.g. API localhost). Frontend wires `redirectUrl` → `/auth/google/callback?intent=…`; end-to-end requires upstream Google config to match the deployed API.
- **AML Batch Screening nav (2026-09-12):** Empty list frame **15** shows a **Batch Screening** sibling under FRAUD MONITORING. Frame **24** is Batch Lookup under the AML Screening breadcrumb, not a separate section. Do not add a sidebar item until design confirms a dedicated route.

## M2 Figma coverage audit (2026-07-23)

Source: WebApp page metadata dump (file `gJgHsHV3Jt9wYKJfstVdWB`, sections KYC / KYB / AML / BANK). Figma MCP unavailable in this workspace; inventory refreshed from prior `get_metadata` export.

| Area | Figma top-level frames | App coverage | Gaps (screens + supporting UI) |
| ---- | ---------------------- | ------------ | ------------------------------ |
| **KYC** | 79–156 (~78 screens) | Strong — list, filters, lookup, detail, decision modals | Minor state variants; choose-action ref = frame 114; no wizard frames |
| **KYB** | 77–137 (54 unique cached) | Strong — list, batch queue, Batch Lookup, lookup, detail tabs, document viewer, Confirm Approval | Validate Document still API-derived / no Figma |
| **AML** | 15–27 + 34–65 + verifications (63 unique / 67 exported) | Standalone section UI complete on mocks | Bank Analysis batch/escalate + live KYC/KYB remaining |
| **Bank Analysis** | 11–19, 41–72, run 7–12 (47 unique) | Unique UI complete on mocks | Live API later |
| **Packages / Request** | No section frames | Placeholder routes | No Figma screens to implement |
| **Onboarding wizard** | None in WebApp | Implemented from roadmap | Needs Figma alignment when frames exist |

**Supporting overlays confirmed in Figma (modals — no separate drawer section for M2):**

| Overlay | Representative frames | Status |
| ------- | --------------------- | ------ |
| KYC Choose action (Perform Lookup / Validate Document) | `886:80735` (114) | Done |
| KYC Confirm Approval | `886:76907`, `886:93088`, `886:99201` | Done (`KycApproveModal`) |
| KYC Request Document Re-submission | `886:87691`, `886:88150` | Done |
| KYC/KYB Reject / Escalate | Detail decision frames (footer + modals) | Done |
| Bank Choose action (Single / Batch Lookup) | `886:164497` (19) | Single → `/bank-analysis/lookup`; Batch → `/bank-analysis/lookup?mode=batch` |
| AML Choose action (Single / Batch Lookup) | `886:138601`, `886:139364` | Not started |
| AML / Bank Escalate to Senior Officer | AML verifications; Bank `71`–`72` | AML done; Bank still open |
| Priority SLA reference panel | `886:81487` (276×612) | Not started (optional helper) |

## Milestone Status

| Milestone | Status |
| --------- | ------ |
| **M1 — Foundation** | **Complete** |
| **M2 — KYC Orchestration** | **In progress (active)** |
| **M3 — Transaction Monitoring** | **Complete (parked)** |
| M4 — SAR & Case Management | Blocked |
| M5 — Optimisation | Blocked |

## Completed (M1)

- Next.js App Router scaffold
- Design tokens from KYC frame (used for shell styling)
- App shell — sidebar, header, sandbox/production toggle
- Milestone gating — `CURRENT_MILESTONE = 2`; M3+ nav disabled in sidebar and route guard
- Overview dashboard (`/overview`) — Figma `886:49386`
- Settings placeholders (`/settings`, `/settings/[section]`)
- Default route `/` → `/overview`

- Auth UI — sign-in, register, forgot/reset password, MFA, verify-email, tenant selection
- Register page aligned to Figma `Sign up // 3` (`886:48929`) — card layout, teal logo, auth tokens
- Sign-in page aligned to Figma `Sign In // 3` (`886:48672`) — split layout, brand panel spacing, form tokens
- Mock auth store with route guards
- Default route `/` redirects based on auth step
- App header — user avatar dropdown (profile, organization, Settings, Logout)
- App header — global search modal (⌘K / header trigger); empty state "Start Searching"
- Sidebar — collapsible section groups; nav icons from Figma `886:70409`

## Deferred to M2+

- Transaction monitoring (M3)

## Next Up (M2)

1. Pre-KYC / Re-KYC missing screens per `16-prekyc-rekyc-tenant-flow.md` (document requirements first)
2. Shareholder create (P2, API-derived / no Figma) — also a Pre-KYC KYB gap

## Feature Unit Queue (through M2)

| Order | Unit | Figma node | Status |
| ----- | ---- | ---------- | ------ |
| 1 | Project scaffold | — | Done |
| 2 | Design system + tokens | `886:70409` | Done |
| 3 | App shell + milestone gating | `886:70409` | Done |
| 4 | Overview dashboard | `886:49386` | Done |
| 5 | Auth / onboarding UI | `886:48671` | Done |
| 6 | Tenant admin | SETTINGS `886:184304` | Done |
| 7 | RBAC nav gating | — | Done |
| 8 | M1 hardening | — | Done |
| 9 | KYC list page (empty default) | `886:70409` | Done |
| 10 | KYC filter dropdowns | `886:70782`–`886:72648` | Done |
| 11 | KYC detail page (frame 96) | `886:76212` | Done — aligned to reference screenshot |
| 12 | KYC Perform Lookup flow | `886:74699`–`886:75456`, `886:81117` | Done |
| 12a | KYC Assigned To column | `kyc/086.png` | Done |
| 13 | KYB list page (empty + populated business queue) | `886:105538`, `886:109281` | Done — Assigned To + Verification Type |
| 14 | Customer onboarding wizard | MVP flowchart `1532:157029` | Done — `/kyc/onboarding` |
| 15 | KYB Perform Lookup flow | `886:108577`–`886:109104` | Done — `/kyb/lookup` |
| 16 | Bank analysis list | `886:161366`, `886:163331` | Done — `/bank-analysis` vs `016.png` |
| 17 | KYB detail page (frame 93) | `886:110808` | Done — all secondary tabs |
| 18 | M2 placeholder routes | — | Done — `/aml-screening`, `/packages`, `/request` |
| 19 | AML screening list UI | `886:134393`–`886:139364` | Done — empty + populated + filters |
| 19a | AML Create a Case | `886` frames 26 / 44 / 45 | Done — choose action + `/aml-screening/lookup` |
| 19b | AML Search Result | frames 37–43 | Done — `/aml-screening/lookup/result` |
| 19c | AML Batch Lookup result | `886:137836` | Done — `/aml-screening/batch/techventures` |
| 20 | AML screening detail + escalate | `886:140127`+ | Done — case detail + `AmlEscalateModal` |
| 21 | Bank analysis lookup + detail | `886:177612`, `886:164117`, `886:165268`+ | Done — batch + escalate (`?view=high-risk`) |
| 22 | KYB Batch Lookup result | `886:124831` | Done — `/kyb/batch/[id]` |
| 22a | KYB batch-file queue | `886:108206` | Done — Type → Bulk Search |
| 23 | KYB document viewer | `886:122170` | Done — `KybDocumentViewerModal` (131 / 132 / 136) |

## Architecture Decisions

- Backend Phase 1: `API_BASE_URL` server-only; tokens in `uc_access` / `uc_refresh` httpOnly cookies; browser talks only to `/api/*`
- `administrator` role alias maps to UI `admin` for RBAC
- `CURRENT_MILESTONE = 2` in `lib/constants/milestones.ts` — M2 routes enabled through KYC/KYB/AML/bank analysis
- `/kyc` lists live `GET /customers/kyc` (empty → **No User Activity**); fixture `kycListDataPopulated` reserved for Figma QA ids
- `/kyc/onboarding` — five-step customer wizard (personal → business → documents → review → consent); entry via Validate Document modal
- `/kyb` — live `GET /customers/kyb` for the business queue; Type → **Bulk Search** still uses mock batch-file rows (no bulk API)
- `/kyb/batch/[id]` — Batch Lookup result (frame 137); Total Business + queue; Back returns to `/kyb?mode=bulk`
- `/kyb/lookup` — Perform Lookup entry (frames 85–88) with country/app/lookup-type form, single + bulk modes
- `/kyb/lookup/result` — business registry lookup results with tabs, summary panel, footer actions; mock via `lib/data/kyb-lookup.ts`
- `/kyb/[id]` — live `GET /customers/kyb/{id}` + documents + shareholders; directors / compliance / risk chrome stay on score templates; fixture ids (`kyb-record-*`) still serve Figma variants
- KYB list **Add Business** opens choose-action modal — Perform Lookup → `/kyb/lookup`
- `/bank-analysis` — list (frame 16 populated, `?empty=1` for frame 11); **Run a Check**; Date / Status / Assignee / Type filters; Run ID table vs `016.png`
- `/bank-analysis/lookup` — Perform Lookup (run-07 / run-12): Single Lookup (Country, App, Bank, Account Number) and Bulk Analysis (xlsx upload) → `/bank-analysis/batch/{slug}`
- `/bank-analysis/batch/[id]` — Batch Lookup result (frame 18); metrics 20/8/12/3; Run ID table; Eye → `/bank-analysis/ba-run-1`; mock via `lib/data/bank-analysis-batch-results.ts`
- `/bank-analysis/[id]` — Key Summary, Linked Entity, Account Analysis, Network Intelligence, Alerts, Compliance, Decision history, date-range menu, and persistent sidebar; Favour Peter Soma row links to `/bank-analysis/ba-run-1`; `?view=high-risk` shows the escalate footer; Escalate Submission opens `BankAnalysisEscalateModal` (frames 71–72)
- `/kyc/[id]` — live `GET /customers/kyc/{id}` + documents for identity fields; AML / IP / liveness / risk chrome stay on score templates; fixture ids (`kyc-record-*`) still serve Figma variants
- `/kyc/lookup` — Perform Lookup entry (frame 90) with lookup type/country/identifier form, sandbox/production toggle
- `/kyc/lookup/result` — BVN lookup results (frames 91–94) with tabs, summary panel, address tab, footer actions
- KYC list **Add Customer** opens choose-action modal (frame 115) — Perform Lookup → `/kyc/lookup`
- `/aml-screening` — list (`AmlListPanel`) + Create a Case → Choose action → `/aml-screening/lookup` (single → `/lookup/result`, batch → `/batch/{slug}`); person/corporate Eye → `/aml-screening/[id]`; `/packages`, `/request` remain `RoutePlaceholderPanel`; milestone + RBAC gating enforced in `canAccessPath`
- `canAccessPath` combines RBAC permissions with `isPathEnabledForCurrentMilestone` for deep-link protection

## Session Notes

- 2026-09-13: Fixed Vercel `pnpm run build` — unused vars, missing Codex API type aliases, KYB onboarding page back on the wizard, list/detail mapper fields for live customers
- 2026-07-26: MFA enable modal shows authenticator QR from `keyUri` (vendored Nayuki qrcodegen) plus copyable secret
- 2026-07-26: Added global toast system (`ToastViewport` + `runAction`) for settings mutations, password change, MFA enable/disable, domain switch, and API key rotate
- 2026-07-26: Auth polish — Google OAuth BFF (`/api/auth/google` + intent exchange), MFA challenge detection hardened, MFA paste + copy polish, auth redirect guard hydration skeletons
- 2026-07-26: Wired email verify (request + token complete) and Security MFA enable/disable TOTP modals (`keyUri`/`secret` setup → enable; token required to disable)
- 2026-07-25: Fixed nav white-flash — visible `--bg-skeleton`, auth hydrate wait, RBAC/auth guards no longer return `null`, settings nested `loading.tsx` keeps chrome during soft nav; React Query cache explains instant revisits
- 2026-07-25: Wired reset password completion — `/reset-password?token=&email=` → BFF `POST /api/auth/forgot-password/complete` → upstream `/v1/auth/forgot-password/{token}` with `{ email, password }`
- 2026-07-25: Backend integration Phase 1 — BFF (`app/api/auth/*`, `app/api/v1/[...path]`) with httpOnly JWT cookies; live sign-in/register/forgot-password/MFA/access-switch; TanStack Query settings hooks; domain switch wired; KYC/AML/etc. remain mock; audit logs remain mock
- 2026-07-20: Auth split layout — mobile logo top-left (sidebar size), top-aligned column; not removed (brand required)
- 2026-07-02: Realigned to M1-only — disabled M2+ nav, overview as home, KYC deferred
- 2026-07-03: Sidebar nav icons exported from Figma (`886:70409`) to `public/assets/sidebar/` and wired in `AppSidebar`
- 2026-07-03: Search modal overlay (`AppSearchModal`) — blurred backdrop, Cancel dismiss, empty state per reference screenshot
- 2026-07-06: Overview dashboard populated mock data — verification stats, endpoints, activity tones, API stacked bar chart
- 2026-07-06: Settings page — internal nav, Profile Management form with mock data per Figma SETTINGS frame
- 2026-07-07: Settings — Business Information form (`886:194583`) with Company Details and Business Address sections, mock data
- 2026-07-07: Settings — Team Management list (`886:195373`) with member cards, status badges, Invite Team Member CTA
- 2026-07-07: Settings — Roles and Permission grid (`886:195675`) with role cards, permission checkboxes, Create Role CTA
- 2026-07-07: Settings — Security (`886:196004`) with password management, 2FA toggle, active sessions, change password modal
- 2026-07-07: Settings — Audit Logs table (`886:196267`) with module filter, export, pagination, 10 mock entries
- 2026-07-07: Settings — Approvals (`886:197274`, `886:197855`) with Risk Factors tab and Approval Thresholds tab (sliders, condition box, visual risk scale), Save Changes
- 2026-07-07: Settings — PEP Settings (`886:199913`) with PEP Tier Configuration cards (4 tiers), edit modal, Save Changes. Figma fourth tier card duplicates tier 2 title; implemented as Close Associates and Family Members for tier 1 (+1 points)
- 2026-07-07: Settings — Notification (`886:198128`) with Notification Preferences header, Webhook Notifications toggle, Webhook URL field, Test button, Save Changes. Figma subtitle references email/in-app but frame only shows webhook section
- 2026-07-07: Settings — Compliance Rules (`886:198352`) with Verification Expiry Rules (KYC/KYB month selects), Required Documents (KYC/KYB lists with remove modal), Flagged countries list, Save Changes. Add document/country buttons rendered per Figma; add flow not defined in M1 (disabled). Verification expiry field labels inferred from two-column layout (not explicit in Figma metadata)
- 2026-07-07: RBAC-aware navigation — `types/rbac.ts`, `lib/rbac/permissions.ts`, `useRbac` hook, sidebar/settings nav filtering, `RbacRouteGuard` route protection, expanded mock tenants (Compliance Officer, Compliance Manager, Admin, Developer) on tenant selection
- 2026-07-11: M1 hardening — shared `EmptyState`/`PageErrorState`/`PageLoadingSkeleton`, `not-found` + route `error.tsx`/`loading.tsx`, mobile sidebar drawer, responsive header/settings shell, audit log module filter empty state, `/billing` placeholder, `/settings/api-keys` placeholder (Admin/Developer RBAC)
- 2026-07-11: Advanced to M2 — `CURRENT_MILESTONE = 2`; KYC list page (`886:70409`) with metrics, filters, search, table, pagination
- 2026-07-11: KYC aligned to Figma empty default (frame 79) — metrics `0`, "No User Activity"; `03-kyc-compliance.md` catalogs frames 79–156; `kycListDataPopulated` holds frame 86 fixture
- 2026-07-11: KYC filter dropdowns (frames 80–85) — Date/Status/Priorities/Single entity search modes/Bulk search/More filters
- 2026-07-11: KYC Perform Lookup bulk mode (frame 109) — Country, Batch Name, Select app, Select ID, Bulk Upload (xlsx drag-and-drop); Staging/Production app options; Figma copy for upload hint
- 2026-07-11: KYC Perform Lookup result page (frame 91) — BVN card + summary panel, underline tabs, risk score badge, Request Resubmission / Cancel / Approve actions
- 2026-07-12: Customer onboarding wizard (`/kyc/onboarding`) — five-step flow with document upload, review, consent; wired from KYC Validate Document action
- 2026-07-12: KYB list page (`/kyb`, frames `886:106307` / `886:108206`) — metrics, filters, search, table, pagination, Add Business choose-action modal; mock via `lib/data/kyb.ts`
- 2026-07-12: KYB Perform Lookup flow (`/kyb/lookup`, frames `886:108577`–`886:109104`) — single + bulk entry, CAC/TIN/RC lookup types, result page with registry card + summary panel
- 2026-07-12: KYC AML Screening tab (frame 143 / `886:96317`) — summary cards (Medium, risk 2/4), PEP match detail panel, sanctions/adverse media/watchlist dark sections aligned to Figma reference screenshot
- 2026-07-12: KYC Request Document Re-submission modal — checkbox issue list, wired to detail and lookup footer actions
- 2026-07-12: KYC AML PEP match detail panel — flagged screening view with bio analysis, sources, timeline, risk factors
- 2026-07-12: Bank analysis list (`/bank-analysis`, frames `886:161366` / `886:163331`) — metrics, filters, search, table, pagination, New Lookup choose-action modal; mock via `lib/data/bank-analysis.ts`
- 2026-07-12: KYB detail page (`/kyb/[id]`, frame `886:110808`) — Business Overview tab, risk/verification/business-size sidebar, approve/reject/resubmission/escalate modals; mock via `lib/data/kyb-detail.ts`; canonical fixture `kyb-record-5` (TechVentures Nigeria Limited)
- 2026-07-12: KYB detail Risk Score Analysis tab — reuses `KycRiskAnalysisPanel` with shared `lib/compliance/risk-analysis.ts` builder for all risk levels 0–4
- 2026-07-12: KYB detail Directors & Officers tab — score 0/1/3/4 layouts with director cards and AML screening rows; mock via `lib/data/kyb-directors.ts`
- 2026-07-12: KYB detail Shareholders tab — Share Capital Structure table with type badges and percentage bars; mock via `lib/data/kyb-shareholders.ts`
- 2026-07-12: KYB detail Document tab — Submitted Documents cards with verified status and view/download actions; mock via `lib/data/kyb-documents.ts`
- 2026-07-12: Compliance review fixes — `AGENTS.md` M2 scope, placeholder routes, milestone gating in `canAccessPath`, reconciled feature specs, refreshed architecture/go-live docs
- 2026-07-23: M2 Figma coverage audit — KYC/KYB core screens covered; **AML section (~67 frames) missing**; Bank Analysis lookup/detail + dead choose-action CTAs; KYB Batch Lookup + Validate Document; Packages/Request have no Figma section frames
- 2026-07-24: Bank Analysis frame 41 (`886:165268`) implemented at `/bank-analysis/ba-run-1` — Bank Summary, six account cards, risk/profile/network sidebar; list link wired; remaining tabs and lookup flows deferred
- 2026-07-24: Bank Analysis frame 42 (`886:165806`) Linked Entity state implemented — two relationship cards, shared account details, tier badges, and interactive date-range menu
- 2026-07-24: Bank Analysis frame 46 (`886:167990`) Account Analysis state implemented — four transaction metrics and responsive monthly income/expense financial report
- 2026-07-24: Bank Analysis Network Intelligence state implemented from supplied reference — responsive customer/bank/business relationship graph; exact Figma node pending API quota reset
- 2026-07-24: Bank Analysis Alerts state implemented from supplied reference — date-range header and centered no-warning/no-risk empty state; exact Figma node pending API quota reset
- 2026-07-24: Bank Analysis Compliance state implemented from supplied reference — threshold, PEP, four sanctions lists, enforcement, and watchlist No Match checks
- 2026-07-24: Bank Analysis Decision history state implemented from supplied reference — date-range header and no-history empty state; all five detail tabs now enabled
- 2026-07-24: Bank Analysis Single Lookup wired to `/bank-analysis/lookup` with KYB-pattern verification form and bank-specific fields; Bulk Lookup remains deferred because its distinct result screen is not implemented
- 2026-07-26: MFA login routing — detect upstream `{ message: "Multifactor Authentication required.", data: { userId } }` (401, no flag) in `extractMfaChallenge`; BFF returns challenge so sign-in navigates to `/mfa` instead of showing the message as a form error
- 2026-09-11: Core Platform docs/base URL updated to `https://unifycomply-api.rokxier.com` (see `.cursor/rules/core-platform-api.mdc`); test login kept in gitignored `.cursor/rules/core-platform-api.local.mdc`
- 2026-09-11: Frontend locked to Rokxier Core Platform — `.env.local` / `.env.example` `API_BASE_URL=https://unifycomply-api.rokxier.com`; BFF via `getApiBaseUrl()`
- 2026-09-11: **UI-first API integration policy** — never reshape Figma UI for backend DTOs; map in BFF/`lib/api` or raise blocker in Open Questions (`.cursor/rules/ui-first-api-integration.mdc`, `AGENTS.md`, architecture invariant 9)
- 2026-09-11: M2 API↔UI flow gap analysis — `context/feature-specs/09-m2-api-ui-flow-gap.md`; missing-screen policy = log + build flow; lookup/decisions logged as backend blockers
- 2026-09-11: M2 live intake slice — BFF allowlist `customers/` + `verifications/`; KYC onboarding submits `POST /customers/kyc` + documents; KYB Validate Document → `/kyb/onboarding` (API-derived) creates KYB + documents; lists remain mock
- 2026-09-11: **M2 on hold → M3 active** — `CURRENT_MILESTONE = 3`; TM Overview (`/transaction-monitoring`, Figma `1532:157044`) with mock empty dashboard; remaining TM nav routes scaffolded as placeholders
- 2026-09-11: Merged TM Figma exports from two zips into `design/figma/webapp/tm/` — **132 unique PNGs** after dedupe (198 staged → removed identical + same-name lower-res); includes Real-time, TM Category, PND, TM rules setting, SAR Rationale
- 2026-09-11: **Transactions explorer** — `/transactions` list (`TM Category-7`) + `/transactions/[id]` detail (Real-time frames); mock data; Actions menu chrome only (Resolve/PND/SAR deferred)
- 2026-09-11: **Visual QA** on Transactions list/detail vs Figma — fixed purple Cumul.Freq, bare filters, metric rounded-square icons, TXN id below title, Severity field, Figma-aligned row amounts; compliance roles granted TM nav for M3
- 2026-09-11: **Resolve Case modal** (`Real-time-8`) wired from Actions → Resolve Case; browser-checked against frame
- 2026-09-11: **Place PND modal** (`Real-time-12` / `PND-1`) — Actions → Place PND; includes Review Date, File SAR gated on narrative; browser-checked
- 2026-09-11: **TM queue lists** — `/tm-not-blocked`, `/stop-payment`, `/cumulative-frequency`, `/tm-blocked` via `TmQueueListPanel`; Cum.Freq empty default; Stop Payment no Figma list (tracked); visual QA’d
- 2026-09-11: **Stop Payment frames** from Unifycomply (2).zip → `design/figma/webapp/tm/stop-payment/` (22 PNGs); `/stop-payment` list realigned to Risk/Severity/Rules/Status + Status filter (KPIs 12/$800k/7/2)
- 2026-09-11: **Account Statement** — `/transactions/[id]/account-statement` from View Account Activity; Sophie Williams populated mock; empty for other customers; visual QA vs `account-statement-populated.png`
- 2026-09-12: **Account Statement Figma re-QA** — KPI icon-left + 4-col grid; two-line timestamps; green credits; empty = Export Report + No User Activity (no Status/Action cols); populated wire sample rows + 10-page pagination; browser-checked `/transactions/txn-3066|3065/account-statement`
- 2026-09-12: **Account Statement Figma re-align** — KPI cards icon-left-of-label + 4-col grid; two-line timestamps; green credits / `-` empties; Status+eye only when populated; empty columns stop at Balance; Figma-matched wire sample rows; opening icon `Banknote`. Live browser screenshot pending (dev server sandbox isolation).
- 2026-09-12: **SAR Rationale wizard** — `/transactions/[id]/sar-rationale` (Basic → Red Flags → Rationale + Assistant → Export/Review + saved modal); Actions → Escalate Case modal; TM rules setting still open
- 2026-09-12: **Visual QA** SAR wizard vs `stop-payment/sar-*.png` — added step titles/subtitles, stepper connectors, preview label/value layout; success modal checked
- 2026-09-12: **TM Rules setting** — `/rules` list (Figma empty + populated) + `/rules/[id]` create/edit with Live Preview; COMPLIANCE → Rules enabled at M3; Adopt Template + Risk Score deferred
- 2026-09-12: **Adopt Template** — `/rules` opens `TM Rules Template` modal (`TM rules setting-11`–`-13`); catalog + View Details + Confirm Template; Risk Score still M4
- 2026-09-12: **Visual QA** Adopt Template vs `TM rules setting-11`/`-13` — added Industry Template banner label, wider modal, green industry chips, Popular on detail header right, square rule indexes, pill severity/action badges, Figma subtitle copy
- 2026-09-11: Added always-apply rule `.cursor/rules/visual-qa-figma.mdc` — visual QA before next UI build
- 2026-09-12: **M3 parked → M2 active** — `CURRENT_MILESTONE = 2`; KYC full export cached (`design/figma/webapp/kyc/`, 74 unique / 4 pixel dups dropped); resume KYC at Assigned To column
- 2026-09-12: **KYC Assigned To** — populated list column + `KycAssignedToCell` (Unassigned / Alimi Ayomikun / Tejumade Olomola / Favour Soma) vs `kyc/086.png`
- 2026-09-12: **KYC resubmission footer** — `status: resubmission` shows Reject + filled Request Resubmission (no Approve); fixture `/kyc/kyc-record-8` vs `kyc/117.png`
- 2026-09-12: **KYC Compare with Selfie (119)** — failed match overlay is Request Resubmission + `{n}% Match Score` (warning); biometric ring/liveness Failed uses error tokens
- 2026-09-12: **KYC lookup Address Information** — tab wired on `/kyc/lookup/result` with **Comment** (frames 92–93). Frame 115 **In Review** metric not adopted (conflicts with 79/86 **High Risk Alert**).
- 2026-09-12: **KYB full export cached** — `🪪Unifycomply (4).zip` → `design/figma/webapp/kyb/` (54 unique, 0 pixel dups). Frame **84** is the batch-file queue, not the business list (that is **89**). Stray KYC **157** cached at `kyc/157.png`. Gaps: Assigned To / Verification Type, batch-file list, Batch Lookup result (137), document viewer.
- 2026-09-12: **KYB Assigned To + Verification Type** — `KybTable` columns match frame 89; business type is a name subtitle; assignees reuse `KycAssignedToCell`. Empty-frame 77 header order (Assigned To before Risk Score) not adopted.
- 2026-09-12: **KYB batch-file queue** — Type filter label **Type**; **Bulk Search** switches `/kyb` to `KybBatchTable` (Batch ID, File Name, Created Date, Created By, Assigned To, Country, Status, Total) vs `kyb/084.png`. Eye opens `/kyb/batch/[id]`.
- 2026-09-12: **KYB Batch Lookup result** — `/kyb/batch/kyb-batch-1` vs `kyb/137.png`: Back + `KYB / Batch Lookup / techventures`, Total Business card, Batch search filter, queue table. Frame 137 risk **5** stored as **4**. Country stays Nigeria/Ghana (not NG/GH flags).
- 2026-09-12: **KYB document viewer** — Document tab Eye opens Certificate of Incorporation modal (`KybDocumentViewerModal`) vs `kyb/131.png`: title, preview, Cancel, Download, X. Row Download saves the mock preview. Frames 132 / 136 are overlay clones.
- 2026-09-12: **AML full export cached** — `AML.zip` → `design/figma/webapp/aml/` (63 unique / 67 exported, 4 pixel dups). List 15–27, Customer AML 34–65, 21 verifications. `/aml-screening` still placeholder. Build order in Current Goal.
- 2026-09-12: **AML list** — `/aml-screening` populated default (frame 20, metrics 14/5/5/12); `?empty=1` for No User Activity. Filter **In Review** (table 020), not **Under Review** (filter 017). No Batch Screening sidebar item.
- 2026-09-12: **AML Create a Case** — Choose action (026) → `/aml-screening/lookup` single (044) and `?mode=batch` (045). Search stays on the form until Search Result. Batch dropzone accepts CSV/Excel (Figma 045 dropzone still says Jpeg/Png). Country options match KYB (Nigeria/Ghana/Kenya/South Africa).
- 2026-09-12: **AML Search Result** — `/aml-screening/lookup/result` vs `aml/037.png` (4 cards) and `?view=single` vs `aml/039.png`. Change Match Status + Save after selection (040 / 041). Filters tab Clear / Apply (042 / 043). Pagination is real page count (not Figma dummy 10). Photo is a silhouette placeholder (Figma stock portrait not in repo). Batch Search still stays on the form.
- 2026-09-12: **AML Batch Lookup** — `/aml-screening/batch/techventures` vs `aml/024.png`: Total Screened 14 / Matches Found 8 / No Matches 3 / Errors 3; Corporate/Individual + NG/GH flags. Batch Search and list Batch-row Eye open this route. Entity Eye held until case detail. Pagination is real page count.
- 2026-09-12: **AML case detail** — `/aml-screening/favour-peter-soma` vs `aml/034.png` (Key Summary) plus Linked (047), Additional (050), Verifications, Warning empty (061), Risk (062), Decision empty (063). Corporate `/aml-screening/meridian-trading?kind=corporate` vs 056 / 057 / 060. Breadcrumb uses the opened entity name (Figma 056 still says FAVOUR PETER SOMA). Photo is the silhouette placeholder. Escalate Submission is visible and no-op until `verifications-13`. List + batch Eyes open this route.
- 2026-09-12: **AML Escalate to Senior Officer** — footer Escalate Submission opens `AmlEscalateModal` vs `aml/verifications-13.png`: Risk Score 4 / Sanction Yes / Warnings Yes (Figma modal fixture, not the all-No-Match verification tab). Comments optional. Cancel / Escalate Case closes the modal. Decision history stays empty (frame 14 is Auto-approved, not an escalate result). AML unique UI is closed.
- 2026-09-12: **Bank Analysis full export cached** — `Bank_Analysis.zip` → `design/figma/webapp/bank/` (47 unique, 0 pixel dups). Sequence gap 20–40. List 11–19, detail 41–72, run 7–12.
- 2026-09-12: **Bank Analysis Batch Lookup** — `/bank-analysis/batch/techventures` vs `bank/018.png`: breadcrumb Bank Analysis / Batch Lookup / {slug}, metrics 20/8/12/3 (**high risk Entity**), Date/Status/Assignee/Type filters, Run ID table, Eye → `/bank-analysis/ba-run-1`. Choose action Batch Lookup and Bulk Analysis (run-12) open this flow. Pagination is real page count. Shipped list columns still inferred — logged, not rewritten.
- 2026-09-12: **Bank Analysis escalate** — `/bank-analysis/ba-run-1?view=high-risk` footer vs `042.png`; modal vs `071.png`: Escalate to Senior Officer, Risk Score 4 / Sanction Yes / Warnings Yes. Comments optional. Cancel / Escalate Case close. Decision history stays empty. Default `ba-run-1` stays frame 41 (no footer). High-risk view keeps the six-account grid (frame 42’s 4-card portfolio not adopted). Bank Analysis unique UI is closed.
- 2026-09-12: **Bank Analysis list re-QA** — `/bank-analysis` vs `016.png`: Run a Check, Date/Status/Assignee/Type filters, Run ID / Full Name / Date / Type / Accounts / Analyst / Assigned To / Alerts / Risk Score / Status, fourth metric **high risk Entity**. `?empty=1` vs `011.png` (No User Activity, **high risk alerts**). Pagination is real page count. Eye still opens Favour Peter Soma detail. M2 Figma unique UI is closed.
- 2026-09-12: **Live KYC/KYB list + detail** — `/kyc` and `/kyb` read `GET /customers/kyc|kyb` via BFF; detail reads customer + documents (+ KYB shareholders). Columns/tabs unchanged. Lookup, Approve/Reject/Escalate, and rich verification panels stay mock. Fixture detail ids kept for Figma risk-score QA.
- 2026-09-12: **Account purpose + start verification** — API-derived `/kyc/[id]/account-purpose` and `/start-verification` (KYB twins). Onboarding submit continues here. GET purpose 404 = empty form. Check picker from `available-checks`; sandbox provider preferred. Figma lookup and decision footers unchanged. Live detail only shows muted intake links.
- 2026-09-14: **Settings app picker** — API-derived `/settings` header App select + Create App (`15-settings-app-picker.md`). App-scoped settings call `/v1/tenants/apps/{appId}/…` for API keys, approvals, PEP, notifications, and compliance rules. No Figma frame.
- 2026-09-14: **Visual QA** Settings `886:194137` (metadata; Figma PNG blocked by MCP rate limit). Title + subtitle match the frame (period removed from subtitle). App picker is an intentional addition on the title row — compact inline App select + Create App, no extra caption. Create App modal follows Invite Team Member chrome. Profile 401 in this session is expired cookies, not a layout issue.
- 2026-09-14: **Pre-KYC / Re-KYC tenant flow plan** — `16-prekyc-rekyc-tenant-flow.md`. Missing screens planned on the existing KYC/KYB desk (not new nav, not platform admin). Packages/Request stay placeholders.
- 2026-09-15: **API integration guide** — Backend `api-integration-guide.pdf` (2026-09-14) archived as `docs/api-integration-guide.pdf` + extracted `docs/api-integration-guide.txt`. Companion docs still needed: `verification-list-endpoints.md`, `kyc-review.md`, `kyb-review.md`, `risk-model.md`.
- 2026-09-15: **Verification detail tabs (docs + risk)** — Archived `docs/verification-detail-tabs.pdf`. Wired queue → detail `?workflowId=`; session JWT tab GETs for KYC documents/risk-score and KYB document/risk-score/business-overview. Figma tabs preserved; OCR/IP/liveness empty states per guide.
- 2026-09-15: **Visual QA — KYC/KYB detail tabs** — Walked all KYC tabs on live Palmer Luckey + all KYB tabs on fixture `kyb-record-5`. Live KYC docs/risk OK; signed previews blank. Live KYB queue detail broken for workflow-only ids (needs workflow-only shell). Mock KYB tabs structure passes.
- 2026-09-15: **KYB workflow-only detail shell** — `buildWorkflowOnlyKybDetail` when customer 404 + overview has no `business` (legacy null enrichment). Re-QA live `/kyb/40ee0f97…`: all 6 tabs render; Overview shell + Risk live; other tabs empty states.
- 2026-09-15: **KYB all detail tabs lazy-wired** — `GET …/kyb/:workflowId/{business-overview,risk-score,directors-officers,shareholders,document,compliance-checks}` on tab click (guide). Mappers keep Figma chrome; empty when payload empty.
- **KYC all detail tabs lazy-wired** — `GET …/kyc/:workflowId/{documents,risk-score,aml-screening,device-information,liveness}` on tab click. Device always empty today (guide); liveness often skipped.
- 2026-09-23: **M3 transactions live** — BFF allowlist `transactions/`; `lib/api/transactions.ts` + UI-first mappers; `/transactions` + `/transactions/[id]` via containers/hooks. OpenAPI has create+list+get only (no category/queue/rules schema) — defaults preserve Figma chrome. Empty live → “No User Activity”; `?mock=1` → populated fixtures for visual QA. Queues/SAR/rules/overview stay mock. Subscribe remains on KYC/KYB customer paths.
- 2026-09-23: **M2 remaining API slice wired** — Document requirements checklist (`GET …/documents/requirements`) on KYC/KYB Document tabs; KYB **Add shareholder** modal (`POST …/shareholders`); flag status panel (`PATCH …/flags/{id}` warning→investigating→revised) on Document tab without removing Approve/Reject/Escalate. Visual QA: Palmer Luckey 3/3 received; Stripe UK Ltd shareholders + Add button; KYB docs 3/4 (Directors ID missing). No sandbox customers currently have flags to exercise transitions.
- **M3 API ↔ UI gap (blocker note):** Transaction list metrics (Not Blocked / Stop Payment / Cum.Freq / TM-Blocked) and detail AI risk / rules / related txs need enrichment the ingest API does not return yet. Do not remove Figma panels — map when backend adds fields or dedicated TM alert APIs.
