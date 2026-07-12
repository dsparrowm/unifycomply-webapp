# Architecture Context

## Stack

| Layer         | Technology                         | Role                                                     |
| ------------- | ---------------------------------- | -------------------------------------------------------- |
| Framework     | Next.js 15 App Router + TypeScript | Page routing under `app/` at project root                |
| UI            | Tailwind CSS 4 + Lucide icons      | Styling system and iconography                           |
| State         | Zustand                            | Auth UI, tenant context, sandbox toggle                  |
| Forms         | React Hook Form + Zod              | Form management and validation                           |
| Data (v1)     | Typed mock fixtures in `lib/data/` | Static data until APIs are integrated                    |

Use the **App Router** (`app/` directory). Do not use the Pages Router (`pages/`).
Do not use a `src/` wrapper — routes live at `app/` in the project root.

Custom presentational components live under `components/` (feature folders + shared
layout/feedback). There is no generated `components/ui/` shadcn layer in this repo.

## Multi-Tenant UI Considerations

When APIs are integrated later, the UI should support tenant context (tenant selection,
scoped lists). For v1 with mock data, model tenant and role in client state to
exercise RBAC navigation.

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
  globals.css
  layout.tsx             ← Root layout, fonts, providers

components/
  layout/              ← AppSidebar, AppHeader, PageHeader
  feedback/            ← EmptyState, loading/error states
  placeholders/        ← Route placeholder panels
  [feature]/           ← kyc/, kyb/, bank-analysis/, etc.

lib/
  utils.ts
  constants/           ← navigation, milestones, settings-nav
  data/                ← mock fixtures (v1)
  rbac/                ← permission matrix
  hooks/               ← useRbac and feature hooks

store/                 ← Zustand slices
types/                 ← shared TypeScript types
```

**Out of scope:** `app/(marketing)/`, landing page, Cover page.

### Route map by milestone

| Milestone | Routes under `app/(app)/` | Status |
| --------- | ------------------------- | ------ |
| **M1** | `/overview`, `/settings`, `/billing`, auth routes | Complete |
| **M2 (active)** | `/kyc`, `/kyb`, `/bank-analysis`, `/aml-screening`, `/packages`, `/request`, `/kyc/onboarding` | In progress — AML list UI remaining |
| M3 | `/transaction-monitoring`, … | Blocked until M3 |
| M4 | `/sar`, `/pnd-watchlist`, … | Blocked until M4 |

Auth routes under `app/(auth)/` per ONBOARDING section in Figma.

## Component Boundaries

- **App shell** — Sidebar (293px from KYC frame), header with search, Sandbox/Production
  toggle, user menu. All WebApp feature pages render inside this layout.
- **Feature sections** — One presentational component per major Figma section (metric
  cards, filter bar, data table). Container pages assemble sections and pass typed props.
- **Placeholders** — Routes enabled in nav but not yet fully implemented use
  `RoutePlaceholderPanel` until the feature spec unit is built.

## State Model (initial)

- **Form state (React Hook Form):** All multi-field forms; schemas colocated with forms.
- **UI state (Zustand or local state):** Sidebar, active nav, wizard step, mock auth/role.
- **Mock data (v1 default):** Static typed fixtures in `lib/data/` for all WebApp screens.
- **RBAC (v1):** Tenant role on auth tenant context. Permission matrix in `lib/rbac/permissions.ts`. Nav items declare `permission` in navigation constants. `RbacRouteGuard` redirects unauthorized deep links.
- **Later:** TanStack Query hooks in `lib/hooks/` when API contracts are provided.

## Data Source

- **v1 (default):** Mock data in `lib/data/`. Components consume typed props.
- **Later:** Data hooks when API contracts are provided.

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

## Figma → Code Mapping

When a WebApp frame is ready to implement:

1. Add or update the feature spec in `context/feature-specs/`
2. Add the route to `context/project-overview.md`
3. Extract tokens into `context/ui-context.md` if new
4. Define component boundaries in this file
5. Implement under `app/`; update `context/progress-tracker.md` when done
