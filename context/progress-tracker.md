# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

**Milestone 2 — KYC Orchestration (complete; M3 not yet activated)**

M1 and the design-defined M2 scope are complete. M2 routes remain enabled;
M3+ remain disabled until `CURRENT_MILESTONE` is explicitly advanced.

## Scope Decisions

| Decision | Value |
| -------- | ----- |
| Router | Next.js **App Router**, `app/` at project root |
| Figma scope | **WebApp page only** (`1:2`) |
| Landing page | **Out of scope** — built in another repo |
| **Active milestone** | **M2** (`lib/constants/milestones.ts`) |
| Data | Hybrid — live auth/settings via BFF; KYC/KYB/AML/overview/audit logs mock |

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

**M1 feature development is complete.** `CURRENT_MILESTONE` advanced to M2 on
2026-07-11. M1 remains subject to the shared QA/UAT gates in `go-live-checklist.md`.

## Current Goal

M2 implementation is closed. Preserve milestone gating and complete product
QA/UAT before activating M3.

## M2 Completion Checklist

- [x] KYC list, lookup, detail, decisions, risk visualization, and customer onboarding
- [x] KYB list, lookup, detail, and core decisions
- [x] Standalone AML list, Single/Batch lookup, detail, case, and escalation
- [x] Bank Analysis Batch Lookup, decision history, and escalation
- [x] Remaining design-defined KYB actions and states
- [x] Lint, TypeScript, production build, and browser smoke checks
- [x] M2 feature specs, go-live checklist, architecture, and tracker reconciled

Visual parity was checked against available metadata and existing project patterns.
PNG-level comparison remains unavailable because Figma returned HTTP 429 on
2026-08-06 (`Retry-After: 9146` seconds); no design behavior was invented.

**Approved deferrals for M2 exit:** KYB Validate Document/business onboarding and
Packages/Request remain deferred because the WebApp page has no dedicated designs.
Duplicate sandbox/production frames do not require separate implementations; each
distinct workflow and meaningful state does.

## Design cache (2026-07-23 / 2026-07-24)

WebApp page (`1:2`) re-inventoried via local Framelink MCP:

| Metric | Count |
| ------ | ----- |
| Frames on page | 475 |
| Curated captures (incl. modals/drawers/click states) | 324 |
| Skipped duplicates / non-screens | 158 |
| PNGs exported so far | ~25 (mostly onboarding + partial KYC) |

**Blocked (reconfirmed 2026-08-06):** Figma API returns **429** with
`Retry-After: 9146` seconds. The Viewer/Collaborator seat on a Starter plan has
limited API access. Continue using the persisted inventory/cache until quota resets
or the seat/plan is upgraded.

Resume order when unblocked (M2 → up): **KYC → KYB → AML → Bank → Overview/Settings → TM**.

Plan + raw inventory: `design/figma/webapp/_capture-plan.json`, `_inventory-raw.json`.  
Policy: `context/feature-specs/00-design-inventory.md`, `design/figma/webapp/README.md`.

## Open Questions

