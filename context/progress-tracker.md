# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

**Milestone 2 — KYC Orchestration (in progress)**

M1 is complete. M2 routes through milestone 2 are enabled; M3+ remain disabled.

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

**M1 feature development is complete.** Run UAT against `go-live-checklist.md` before advancing `CURRENT_MILESTONE`.

## Current Goal (M2)

1. AML screening UI (full section — list, modals, lookup, detail)
2. Bank analysis supporting flows (lookup entry, batch, detail, wire choose-action CTAs)
3. KYB Batch Lookup + Validate Document decision (or defer with design)

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
| **KYB** | 77–137 (~61 screens) | Strong — list, lookup, detail tabs, decision modals | **Validate Document** dead; **Batch Lookup** (`886:124831`); Confirm Approval variants |
| **Bank Analysis** | 11–19, 41–72, run 7–12 (~48) | Partial — list, lookup entry, all five detail tabs | Dedicated batch result (18), remaining run-state variants, escalate flow |
| **AML Screening** | 15–27 + AML 34–66 + verifications (~67) | Placeholder route only | **Entire section:** list, Batch Screening CTA, choose-action Single/Batch, batch results (24), detail (`AML Screening/ FAVOUR…`), matching config / Create Case (44+), Escalate |
| **Packages / Request** | No section frames | Placeholder routes | No Figma screens to implement |
| **Onboarding wizard** | None in WebApp | Implemented from roadmap | Needs Figma alignment when frames exist |

**Supporting overlays confirmed in Figma (modals — no separate drawer section for M2):**

| Overlay | Representative frames | Status |
| ------- | --------------------- | ------ |
| KYC Choose action (Perform Lookup / Validate Document) | `886:80735` (114) | Done |
| KYC Confirm Approval | `886:76907`, `886:93088`, `886:99201` | Done (`KycApproveModal`) |
| KYC Request Document Re-submission | `886:87691`, `886:88150` | Done |
| KYC/KYB Reject / Escalate | Detail decision frames (footer + modals) | Done |
| Bank Choose action (Single / Batch Lookup) | `886:164497` (19) | Single Lookup → `/bank-analysis/lookup`; Batch result deferred |
| AML Choose action (Single / Batch Lookup) | `886:138601`, `886:139364` | Not started |
| AML / Bank Escalate to Senior Officer | AML verifications; Bank `71`–`72` | Not started |
| Priority SLA reference panel | `886:81487` (276×612) | Not started (optional helper) |

## Milestone Status

| Milestone | Status |
| --------- | ------ |
| **M1 — Foundation** | **Complete** |
| **M2 — KYC Orchestration** | **In progress (active)** |
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

## Next Up (M2)

1. AML screening list + choose-action modal (`886:134393` … `886:139364`)
2. AML detail + escalate (`Customer // AML // 34+`)
3. Bank analysis Perform Lookup / Batch Lookup / detail (wire Single/Batch CTAs)
4. KYB Batch Lookup (`886:124831`) if still in M2 scope

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
| 17 | KYB detail page (frame 93) | `886:110808` | Done — all secondary tabs |
| 18 | M2 placeholder routes | — | Done — `/aml-screening`, `/packages`, `/request` |
| 19 | AML screening list UI | `886:134393`–`886:139364` | Not started |
| 20 | AML screening detail + escalate | `886:140127`+ | Not started |
| 21 | Bank analysis lookup + detail | `886:177612`, `886:164117`, `886:165268`+ | In progress — Single Lookup entry and all five detail tabs done; Batch Lookup result and escalation pending |
| 22 | KYB Batch Lookup | `886:124831` | Not started |

## Architecture Decisions

- Backend Phase 1: `API_BASE_URL` server-only; tokens in `uc_access` / `uc_refresh` httpOnly cookies; browser talks only to `/api/*`
- `administrator` role alias maps to UI `admin` for RBAC
- `CURRENT_MILESTONE = 2` in `lib/constants/milestones.ts` — M2 routes enabled through KYC/KYB/AML/bank analysis
- `/kyc` uses populated list (frame 86) for M2 development; `kycListDataEmpty` reserved for post–Add Customer flow
- `/kyc/onboarding` — five-step customer wizard (personal → business → documents → review → consent); entry via Validate Document modal
- `/kyb` — KYB list (frame 79 empty default, frame 84 populated fixture); mock via `lib/data/kyb.ts`; filters reuse KYC dropdown pattern
- `/kyb/lookup` — Perform Lookup entry (frames 85–88) with country/app/lookup-type form, single + bulk modes
- `/kyb/lookup/result` — business registry lookup results with tabs, summary panel, footer actions; mock via `lib/data/kyb-lookup.ts`
- `/kyb/[id]` — KYB detail (frame 93) with Business Overview tab, risk/verification/business-size sidebar, decision modals; mock via `lib/data/kyb-detail.ts`; table rows link from `/kyb`
- KYB list **Add Business** opens choose-action modal — Perform Lookup → `/kyb/lookup`
- `/bank-analysis` — list (frame 11 empty, frame 16 populated); metrics Total screening / Total Alerts Generated / Completed / high risk alerts; **New Lookup** choose-action modal (Single / Batch Lookup)
- `/bank-analysis/lookup` — KYB-pattern single verification UI with Country, App, Bank, and Account Number; successful mock submission opens `/bank-analysis/ba-run-1`; Bulk Verification remains disabled pending its result design
- `/bank-analysis/[id]` — Key Summary, Linked Entity, Account Analysis, Network Intelligence, Alerts, Compliance, Decision history, date-range menu, and persistent sidebar; Favour Peter Soma row links to `/bank-analysis/ba-run-1`; report export and escalation are deferred
- `/kyc/[id]` detail page — frame 96 baseline with document viewer, extracted fields, risk/biometric/timeline panels; mock via `lib/data/kyc-detail.ts`; **0–4 risk score** drives per-tab UI variants via `lib/kyc/risk-score.ts` (no separate tier enum)
- `/kyc/lookup` — Perform Lookup entry (frame 90) with lookup type/country/identifier form, sandbox/production toggle
- `/kyc/lookup/result` — BVN lookup results (frames 91–94) with tabs, summary panel, address tab, footer actions
- KYC list **Add Customer** opens choose-action modal (frame 115) — Perform Lookup → `/kyc/lookup`
- `/aml-screening`, `/packages`, `/request` — placeholder routes via `RoutePlaceholderPanel`; milestone + RBAC gating enforced in `canAccessPath`
- `canAccessPath` combines RBAC permissions with `isPathEnabledForCurrentMilestone` for deep-link protection

## Session Notes

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
