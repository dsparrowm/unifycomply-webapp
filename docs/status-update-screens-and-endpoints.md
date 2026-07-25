# Unifycomply — Frontend Status Update

**Author:** Davies Aniefiok  
**Date:** 20 July 2026  
**Scope:** WebApp frontend (Next.js) — screens/modules completed and API usage  
**Live site:** [https://unifycomply-webapp-gfxl.vercel.app/](https://unifycomply-webapp-gfxl.vercel.app/)

---

## Summary

Milestone 1 (Foundation) is complete. Milestone 2 (KYC Orchestration) is in progress, with most KYC/KYB and bank analysis screens delivered. No live backend endpoints have been consumed yet — the UI runs on typed mock data until API contracts are provided.

You can view the deployed WebApp here: [https://unifycomply-webapp-gfxl.vercel.app/](https://unifycomply-webapp-gfxl.vercel.app/)

---

## Completed modules / screens

### Milestone 1 — Foundation (complete)

| Area | Screens / modules |
| ---- | ----------------- |
| Authentication | Sign-in, register, forgot/reset password, MFA, verify email, tenant selection |
| App shell | Sidebar, header, sandbox/production toggle, global search, RBAC nav gating |
| Dashboard | Overview dashboard |
| Tenant admin / Settings | Profile, business information, team management, roles & permissions, security, audit logs, approvals, PEP settings, notifications, compliance rules |
| Placeholders | Billing, API keys |

### Milestone 2 — KYC Orchestration (in progress)

| Area | Screens / modules | Routes |
| ---- | ----------------- | ------ |
| KYC list | Metrics, filters, search, table, pagination | `/kyc` |
| KYC detail | Document viewer, risk/biometric/timeline panels, AML tab, decision modals | `/kyc/[id]` |
| KYC Perform Lookup | Single + bulk lookup entry and result | `/kyc/lookup`, `/kyc/lookup/result` |
| Customer onboarding | Five-step wizard (personal → business → documents → review → consent) | `/kyc/onboarding` |
| KYB list | Metrics, filters, search, table, pagination | `/kyb` |
| KYB detail | Business Overview, Risk Score, Directors & Officers, Shareholders, Documents | `/kyb/[id]` |
| KYB Perform Lookup | Single + bulk lookup entry and result | `/kyb/lookup`, `/kyb/lookup/result` |
| Bank analysis | List with metrics, filters, New Lookup modal | `/bank-analysis` |
| Placeholders | AML Screening, Packages, Request | `/aml-screening`, `/packages`, `/request` |

---

## Outstanding (Milestone 2)

| Item | Status |
| ---- | ------ |
| AML Screening list UI | Not started |

---

## Endpoints consumed

**None.**

This repository is frontend-only. All screens use typed mock fixtures under `lib/data/`. No live backend APIs have been integrated. API wiring is deferred until OpenAPI contracts are provided.

---

## Milestone status overview

| Milestone | Status |
| --------- | ------ |
| M1 — Foundation | Complete |
| M2 — KYC Orchestration | In progress (active) |
| M3 — Transaction Monitoring | Not started (blocked) |
| M4 — SAR & Case Management | Not started (blocked) |
| M5 — Optimisation | Not started (blocked) |

---

*Prepared for internal status reporting.*