- **Customer onboarding wizard Figma frames:** MVP flowchart references module 1.1 (`1532:157029`) but no WebApp frame exports in `design/manifest.json`. Wizard implemented from `mvp-roadmap.md` step list; re-align when frames are exported.
- **Compliance queue:** Not a separate Figma route — reviewer workflow uses KYC/KYB list status filters (`Pending`, `In Review`, etc.) per frames 79–86. Do not add `/compliance-queue`.
- **Bank analysis fourth metric label:** Frame 11 uses **high risk alerts**; populated frame 16 uses **high risk Entity**. List UI uses frame 11 string until design confirms one label.
- **Packages / Request:** Sidebar items under BACKGROUND CHECK have **no dedicated WebApp section frames** (only nav labels). Keep placeholder routes until design adds screens.
- **KYB Validate Document:** Choose-action option exists in Figma/UI but has no business onboarding wizard frames; button currently closes modal only.
- **KYC Choose action frame:** Overlay lives on frame **114** (`886:80735`), not 115 (`886:81117` is empty sandbox list). Spec notes should prefer 114 as modal reference.
- **MFA challenge payload (resolved 2026-07-26):** Live upstream returns HTTP 401 / `status:false` with `message: "Multifactor Authentication required."` and `data: { userId }` only (no `requiresMfa` flag). BFF now detects via message + `userId` and returns `{ requiresMfa: true, userId }` so sign-in routes to `/mfa`.
- **Audit logs API:** No OpenAPI route — Settings → Audit Logs remains mock.
- **RBAC vs API permissions:** UI still gates on `TenantRole` slugs; API returns fine-grained permissions (`verification:approve`, …). Migrate nav/action gating later.
- **Google OAuth upstream redirect_uri:** Core Platform Google app currently points at its own callback host (e.g. API localhost). Frontend wires `redirectUrl` → `/auth/google/callback?intent=…`; end-to-end requires upstream Google config to match the deployed API.

## M2 Figma coverage audit (2026-07-23)

Source: WebApp page metadata dump (file `gJgHsHV3Jt9wYKJfstVdWB`, sections KYC / KYB / AML / BANK). Figma MCP unavailable in this workspace; inventory refreshed from prior `get_metadata` export.

| Area | Figma top-level frames | App coverage | Gaps (screens + supporting UI) |
| ---- | ---------------------- | ------------ | ------------------------------ |
| **KYC** | 79–156 (~78 screens) | Strong — list, filters, lookup, detail, decision modals | Minor state variants; choose-action ref = frame 114; no wizard frames |
| **KYB** | 77–137 (~61 screens) | Complete for design-defined scope — list, lookup, detail tabs, decisions | Validate Document/business onboarding deferred: no dedicated frames; frame 137 is a Production Mode list state |
| **Bank Analysis** | 11–19, 41–72, run 7–12 (~48) | Complete for distinct workflows — list, Single/Batch lookup, detail tabs, decisions, escalation | Duplicate visual states and mock Export Report deferred |
| **AML Screening** | 15–27 + AML 34–66 + verifications (~67) | List aligned to Figma 15–21; detail chrome (tabs + Search Information rail) aligned to frame 34; Single/Batch lookup, batch results, Create Case, escalation | Sources / Warning / Risk Analysis tab bodies still placeholders; Create Case still modal vs Figma full-page frame 44; Export Report UI-only |
| **Packages / Request** | No section frames | Placeholder routes | No Figma screens to implement |
| **Onboarding wizard** | None in WebApp | Implemented from roadmap | Needs Figma alignment when frames exist |

**Supporting overlays confirmed in Figma (modals — no separate drawer section for M2):**

| Overlay | Representative frames | Status |
| ------- | --------------------- | ------ |
| KYC Choose action (Perform Lookup / Validate Document) | `886:80735` (114) | Done |
| KYC Confirm Approval | `886:76907`, `886:93088`, `886:99201` | Done (`KycApproveModal`) |
| KYC Request Document Re-submission | `886:87691`, `886:88150` | Done |
| KYC Reject / Escalate | KYC detail decision frames (footer + modals) | Done |
| KYB Approve / Reject / Resubmission | Detail frame 93 footer + modals (also lookup result) | Done |
| Bank Choose action (Single / Batch Lookup) | `886:164497` (19) | Done — `/bank-analysis/lookup` + `/bank-analysis/batch` |
| AML Choose action (Single / Batch Lookup) | `886:138601`, `886:139364` | Done |
| AML / Bank Escalate to Senior Officer | AML verifications; Bank `71`–`72` | Done |
| Priority SLA reference panel | `886:81487` (276×612) | Not started (optional helper) |

## Milestone Status

| Milestone | Status |
| --------- | ------ |
| **M1 — Foundation** | **Complete** |
| **M2 — KYC Orchestration** | **Complete (active milestone remains M2)** |
| M3 — Transaction Monitoring | Blocked |
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

