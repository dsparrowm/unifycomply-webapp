                                                                            w# Architecture Context

## Stack (planned)

| Layer         | Technology                         | Role                                                     |
| ------------- | ---------------------------------- | -------------------------------------------------------- |
| Framework     | Next.js App Router + TypeScript    | Page routing under `app/` at project root                |
| UI            | Tailwind CSS + shadcn/ui           | Styling system and accessible component primitives       |
| State         | Zustand (if needed)                | Global client state — auth UI, filters, wizard steps     |
| Data Fetching | TanStack Query                     | Server state when APIs are integrated                    |
| Forms         | React Hook Form + Zod              | Form management and validation                           |

Use the **App Router** (`app/` directory). Do not use the Pages Router (`pages/`).
Do not use a `src/` wrapper — routes live at `app/` in the project root.

The project is not yet scaffolded. When `package.json` is added, update this table
with the exact versions in use.

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
    transaction-monitoring/
    settings/
    …                    ← per Figma WebApp sections
  globals.css
  layout.tsx             ← Root layout, fonts, providers

components/
  ui/                  ← shadcn/ui primitives — do not modify
  layout/              ← AppSidebar, AppHeader, PageHeader
  [feature]/           ← kyc/, aml/, monitoring/, etc.

lib/
  utils.ts
  constants.ts
  data/                ← mock fixtures (v1)
  hooks/               ← React Query hooks (when APIs exist)

store/                 ← Zustand slices (if needed)
types/                 ← shared TypeScript types
```

**Out of scope:** `app/(marketing)/`, landing page, Cover page.

### Route map by milestone

| Milestone | Routes under `app/(app)/` | Status |
| --------- | ------------------------- | ------ |
| **M1 (current)** | `/overview`, `/settings`, `/settings/users`, `/settings/roles`, `/settings/api-keys` | In progress |
| M1 `(auth)/` | `/sign-in`, `/register`, `/mfa`, … | Not started |
| M2 | `/kyc`, `/kyb`, `/bank-analysis`, `/aml-screening`, … | Blocked until M2 |
| M3 | `/transaction-monitoring`, … | Blocked until M3 |
| M4 | `/cases`, `/sar`, … | Blocked until M4 |

Auth routes under `app/(auth)/` per ONBOARDING section in Figma.

## Component Boundaries

- **App shell** — Sidebar (293px from KYC frame), header with search, Sandbox/Production
  toggle, user menu. All WebApp feature pages render inside this layout.
- **Feature sections** — One presentational component per major Figma section (metric
  cards, filter bar, data table). Container pages assemble sections and pass typed props.
- **Design system** — shadcn/ui primitives in `components/ui/` are not modified.

## State Model (initial)

- **Server state (TanStack Query):** When APIs are integrated; until then, mock fixtures.
- **Form state (React Hook Form):** All multi-field forms; schemas colocated with forms.
- **UI state (Zustand or local state):** Sidebar, active nav, wizard step, mock auth/role.
- **Mock data (v1 default):** Static typed fixtures in `lib/data/` for all WebApp screens.

## Data Source

- **v1 (default):** Mock data in `lib/data/`. Components consume typed props.
- **Later:** TanStack Query hooks in `lib/hooks/` when API contracts are provided.

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
   which routes are active. Sidebar shows future milestones disabled. Do not add M2+
   pages until the milestone constant is incremented.

## Figma → Code Mapping

When a WebApp frame is ready to implement:

1. Add or update the feature spec in `context/feature-specs/`
2. Add the route to `context/project-overview.md`
3. Extract tokens into `context/ui-context.md` if new
4. Define component boundaries in this file
5. Implement under `app/`; update `context/progress-tracker.md` when done
