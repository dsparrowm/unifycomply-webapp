# Unifycomply

## Overview

This repository is the **WebApp frontend only** (Next.js App Router). Build UI against
the Figma **WebApp** page (`1:2`) using mock data. Backend services and the public
**Landing Page** are out of scope — landing is built elsewhere.

**Design file:** [Unifycomply — WebApp](https://www.figma.com/design/gJgHsHV3Jt9wYKJfstVdWB/%F0%9F%AA%AAUnifycomply?node-id=1-2)

**Product docs:** `context/mvp-roadmap.md`, `context/go-live-checklist.md`

## Goals

1. Deliver all **WebApp** screens from Figma (page `1:2`) per the MVP roadmap (M1–M5)
2. Match Figma with pixel-faithful layout and interaction patterns
3. Use mock data for v1; wire to external APIs only when contracts are provided
4. Enforce role-based navigation and action gating in the UI

## User Roles (RBAC)

| Scope | Roles |
| ----- | ----- |
| Platform | Super Admin |
| Tenant | Admin, Compliance Officer, Compliance Manager, MLRO, Developer, Support |
| End User | Customer |

Navigation and actions must respect the role model defined in `mvp-roadmap.md`.

## Core User Flow

1. **Onboarding (Compliance Officer)** — Sign in → tenant context → overview dashboard
2. **Customer KYC** — Add customer → onboarding wizard (personal/business info, documents,
   identity review, consent) → verification status → compliance queue (pending/approved/rejected)
3. **Background checks** — Bank analysis, AML screening (sanctions, PEP, adverse media)
4. **Risk** — Configurable risk score and level drive approve/review/escalate decisions
5. **Transaction monitoring** — Ingested transactions → rules engine → alerts → cases
6. **Investigations** — Case workspace → evidence → AI-assisted SAR draft → regulatory report

## Application Areas (maps to Figma WebApp)

| Area | Figma section | Milestone | Proposed routes |
| ---- | ------------- | --------- | --------------- |
| Onboarding / Auth | ONBOARDING - COMPLIANCE OFFICER | M1 | `/sign-in`, `/register`, `/mfa`, … |
| Overview | OVERVIEW PAGE | M1 | `/overview` |
| KYC | KYC COMPLIANCE | M2 | `/kyc`, `/kyc/[id]`, `/customers`, … |
| KYB | KYB COMPLIANCE | M2 | `/kyb`, `/businesses`, … |
| Bank Analysis | BANK ANALYSIS | M2 | `/bank-analysis` |
| AML Screening | AML SCREENING | M2 | `/aml-screening` |
| Transaction Monitoring | Transaction Monitoring | M3 | `/transaction-monitoring`, `/transactions`, … |
| Compliance / SAR | Sidebar: SAR Report, PND Watchlist, Rules, Risk Score | M4 | `/sar`, `/cases`, … |
| Settings | SETTINGS | M1 | `/settings`, `/users`, `/roles`, `/api-keys` |

Detailed frame inventory: `context/feature-specs/00-design-inventory.md`

## Sidebar Navigation (from KYC frame)

Confirmed structure from Figma frame `886:70409`:

- **Overview**
- **CUSTOMER** — KYC, KYB
- **BACKGROUND CHECK** — Bank Analysis, Packages, Request
- **FRAUD MONITORING** — AML Screening
- **TRANSACTION MONITORING** — Overview, Transactions, TM Not-Blocked, Stop Payment,
  Cumulative Frequency, TM Blocked
- **COMPLIANCE** — SAR Report, PND Watchlist, Rules, Risk Score
- **CHECKER WIDGET**
- **BILLING**

App shell must implement this navigation hierarchy; individual routes are built per milestone.

## Features by Milestone

See `context/mvp-roadmap.md` for frontend scope. Summary:

| Milestone | Frontend focus |
| --------- | -------------- |
| **M1** | Design system, auth UI, app shell, tenant admin, overview |
| **M2** | KYC/KYB, onboarding wizard, compliance queue, bank analysis, AML |
| **M3** | Monitoring dashboard, alerts, transaction explorer, rules |
| **M4** | Case management, SAR editor, AI review, reports |
| **M5** | Performance, accessibility, production hardening |

## Success Criteria

1. Each milestone frontend checklist in `go-live-checklist.md` is satisfied before UAT
2. Figma screens render correctly with mock data (or live APIs when integrated)
3. RBAC gates navigation and actions per role
4. `progress-tracker.md` reflects current milestone and feature unit status

## Out of Scope

- **Landing Page** (Figma page `1:3`) — built in another repository
- **M3–M5 features** until the active milestone in `lib/constants/milestones.ts` reaches that milestone (currently **M2**)
- Backend implementation (separate repository / team)
- API integration until OpenAPI contracts are provided