## Next Up

1. Product QA/UAT for M1–M2 against `go-live-checklist.md`
2. Restore PNG-level Figma parity checks when API quota permits
3. Activate M3 only after explicit milestone advancement

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
| 13 | KYB list page (empty + populated) | `886:106307`, `886:108206` | Done |
| 14 | Customer onboarding wizard | MVP flowchart `1532:157029` | Done — `/kyc/onboarding` |
| 15 | KYB Perform Lookup flow | `886:108577`–`886:109104` | Done — `/kyb/lookup` |
| 16 | Bank analysis list | `886:161366`, `886:163331` | Done — `/bank-analysis` |
| 17 | KYB detail page (frame 93) | `886:110808` | Done — cleared + high-risk (95/112) |
| 18 | M2 placeholder routes | — | Done — `/aml-screening`, `/packages`, `/request` |
| 19 | AML screening list UI | `886:134393`–`886:139364` | Done — list, filters, choose action, Single/Batch entry and results |
| 20 | AML screening detail + escalate | `886:140127`+ | Done — matching, Create Case, escalation, decision history |
| 21 | Bank analysis lookup + detail | `886:177612`, `886:164117`, `886:165268`+ | Done — Single/Batch entry, batch result, detail tabs, populated decisions, escalation |
| 22 | KYB frame 137 classification + remaining actions | `886:124831` | Done — Production Mode list state; lookup approval wired |

## Architecture Decisions

- Backend Phase 1: `API_BASE_URL` server-only; tokens in `uc_access` / `uc_refresh` httpOnly cookies; browser talks only to `/api/*`
- `administrator` role alias maps to UI `admin` for RBAC
- `CURRENT_MILESTONE = 2` in `lib/constants/milestones.ts` — M2 routes enabled through KYC/KYB/AML/bank analysis
- `/kyc` uses populated list (frame 86) for M2 development; `kycListDataEmpty` reserved for post–Add Customer flow
- `/kyc/onboarding` — five-step customer wizard (personal → business → documents → review → consent); entry via Validate Document modal
- `/kyb` — KYB list (frame 79 empty default, frame 84 populated fixture); mock via `lib/data/kyb.ts`; columns match Figma (Verification Type, Assigned To, View); filters use Batch search
- `/kyb/lookup` — Perform Lookup entry (frames 85–88) with country/app/lookup-type form, single + bulk modes
- `/kyb/lookup/result` — business registry lookup results with tabs, summary panel, footer actions; mock via `lib/data/kyb-lookup.ts`
- `/kyb/[id]` — KYB detail: cleared baseline `kyb-record-5` (frame 93/134); high-risk `kyb-record-1` (frames 95/112) with tier risk cards, OFAC sanctions expand, escalate footer; mock via `lib/data/kyb-detail.ts`
- KYB list **Add Business** opens choose-action modal — Perform Lookup → `/kyb/lookup`
- `/bank-analysis` — list (frame 11 empty, frame 16 populated); metrics Total screening / Total Alerts Generated / Completed / high risk alerts; **New Lookup** choose-action modal (Single / Batch Lookup)
- `/bank-analysis/lookup` — KYB-pattern Single/Batch verification UI with Country, App, Bank, Account Number, and bulk upload; mock submissions open detail or `/bank-analysis/batch`
- `/bank-analysis/batch` — frame-18 typed batch result with completed, review, and failed records
- `/bank-analysis/[id]` — Key Summary, Linked Entity, Account Analysis, Network Intelligence, Alerts, Compliance, Decision history, escalation, date-range menu, and persistent sidebar; report export remains deferred
- `/kyc/[id]` detail page — frame 96 baseline with document viewer, extracted fields, risk/biometric/timeline panels; mock via `lib/data/kyc-detail.ts`; **0–4 risk score** drives per-tab UI variants via `lib/kyc/risk-score.ts` (no separate tier enum)
- `/kyc/lookup` — Perform Lookup entry (frame 90) with lookup type/country/identifier form, sandbox/production toggle
- `/kyc/lookup/result` — BVN lookup results (frames 91–94) with tabs, summary panel, address tab, footer actions
- KYC list **Add Customer** opens choose-action modal (frame 115) — Perform Lookup → `/kyc/lookup`
- `/aml-screening` — Figma list (15–21): Create a Case CTA → `/aml-screening/create-case`, TOTAL SCREENING / ACTIVE MONITORING / CLEAR STATUS / BLOCKED metrics, Date/Status/Monitoring/Assignee/More filters + Export Report, table columns AML ID → Active Monitoring
- `/aml-screening/create-case` — Figma Create a New Case form (frame 44) with Search By rail; Search → `/aml-screening/search-results`
- `/aml-screening/search-results` — Figma Search Results (records, match status actions, Search Information rail); name → detail
- `/aml-screening/lookup`, `/aml-screening/batch`, `/aml-screening/[id]` — screening entry/results, matching configuration, Create Case, escalation, and decision history
- `/packages`, `/request` — placeholder routes because no dedicated WebApp frames exist; milestone + RBAC gating enforced in `canAccessPath`
- `canAccessPath` combines RBAC permissions with `isPathEnabledForCurrentMilestone` for deep-link protection

