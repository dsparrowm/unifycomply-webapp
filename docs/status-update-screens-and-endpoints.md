# Unifycomply — Frontend Status Update

**Author:** Davies Aniefiok  
**Date:** 26 September 2026
**Scope:** WebApp frontend (Next.js App Router + BFF) — screens completed and API usage  
**Live site:** [https://unifycomply-webapp.vercel.app/](https://unifycomply-webapp.vercel.app/)
**Upstream API:** [https://unifycomply-api.rokxier.com/v1/docs](https://unifycomply-api.rokxier.com/v1/docs)

---

## Summary

Milestone 1 (Foundation) is complete, including live auth and tenant settings.

Milestone 2 (KYC Orchestration) **Figma unique UI is closed** for KYC, KYB, AML, and Bank Analysis. Live Core Platform traffic powers auth, settings, KYC/KYB **create + list/detail + account purpose + start verification**, verification run history, flags, document requirements, customer offboarding, and KYB shareholder/document updates. Perform Lookup, AML standalone screens, bank analysis, and audit logs remain mocked because usable contracts are missing.

Milestone 3 (Transaction Monitoring) is **active and API-integrated**. Overview, queues, transaction explorer, account statement, case reads, transaction actions, SAR rationale submission, and rules CRUD/template adoption are wired through the BFF. M4 reporting surfaces remain out of scope.

The browser talks only to this app’s BFF (`/api/*`). JWTs stay in httpOnly cookies. Figma remains the UI contract — we map API payloads in the BFF / `lib/api` mappers and do not reshape screens to match DTOs.

You can view the deployed WebApp here: [https://unifycomply-webapp.vercel.app/](https://unifycomply-webapp.vercel.app/)

---

## Completed modules / screens

### Milestone 1 — Foundation (complete)

| Area | Screens / modules | Data |
| ---- | ----------------- | ---- |
| Authentication | Sign-in, register, forgot/reset password, MFA, verify email, Google callback, tenant / access switch | **Live** |
| App shell | Sidebar, header, sandbox/production toggle (domain switch), global search, RBAC nav gating | **Live** (toggle + session) |
| Dashboard | Overview dashboard | **Live** summary, high-risk count, activity, and API calls; wallet and most-used endpoint remain mock |
| Tenant admin / Settings | Profile, business information, team management, roles & permissions, security/MFA, approvals, PEP settings, notifications, compliance rules, API keys | **Live** |
| Settings | Audit logs | Mock (no OpenAPI route) |
| Placeholders | Billing | Placeholder |

### Milestone 2 — KYC Orchestration (Figma unique UI closed)

| Area | Screens / modules | Routes | Data |
| ---- | ----------------- | ------ | ---- |
| KYC list | Metrics, filters, search, table, pagination, Add Customer | `/kyc` | **Live** `GET /customers/kyc` |
| KYC detail | Document viewer, extracted fields, risk/biometric/timeline, AML/IP/liveness tabs, decision modals | `/kyc/[id]` | **Live** identity, documents, requirements, workflow history, risk score, AML tasks, and flags; OCR/IP/device/liveness detail and decisions remain unavailable or UI-only |
| KYC account purpose | Purpose / source of funds (API-derived; no Figma) | `/kyc/[id]/account-purpose` | **Live** |
| KYC start verification | Check picker from `available-checks` (API-derived; no Figma) | `/kyc/[id]/start-verification` | **Live** |
| KYC Perform Lookup | Single + bulk entry and result | `/kyc/lookup`, `/kyc/lookup/result` | Mock (no lookup API) |
| Customer onboarding | Five-step wizard → create customer + documents → account purpose | `/kyc/onboarding` | **Live** create |
| KYB list | Business queue + Bulk Search batch-file table | `/kyb` | **Live** businesses; batches mock |
| KYB detail | Business Overview, risk, directors, shareholders, documents, compliance checks, decision modals | `/kyb/[id]` | **Live** identity, documents, requirements, workflow history, shareholders, document metadata, and flags; directors/compliance depend on returned task data |
| KYB account purpose / start verification | Same API-derived pair as KYC | `/kyb/[id]/account-purpose`, `/kyb/[id]/start-verification` | **Live** |
| KYB onboarding | Validate Document intake (API-derived; no Figma) | `/kyb/onboarding` | **Live** create |
| KYB Perform Lookup | Single + bulk entry and result | `/kyb/lookup`, `/kyb/lookup/result` | Mock |
| KYB Batch Lookup | Batch result (frame 137) | `/kyb/batch/[id]` | Mock |
| AML Screening | List, lookup, Search Result, Batch Lookup, case detail, escalate modal | `/aml-screening`, `/aml-screening/lookup`, `/aml-screening/lookup/result`, `/aml-screening/batch/[id]`, `/aml-screening/[id]` | Mock (no AML OpenAPI) |
| Bank analysis | List (frames 11/16), Single Lookup + Bulk Analysis, Batch Lookup, five-tab detail, escalate | `/bank-analysis`, `/bank-analysis/lookup`, `/bank-analysis/batch/[id]`, `/bank-analysis/[id]` | Mock (no bank OpenAPI) |
| Placeholders | Packages, Request | `/packages`, `/request` | No Figma section frames |

### Milestone 3 — Transaction Monitoring (active, live-integrated)

Figma-aligned screens are implemented and connected to the authenticated Core Platform contract. Staging response shapes were verified on 25 September 2026. Queue data was empty for the tested tenant, so no mutating staging actions were submitted during QA.

| Area | Routes |
| ---- | ------ |
| TM Overview, Transactions list/detail, Account Statement, SAR rationale | `/transaction-monitoring`, `/transactions`, `/transactions/[id]`, `…/account-statement`, `…/sar-rationale` |
| Queues | `/tm-not-blocked`, `/stop-payment`, `/cumulative-frequency`, `/tm-blocked` |
| Rules + Adopt Template | `/rules`, `/rules/[id]` |

| Live M3 API surface | Endpoints |
| -------------------- | --------- |
| Overview | `GET /v1/transaction-monitoring/overview` |
| Queues | `GET /v1/transaction-monitoring/tm-not-blocked`, `/stop-payment`, `/cumulative-frequency`, `/tm-blocked` |
| Transactions | `GET /v1/transactions`, `GET /v1/transactions/{id}`, `GET /v1/transactions/{id}/detail` |
| Statement and case | `GET /v1/customers/{id}/statement`, `GET /v1/transactions/{id}/case` |
| Actions | `POST /v1/transactions/{id}/actions/resolve-case`, `/escalate-case`, `/place-pnd`, `/sar-rationale` |
| Rules | `GET/POST/PATCH/DELETE /v1/tenants/apps/{appId}/transaction-monitoring/rules` |
| Templates | `GET .../rule-templates`, `POST .../rule-templates/{templateId}/adopt` |

---

## Outstanding

| Item | Owner | Status |
| ---- | ----- | ------ |
| KYB shareholder create/edit | Frontend | **Done** (API-derived; valid staging customer data still needed for mutation QA) |
| Document requirements checklist | Frontend | **Done** (`GET …/documents/requirements`) |
| Verification run history on the case | Frontend | **Done** (`GET /verifications/{workflowId}`) |
| Flag status on existing alert UI | Frontend | **Done** (`PATCH …/flags/{flagId}`) |
| Tenant apps on the existing App dropdown | Frontend | **Done** (`GET /tenants/apps`) |
| Customer offboarding | Frontend | **Done** (`DELETE /customers/kyc|kyb/{id}`; soft lifecycle transition) |
| KYB document metadata editing | Frontend | **Done** (`PUT /customers/kyb/{id}/documents/{documentId}`) |
| Webhook delivery history and redelivery | Frontend | **Done** (app-scoped delivery list and redelivery) |
| Perform Lookup + bulk xlsx | Backend | UI done; **no OpenAPI** |
| Approve / Reject / Escalate / Resubmit | Backend | UI done; **no OpenAPI** (or confirm flags are the only decision API) |
| Rich OCR / liveness / IP / AML read models | Backend | OCR remains pending; IP/device and dedicated liveness return unavailable; AML task read is live |
| PND Watchlist + SAR Reports | Backend / M4 | API routes exist upstream but are not enabled in the frontend BFF or M4 UI |
| AML + bank analysis + audit logs | Backend | UI done or mocked; **no usable OpenAPI contract** |
| Packages / Request / Pre-KYC screens | Design | Sidebar labels only; no section frames |
| KYC wizard Business step vs `POST /customers/kyc` | Product | UI collects it; DTO has no business fields |
| Officer queue = customers vs workflows | Product | List is customers today |
| Maker–checker, ongoing refresh | Design + product | Not in M2 Figma |

---

## Endpoints consumed (via BFF)

Browser → `/api/*` → Core Platform `https://unifycomply-api.rokxier.com`.

### Auth (live)

| BFF / upstream | Used by |
| -------------- | ------- |
| `POST /v1/auth/sign-in`, `/sign-up`, `/refresh` | Sign-in / register |
| `POST /v1/auth/mfa/validate`, `/mfa/status`, `/mfa/setup`, `/mfa/enable`, `/mfa/disable` | MFA |
| `POST /v1/auth/access/switch`, `GET /v1/auth/access`, `GET /v1/auth/user` | Tenant / session |
| `POST /v1/auth/forgot-password`, `/forgot-password/complete` | Reset password |
| `POST /v1/auth/email/verify`, `/email/verify/complete` | Verify email |
| `PUT /v1/auth/password` | Change password |

### Tenant settings (live)

| Upstream | Used by |
| -------- | ------- |
| `GET/PUT /v1/users/me/profiles` | Settings → Profile |
| `GET/PUT /v1/tenants/settings/business-information` | Business information |
| `GET /v1/public/misc/business-industries`, `/employee-counts` | Settings dropdowns |
| `GET/POST /v1/tenants/settings/teams`, resend / revoke | Teams |
| `GET/POST /v1/tenants/settings/roles-permissions` (+ options, update, delete) | Roles |
| `GET/POST /v1/tenants/apps` | Settings App picker |
| `GET /v1/tenants/apps/{appId}/api-key`, `POST …/rotate` | API keys (per app) |
| `GET/PUT /v1/tenants/apps/{appId}/…` risk-factor, risk-score-threshold, pep-tier, notification-preferences, compliance-rules | Approvals / PEP / notifications / rules (per app) |
| `POST /v1/tenants/settings/domain/switch` | Sandbox / Production toggle |

### KYC / KYB / verifications (live)

| Upstream | Used by |
| -------- | ------- |
| `GET/POST /v1/customers/kyc` | KYC list, onboarding create |
| `GET /v1/customers/kyc/{id}` | KYC detail |
| `GET/POST/PUT /v1/customers/kyc/{id}/documents` | Detail + wizard upload; KYC metadata PUT is available for future UI parity |
| `GET/PUT /v1/customers/kyc/{id}/account-purpose` | Account purpose (404 = not declared) |
| `GET/POST /v1/customers/kyb` | KYB list, onboarding create |
| `GET /v1/customers/kyb/{id}` | KYB detail |
| `GET/POST/PUT /v1/customers/kyb/{id}/documents` | Detail + wizard upload + metadata editing |
| `GET/POST/PUT /v1/customers/kyb/{id}/shareholders` | KYB Shareholders tab and API-derived create/edit |
| `PATCH /v1/customers/kyc|kyb/{id}/flags/{flagId}` | Existing alert status workflow |
| `DELETE /v1/customers/kyc|kyb/{id}` | Customer offboarding |
| `GET/PUT /v1/customers/kyb/{id}/account-purpose` | KYB account purpose |
| `GET /v1/verifications/available-checks` | Start verification picker |
| `POST /v1/verifications/kyc`, `/v1/verifications/kyb` | Start verification |
| `GET /v1/verifications/{workflowId}` | Verification run history, tasks, risk, and audit events |

### Still mock or unavailable

Lookup/bulk, standalone AML, bank analysis, audit logs, Packages/Request, PND Watchlist, SAR Reports, OCR extraction, IP/device capture, dedicated liveness results, and decision actions.

---

## Milestone status overview

| Milestone | Status |
| --------- | ------ |
| M1 — Foundation | **Complete** (auth + settings live) |
| M2 — KYC Orchestration | **Complete for current frontend scope** — Figma unique UI closed; live KYC/KYB reads/writes as above |
| M3 — Transaction Monitoring | **Active and live-integrated** — UI complete; authenticated API reads/writes wired |
| M4 — SAR & Case Management | Not started — PND Watchlist and SAR Reports deferred |
| M5 — Optimisation | Not started (blocked) |

---

*Prepared for internal status reporting.*
