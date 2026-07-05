# UNIFYCOMPLY MVP Development Roadmap (Frontend)

Source: `UNIFYCOMPLY MVP Development Roadmap.docx` — **frontend scope only**.

This repository implements the **WebApp UI** for all five milestones. The public
landing page is built elsewhere — do not implement Figma page `1:3` here.

Use **mock data** until external APIs are wired in.

## Development Methodology

Each milestone follows:

```
Requirements (Figma + feature spec)
    ↓
UI / component design
    ↓
Frontend implementation (mock data)
    ↓
Integration (when APIs are available)
    ↓
UI testing
    ↓
Code review
    ↓
Deployment
```

## Dependency Map (frontend)

```
Milestone 1 — Foundation
├── Project setup
├── Design system
├── Authentication UI
├── RBAC-aware navigation
└── Dashboard shell
        ↓
Milestone 2 — KYC Orchestration
├── Customer management screens
├── KYC / KYB flows
├── Onboarding wizard
├── Compliance queue
├── Bank analysis UI
└── AML screening UI
        ↓
Milestone 3 — Transaction Monitoring
├── Monitoring dashboard
├── Alert feed
├── Transaction explorer
└── Rule management UI
        ↓
Milestone 4 — SAR & Case Management
├── Case dashboard
├── Investigation workspace
├── Evidence upload UI
├── AI SAR review UI
└── Report downloads
        ↓
Milestone 5 — Optimisation & UAT
├── Performance
├── Accessibility
├── Responsive / cross-browser
├── Error pages
└── Production build
```

The app shell, design system, and auth UI (M1) must be complete before compliance
workflows, monitoring, and case management screens are built.

---

## Milestone 1 — Foundation

**Goal:** UI foundation every other module depends on.

| Phase | Scope |
| ----- | ----- |
| **1 — Project Setup** | Next.js, TypeScript, Tailwind, shadcn/ui. Routing, theme, layouts, API layer scaffold, state management. |
| **2 — Design System** | Buttons, forms, inputs, dropdowns, tables, cards, badges, alerts, modals, loaders, empty states, charts, notifications. |
| **3 — Authentication UI** | Login, Register, Forgot Password, Reset Password, MFA, Email Verification, Tenant Selection. |
| **4 — Tenant Administration** | Organization settings, user management, roles, permissions, API keys, profile, billing placeholder, audit log viewer. |
| **5 — Dashboard Framework** | Sidebar, header, navigation, breadcrumb, widgets, charts, notification center, responsive layout, Sandbox/Production toggle. |

### Roles (RBAC — UI gating)

| Scope | Roles |
| ----- | ----- |
| **Platform** | Super Admin |
| **Tenant** | Admin, Compliance Officer, Compliance Manager, MLRO, Developer, Support |
| **End User** | Customer |

Hide or disable nav items and actions the active role cannot access.

### Completion Criteria

- Authentication UI complete (mock auth acceptable)
- RBAC-aware navigation working
- App shell and design system complete
- Overview dashboard renders with mock data

---

## Milestone 2 — KYC Orchestration

**Goal:** Onboarding and identity verification UI.

| Area | Pages / flows |
| ---- | ------------- |
| **Customer Management** | Customers, Businesses, Beneficial Owners, Profiles, Timeline |
| **Onboarding Wizard** | Personal info → Business info → Document upload → Identity review → Consent → Submit |
| **KYC Dashboard** | Verification status, timeline, documents, risk score, alerts |
| **Compliance Queue** | Pending, Approved, Rejected, Review, Escalated |
| **Bank Analysis** | Bank analysis screens per Figma |
| **AML Screening** | Screening list, detail, status flows |

Maps to Figma: **KYC COMPLIANCE**, **KYB COMPLIANCE**, **BANK ANALYSIS**, **AML SCREENING**, **ONBOARDING**.

### Completion Criteria

- End-to-end KYC UI flows with mock data
- Compliance queue and risk score visualization
- Document upload UI

---

## Milestone 3 — Transaction Monitoring

**Goal:** Transaction monitoring dashboard UI.

- Monitoring dashboard
- Alert feed and alert details
- Transaction explorer
- Risk charts
- Rule management UI
- Queue viewer
- Monitoring analytics

Maps to Figma: **Transaction Monitoring**.

### Completion Criteria

- Dashboard and alert management UI complete
- Transaction explorer and rule management screens
- Analytics views with mock data

---

## Milestone 4 — SAR & Case Management

**Goal:** Investigation and regulatory reporting UI.

- Case dashboard
- Investigation workspace
- Evidence upload
- Commenting and timeline
- AI draft review panel
- SAR editor
- Assignment panel
- Report download UI

Maps to Figma: SAR Report, PND Watchlist, Rules, Risk Score (sidebar).

### Completion Criteria

- Case management UI complete
- Investigation workspace and SAR editor
- Report download flows (mock)

---

## Milestone 5 — Optimisation & UAT

**Goal:** Production-ready frontend.

- Performance: lazy loading, code splitting, caching
- Accessibility (WCAG-oriented)
- Responsive and cross-browser testing
- Error pages (404, 500, offline)
- Dark mode (optional — only if design adds it)
- Analytics hooks (if required)

### Documentation (frontend)

- User guide, admin guide, compliance guide

### Testing (frontend)

- Component tests, UI tests, E2E tests, accessibility tests, responsive tests

### Deployment

```
Development → Staging → UAT → Production
```

---

## Implementation Order

**Active milestone: M1.** Do not implement later milestones until M1 completion criteria
are met and `lib/constants/milestones.ts` is updated.

Align feature specs and `progress-tracker.md` to this order:

### Milestone 1 (current)

1. Scaffold, design system, tokens
2. App shell + milestone-gated navigation
3. Auth UI (sign-in, register, MFA, tenant selection)
4. Overview dashboard
5. Tenant admin (settings, users, roles, API keys)
6. RBAC-aware nav gating

### Milestone 2+ (blocked)

Do not start until M1 is complete:

2. **M2** — KYC/KYB, onboarding wizard, compliance queue, bank analysis, AML
3. **M3** — Monitoring dashboard, alerts, transaction explorer, rules
4. **M4** — Cases, SAR editor, investigation workspace, AI review UI
5. **M5** — Performance, accessibility, error pages, production hardening