## Session Notes

- 2026-08-12: Frontend status update refreshed from the 20 July PDF working brief — M2 marked **complete** in `docs/status-update-screens-and-endpoints.{md,html}` (AML/Bank no longer placeholders; hybrid BFF called out; approved deferrals + residuals listed). Canvas: `frontend-status-update-m2`. Re-export PDF via browser print of the HTML.
- 2026-08-09: Frame 95 risk cards — full Figma copy (tier label, title, body, metadata, action strips); removed Standard chip when tier cards shown
- 2026-08-09: KYB PNG visual QA — live DOM vs `design/figma/webapp/kyb/`; frames 84/93/112/115/135/8336 match; 95 updated to match; report canvas `kyb-png-visual-qa`
- 2026-08-09: KYB Directors + Approve modal — `frame-1618868336` PEP Match/Verified card polish (red pill, teal AML icons); score 2 directors filled; Confirm Approval frames 115/135 (circular risk badge, verification type subtitle, grant-access copy); frame 122 classified as cleared overview duplicate of 93
- 2026-08-09: KYB high-risk detail parity — frames 95 (Overview tier risk cards + Urgent/escalate) and 112 (Compliance Checks OFAC View Details expand + PEP/Warning flagged); fixtures on `kyb-record-1` (risk 4); cleared baseline remains `kyb-record-5`
- 2026-08-09: Extracted Figma zip 22 into `design/figma/webapp/kyb/` — new frames 95, 119, 134 + components `frame-1618868278` / `frame-1618868336`; dropped exact dups and `8336-1/2/3` / KYC `9-1/9-2` variants
- 2026-08-09: Reorganized design cache under `design/figma/webapp/{onboarding,overview,kyc,kyb,aml,bank-analysis,settings,shared}/`
- 2026-08-09: Extracted Figma zips 18–20 into `design/figma/webapp/kyb/` — KYB frames 88, 91, 112, 115, 122, 133, 135; kept `kyc/customer-kyc-9.png` and dropped `9-1`/`9-2` export variants
- 2026-08-09: KYB list Figma parity (frame 84 screenshot) — Batch search filter, table columns (Verification Type, Country ISO, Assigned To, View), Verified/Failed status labels, Urgent/Standard priorities, colorized risk scores, refreshed `#3066`-style fixture; cached `kyb/customer-kyb-84.png`
- 2026-08-09: KYB detail Figma parity from user screenshot (`kyb/customer-kyb-93.png`) — underline tabs, remove header Risk Score chip, single overview card, risk-0 sidebar callout, decision footer (Request Resubmission / Reject / Approve); fixture `kyb-record-5` → TechVentures Limited / risk 0 / Standard; Pending badge uses warning tone
- 2026-08-09: Frame 95 risk cards use category + action-line mock (tier tones); fuller nested Figma body copy deferred until PNG text is transcribed line-by-line
- 2026-08-09: List row `kyb-record-1` keeps "TechVentures LTD" (frame 84); detail breadcrumb overrides to "TechVentures Limited" for frames 95/112
- 2026-08-06: AML Search Results — `/aml-screening/search-results` after Create Case Search; result cards + match-status Save + Search Information/Filters rail; cached `aml-search-results.png`
- 2026-08-06: AML Create Case Entity Type — multi-select dropdown (Select All, Person, Organization, Aircraft, Vessel) with soft selected row + trailing check; cached `aml-create-case-entity-type.png`
- 2026-08-06: AML Create a New Case alignment — true left/right form columns (Risk Engine bottoms with Country), Exact Match flush (no extra card), Search By Relevance/Entity Type 2×2 grids
- 2026-08-06: AML Create a New Case UI (frame 44) — full-page form + Search By rail at `/aml-screening/create-case`; list Create a Case CTA links there; Search mock-navigates to detail
- 2026-08-06: AML Additional information tab — Twitter source + Joe Biden external link from user Figma export (`aml-additional-information.png`); summary tab active style soft teal
- 2026-08-06: AML Linked Entities tab — implemented from user Figma export (`aml-linked-entities.png`); stacked relationship/name rows; summary tab active state teal fill; Additional Information still awaiting frame
- 2026-08-06: AML detail chrome Figma alignment (frame 34) — breadcrumb + Export, primary/summary tabs, Active Monitoring toggle, Key Summary + Verifications content, Search Information rail; Sources/Warning/Risk Analysis placeholders; decision actions footer retained
- 2026-08-06: AML list Figma alignment (frames 15–21) — header/subtitle/CTA, metrics, KYC-style filters + Export, table schema (AML ID, Full Name, Date & Time, Type, Initiated By, Risk Score, Assigned To, Status, Active Monitoring); statuses Flagged/Clear/In Review/Blocked; **Create a Case** still opens Single/Batch choose-action (label vs workflow mismatch noted). Detail parity deferred.
- 2026-08-06: AML Figma cross-check — pulled 9 PNGs to `design/figma/webapp/aml/`; list + detail diverge from frames 15–21 / 34 (metrics, filters, table, tabbed profile + Search Information rail). Choose-action/lookup/case/escalate closer. Report: canvas `aml-figma-parity`.
- 2026-08-06: Fixed KYC/KYB lookup footers for mobile — stack full-width below `sm` (match Bank Analysis); Cancel no longer off-screen at 390px
- 2026-08-06: M2 mobile smoke at 390×844 — shell/lists/details mostly OK; **critical**: KYC+KYB lookup footers (`min-w-[240px]`×2) push Cancel off-screen; medium: detail tab horizontal scroll, crowded header. Report: canvas `m2-mobile-responsiveness`. Bank/AML lookups already stack correctly.
- 2026-08-06: Sign-in Figma parity (`886:48672` / `886:49017`) — in-field `CircleAlert` on auth input errors, eye-slash when password masked, primary/secondary auth buttons `54px`, brand panel logo `size="auth"`; compared against `design/figma/webapp/onboarding/`
- 2026-08-06: Completed design-defined M2 scope — standalone AML list/Single/Batch/detail/case/escalation; Bank Batch Lookup/result and Senior Officer decision history; KYB lookup approval; documented no-design deferrals
- 2026-08-06: Verification passed — `pnpm run lint`, `pnpm exec tsc --noEmit`, clean `pnpm run build` (52 static pages), and browser smoke of AML, Bank Analysis, and KYB mock workflows; Figma parity API still 429
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
- 2026-07-12: KYB detail page (`/kyb/[id]`, frame `886:110808`) — Business Overview tab, risk/verification/business-size sidebar; mock via `lib/data/kyb-detail.ts`; canonical fixture `kyb-record-5` (TechVentures Nigeria Limited)
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
