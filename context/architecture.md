# Architecture Context

## Stack

| Layer         | Technology                         | Role                                                     |
| ------------- | ---------------------------------- | -------------------------------------------------------- |
| Framework     | Next.js 15 App Router + TypeScript | Page routing under `app/` at project root                |
| UI            | Tailwind CSS 4 + Lucide icons      | Styling system and iconography                           |
| State         | Zustand                            | Auth session metadata, tenant context, sandbox toggle    |
| Server state  | TanStack Query                     | Settings and authenticated API reads/mutations           |
| Forms         | React Hook Form + Zod              | Form management and validation                           |
| API           | Next.js BFF (`app/api/`)           | Proxies UnifyComply Core Platform; httpOnly JWT cookies  |
| Data (hybrid) | Live auth/settings + mock fixtures | KYC/KYB/AML/overview still mock until those APIs exist   |

Use the **App Router** (`app/` directory). Do not use the Pages Router (`pages/`).
Do not use a `src/` wrapper — routes live at `app/` in the project root.

Custom presentational components live under `components/` (feature folders + shared
layout/feedback). There is no generated `components/ui/` shadcn layer in this repo.

## Multi-Tenant UI Considerations

Tenant context comes from `/v1/auth/sign-in` / `/v1/auth/access` (`userAccess`,
`currentAccess`). Workspace switching uses `POST /v1/auth/access/switch`. Role names
from the API (e.g. `Administrator`) map to UI `TenantRole` slugs via
`normalizeTenantRole` / `ROLE_ALIASES` in `lib/rbac/permissions.ts`.

## System Boundaries

**In scope:** Figma WebApp page (`1:2`) only.

```
app/
  (auth)/              ← Sign-in, register, MFA, onboarding (886:48671)
  (app)/               ← Authenticated WebApp shell + feature routes
    layout.tsx         ← Sidebar, header, sandbox toggle
    overview/
    kyc/
    kyb/
    bank-analysis/
    aml-screening/
    packages/
    request/
    transaction-monitoring/
    settings/
    …                    ← per Figma WebApp sections
  api/
    auth/              ← BFF auth routes (set/clear httpOnly cookies)
    v1/[...path]/     ← Authenticated proxy to upstream /v1/*
  globals.css
  layout.tsx             ← Root layout, fonts, AppProviders

components/
  layout/              ← AppSidebar, AppHeader, PageHeader
  providers/           ← React Query AppProviders
  feedback/            ← EmptyState, loading/error states
  placeholders/        ← Route placeholder panels
  [feature]/           ← kyc/, kyb/, bank-analysis/, etc.

lib/
  api/                 ← client helpers, types, server upstream + cookies
  utils.ts
  constants/           ← navigation, milestones, settings-nav
  data/                ← mock fixtures (KYC/KYB/AML/overview/audit logs)
  rbac/                ← permission matrix
  hooks/               ← useRbac, use-settings (React Query)

store/                 ← Zustand slices (session metadata only — no JWTs)
types/                 ← shared TypeScript types
```

**Out of scope:** `app/(marketing)/`, landing page, Cover page.

### Upstream API

- Base URL: `API_BASE_URL` (server-only env). Docs: `https://unifycomply.svr.monolith.ng/v1/docs`
- Envelope: `{ status: boolean, message: string, data: T }`
- Auth: JWT Bearer. Cookies `uc_access` / `uc_refresh` (httpOnly). Refresh uses
  `Authorization: Bearer <refreshToken>`.
- Live today: authentication, tenant settings, user profile, public misc.
- Still mock: KYC, KYB, bank analysis, AML, overview charts, audit logs (no endpoint).

### Route map by milestone

| Milestone | Routes under `app/(app)/` | Status |
| --------- | ------------------------- | ------ |
| **M1** | `/overview`, `/settings`, `/billing`, auth routes | Complete (settings live via API) |
| **M2 (active)** | `/kyc`, `/kyb`, `/bank-analysis`, `/aml-screening`, `/packages`, `/request`, `/kyc/onboarding` | In progress — AML list UI remaining; data still mock |
| M3 | `/transaction-monitoring`, … | Blocked until M3 |
| M4 | `/sar`, `/pnd-watchlist`, … | Blocked until M4 |

Auth routes under `app/(auth)/` per ONBOARDING section in Figma.

## Component Boundaries

- **App shell** — Sidebar (293px from KYC frame), header with search, Sandbox/Production
  toggle (wired to `POST /v1/tenants/settings/domain/switch`), user menu. All WebApp
  feature pages render inside this layout.
- **Feature sections** — One presentational component per major Figma section (metric
  cards, filter bar, data table). Container pages assemble sections and pass typed props.
- **Settings** — Page containers use React Query hooks (`lib/hooks/use-settings.ts`);
  panels remain presentational with optional `onSave` callbacks.
- **Bank Analysis detail** — `/bank-analysis/[id]` composes a detail header, two-level
  tab navigation, account portfolio cards, and a risk/profile/network sidebar from
  typed mock data under `components/bank-analysis/detail/`.
- **Bank Analysis lookup** — `/bank-analysis/lookup` reuses the KYB lookup layout
  pattern with bank-specific single-verification fields under `components/bank-analysis/lookup/`.
- **Placeholders** — Routes enabled in nav but not yet fully implemented use
  `RoutePlaceholderPanel` until the feature spec unit is built.

## State Model

- **Form state (React Hook Form):** All multi-field forms; schemas colocated with forms.
- **UI state (Zustand):** Sidebar, sandbox/production environment.
- **Auth session (Zustand persist):** `authStep`, user, tenant/access metadata, domain —
  **never** JWTs (cookies only).
- **Server state (TanStack Query):** Settings and other BFF-backed reads/mutations.
- **Mock data:** Static fixtures in `lib/data/` for M2 compliance modules until APIs exist.
- **RBAC:** Tenant role on auth tenant context. Permission matrix in
  `lib/rbac/permissions.ts`. Nav items declare `permission` in navigation constants.
  `RbacRouteGuard` redirects unauthorized deep links.

## Data Source

- **Live (BFF):** Auth, tenant settings, user profile, public misc, domain switch.
- **Mock:** KYC, KYB, bank analysis, AML, overview, audit logs.

## Invariants

1. Components do not fetch data directly — data flows via props, hooks at page level, or Zustand.
2. No `any` types. All component props and store slices are explicitly typed.
3. Presentational components do not read global stores — containers pass props.
4. All styling uses CSS custom property tokens from `ui-context.md`.
5. One feature unit per step — do not combine unrelated Figma frames.
6. Figma WebApp page is the visual source of truth; `mvp-roadmap.md` and feature specs
   are behavioural source of truth.
7. Do not implement Landing Page or marketing routes in this repo.
8. RBAC: hide or disable navigation and actions the active role cannot perform.
9. **Milestone gating:** `CURRENT_MILESTONE` in `lib/constants/milestones.ts` controls
   which routes are active. Sidebar disables future-milestone nav items. `canAccessPath`
   in `lib/rbac/permissions.ts` also enforces milestone gating for deep links. Do not add
   pages for milestones above `CURRENT_MILESTONE`.
10. Browser code never holds access/refresh tokens; only the BFF reads httpOnly cookies.

## Figma → Code Mapping

When a WebApp frame is ready to implement:

1. Add or update the feature spec in `context/feature-specs/`
2. Add the route to `context/project-overview.md`
3. Extract tokens into `context/ui-context.md` if new
4. Define component boundaries in this file
5. Implement under `app/`; update `context/progress-tracker.md` when done
