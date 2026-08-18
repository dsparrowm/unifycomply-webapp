# Unifycomply — Frontend Status Update

**Author:** Davies Aniefiok  
**Date:** 12 August 2026  
**Scope:** WebApp frontend (Next.js) — screens/modules completed and API usage  
**Live site:** https://unifycomply-webapp-gfxl.vercel.app/  
## Summary

M1 is done. M2 frontend work for the WebApp designs we have is also done — KYC, KYB, bank analysis, and AML screening are built and running on mock data.

Login and tenant settings talk to the real API through our BFF. The compliance screens stay on mocks until those contracts land.

What’s changed since the last update (20 July): AML is no longer a placeholder, bank analysis now covers batch lookup and escalation, and auth/settings are live.

We’re still gated on M2 (`CURRENT_MILESTONE = 2`). M3 doesn’t start until QA/UAT signs off.

## Completed modules / screens

### Milestone 1 — Foundation (complete)

| Area | Screens / modules |
| ---- | ----------------- |
| Authentication | Sign-in, register, forgot/reset password, MFA, verify email, tenant selection, Google OAuth callback (live BFF) |
| App shell | Sidebar, header, sandbox/production toggle, global search, RBAC nav gating |
| Dashboard | Overview dashboard |
| Tenant admin / Settings | Profile, business information, team management, roles & permissions, security, audit logs, approvals, PEP settings, notifications, compliance rules |
| Placeholders | Billing, API keys |

### Milestone 2 — KYC Orchestration (complete)

| Area | Screens / modules | Routes |
| ---- | ----------------- | ------ |
| KYC list | Metrics, filters, search, table, pagination, choose-action modal | `/kyc` |
| KYC detail | Document viewer, risk/biometric/timeline panels, AML tab, decision modals (0–4 risk variants) | `/kyc/[id]` |
| KYC Perform Lookup | Single + bulk lookup entry and result | `/kyc/lookup`, `/kyc/lookup/result` |
| Customer onboarding | Five-step wizard (personal → business → documents → review → consent) | `/kyc/onboarding` |
| KYB list | Metrics, Batch search filters, Verified/Failed statuses, Assigned To, risk colouring | `/kyb` |
| KYB detail | Business Overview, Risk Score Analysis, Directors & Officers, Shareholders, Documents, Compliance Checks (cleared + high-risk OFAC expand), escalate footer | `/kyb/[id]` |
| KYB Perform Lookup | Single + bulk lookup entry and result, Confirm Approval modal | `/kyb/lookup`, `/kyb/lookup/result` |
| Bank analysis | List, Single/Batch lookup, batch results, detail tabs, decision history, Senior Officer escalation | `/bank-analysis`, `/bank-analysis/lookup`, `/bank-analysis/batch`, `/bank-analysis/[id]` |
| AML Screening | List, Create Case, Search Results, Single/Batch lookup, detail chrome, escalation, decision history | `/aml-screening`, `/aml-screening/create-case`, `/aml-screening/search-results`, `/aml-screening/lookup`, `/aml-screening/batch`, `/aml-screening/[id]` |
| Placeholders | Packages, Request (no dedicated WebApp frames) | `/packages`, `/request` |

## Approved deferrals (Milestone 2 exit)

| Item | Reason |
| ---- | ------ |
| KYB Validate Document / business onboarding wizard | No dedicated WebApp Figma frames |
| Packages / Request full screens | Nav labels only — no section designs |
| Duplicate sandbox/production visual frames | Shared environment toggle; no separate implementations required |


## Endpoints consumed

**Hybrid data model**

- **Live (Next.js BFF → Core Platform):** authentication, MFA, tenant settings / domain switch, and related settings reads/mutations where OpenAPI exists.
- **Mock fixtures (`lib/data/`):** KYC, KYB, AML Screening, Bank Analysis, Overview charts, audit logs.

Compliance module APIs remain deferred until OpenAPI contracts are provided.


## Milestone status overview

| Milestone | Status |
| --------- | ------ |
| M1 — Foundation | Complete |
| M2 — KYC Orchestration | **Complete** (active gate remains M2 until QA/UAT) |
| M3 — Transaction Monitoring | Not started (blocked) |
| M4 — SAR & Case Management | Not started (blocked) |
| M5 — Optimisation | Not started (blocked) |

---

Internal status note — supersedes the 20 July update.
