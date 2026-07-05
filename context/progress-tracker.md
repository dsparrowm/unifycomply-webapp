# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

**Milestone 1 — Foundation (in progress)**

Only M1 work is active. M2+ routes are disabled in the sidebar and redirect if accessed.

## Scope Decisions

| Decision | Value |
| -------- | ----- |
| Router | Next.js **App Router**, `app/` at project root |
| Figma scope | **WebApp page only** (`1:2`) |
| Landing page | **Out of scope** — built in another repo |
| **Active milestone** | **M1 only** (`lib/constants/milestones.ts`) |
| Data | Mock data for v1 |

## M1 Completion Checklist

| Phase | Item | Status |
| ----- | ---- | ------ |
| 1 | Project setup (Next.js, Tailwind, routing) | Done |
| 2 | Design system + tokens | Done |
| 3 | Authentication UI (`886:48671`) | Done |
| 4 | Tenant admin (settings, users, roles, API keys) | In progress — Profile Management done |
| 5 | Dashboard shell (sidebar, header, sandbox toggle) | Done |
| 5 | Overview dashboard (`886:49385`) | Done |

**M1 is not complete** until auth UI and tenant admin screens are implemented.

## Current Goal (M1 only)

1. Tenant admin screens — remaining sections (Business Information, Teams, Roles, Security, etc.)
2. RBAC-aware nav gating (mock roles)

**Do not start:** KYC, KYB, AML, bank analysis, transaction monitoring, SAR (M2–M4).

## Milestone Status

| Milestone | Status |
| --------- | ------ |
| **M1 — Foundation** | **In progress (active)** |
| M2 — KYC Orchestration | Blocked — KYC components exist for future use only |
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

## Deferred to M2

- Full KYC list page (`components/kyc/*` kept, route redirects to overview)
- KYB, AML, bank analysis screens

## Next Up (M1 only)

1. Implement remaining tenant admin sections (M1 Phase 4)
2. RBAC nav gating

## Feature Unit Queue (M1 only)

| Order | Unit | Figma node | Status |
| ----- | ---- | ---------- | ------ |
| 1 | Project scaffold | — | Done |
| 2 | Design system + tokens | `886:70409` | Done |
| 3 | App shell + milestone gating | `886:70409` | Done |
| 4 | Overview dashboard | `886:49386` | Done |
| 5 | Auth / onboarding UI | `886:48671` | Done |
| 6 | Tenant admin | SETTINGS `886:184304` | In progress — Profile Management |
| 7 | RBAC nav gating | — | Not started |

## Architecture Decisions

- `CURRENT_MILESTONE = 1` in `lib/constants/milestones.ts` — single source of truth
- M2+ sidebar items rendered disabled until milestone advances
- `/kyc` redirects to `/overview` while `CURRENT_MILESTONE < 2`
- KYC components preserved in `components/kyc/` for M2, not routed in M1

## Session Notes

- 2026-07-02: Realigned to M1-only — disabled M2+ nav, overview as home, KYC deferred
- 2026-07-03: Sidebar nav icons exported from Figma (`886:70409`) to `public/assets/sidebar/` and wired in `AppSidebar`
- 2026-07-03: Search modal overlay (`AppSearchModal`) — blurred backdrop, Cancel dismiss, empty state per reference screenshot
- 2026-07-06: Overview dashboard populated mock data — verification stats, endpoints, activity tones, API stacked bar chart
- 2026-07-06: Settings page — internal nav, Profile Management form with mock data per Figma SETTINGS frame
