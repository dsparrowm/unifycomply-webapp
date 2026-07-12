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
| Data | Mock data for v1 |

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

1. KYB list, onboarding wizard, compliance queue, bank analysis, AML (remaining M2)

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
- Milestone gating — `CURRENT_MILESTONE = 1`, disabled M2+ nav
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

- KYB, AML, bank analysis screens (M2 — not started)
- Transaction monitoring (M3)

## Next Up (M2)

1. KYC detail / verification dashboard (`/kyc/[id]`)
2. KYB list page
3. Onboarding wizard
4. Compliance queue
5. Bank analysis and AML screening UI

## Feature Unit Queue (M1 only)

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

## Architecture Decisions

- `CURRENT_MILESTONE = 2` in `lib/constants/milestones.ts` — M2 routes enabled through KYC/KYB/AML/bank analysis
- `/kyc` uses populated list (frame 86) for M2 development; `kycListDataEmpty` reserved for post–Add Customer flow
- `/kyc/[id]` detail page — frame 96 baseline with document viewer, extracted fields, risk/biometric/timeline panels; mock via `lib/data/kyc-detail.ts`
- `/kyc/lookup` — Perform Lookup entry (frame 90) with lookup type/country/identifier form, sandbox/production toggle
- `/kyc/lookup/result` — BVN lookup results (frames 91–94) with tabs, summary panel, address tab, footer actions
- KYC list **Add Customer** opens choose-action modal (frame 115) — Perform Lookup → `/kyc/lookup`

## Session Notes

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
- 2026-07-12: KYC AML Screening tab (frame 143 / `886:96317`) — summary cards (Medium, risk 2/4), PEP match detail panel, sanctions/adverse media/watchlist dark sections aligned to Figma reference screenshot
- 2026-07-12: KYC Request Document Re-submission modal — checkbox issue list, wired to detail and lookup footer actions
- 2026-07-12: KYC AML PEP match detail panel — flagged screening view with bio analysis, sources, timeline, risk factors
