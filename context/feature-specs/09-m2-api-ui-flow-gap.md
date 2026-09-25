# M2 API ↔ UI flow gap analysis

**Milestone:** M2  
**Source:** Core Platform OpenAPI `https://unifycomply-api.rokxier.com/v1/docs-json` (audited 2026-09-11)  
**Policy:** Existing Figma UI stays. Missing Figma screens for an API-backed flow → **log + build the flow**. API shape that would force existing UI to change → **blocker**, do not reshape UI.

Read `AGENTS.md` and `.cursor/rules/ui-first-api-integration.mdc` before implementing.

---

## API-implied M2 happy path (KYC / KYB)

Backend models a **customer record → enrich → verify** pipeline. There is no separate “lookup” or “approve/reject” resource in OpenAPI today.

```
1. (Optional) Ensure tenant app exists     POST/GET /v1/tenants/apps
2. Create customer                        POST /v1/customers/kyc | /kyb
3. Upload / update documents              POST …/documents  (+ requirements GET)
4. Declare account purpose                PUT  …/account-purpose
5. (KYB) Add shareholders + their docs    POST …/shareholders[+ /documents]
6. Discover checks                        GET  /v1/verifications/available-checks
7. Start verification workflow            POST /v1/verifications/kyc | /kyb
8. Poll / open workflow                   GET  /v1/verifications[/{workflowId}]
9. Work flags on customer                 PATCH …/flags/{flagId}
10. Offboard (optional)                   DELETE …/{customerId}
```

**Not in OpenAPI (UI has these):** Perform Lookup (BVN/CAC instant check), bulk xlsx upload, Approve / Reject / Escalate / Request Resubmission as dedicated endpoints, standalone AML module, bank analysis, overview metrics, Packages/Request.

---

## Flow comparison

| # | API flow step | UI today | Gap |
| - | ------------- | -------- | --- |
| A | Create KYC customer (`POST /customers/kyc`) | Onboarding wizard collects personal + business + docs; **no API**; ends at `/kyc` | Wire wizard submit → create customer + docs; **business step on individual KYC** has no KYC DTO fields (only KYB) — **blocker / product decision** |
| B | Create KYB customer (`POST /customers/kyb`) | KYB **Validate Document** closes modal only; no wizard | **Missing screens** — build KYB intake flow from API (+ shareholders) |
| C | Documents + `…/documents/requirements` | Wizard upload / detail document tabs are mock | Wire upload + requirements checklist; keep Figma upload UI |
| D | Account purpose (`PUT …/account-purpose`) | **No UI** | **Done** — `/kyc/[id]/account-purpose` and KYB twin (`12-account-purpose-and-verification.md`) |
| E | KYB shareholders + shareholder docs | Detail **Shareholders** tab is read-only mock | Wire list; **missing create/edit UI** for API-required shareholder fields |
| F | `available-checks` + start verification | Lookup “App / ID type” is provider-ish mock; no start-workflow screen | **Done** — `/kyc/[id]/start-verification` and KYB twin; lookup UI unchanged |
| G | List/get customers + list/get workflows | KYC/KYB **list** = verification queue; **detail** = customers | **Done** — queue `GET /verifications/kyc|kyb` + stats; detail still customers |
| H | Flag status patch | Risk/AML panels mock; no flag state machine | Map into existing flag/alert UI; if API lacks approve/reject, **raise backend issue** |
| I | Tenant apps + keys | Lookup “App” dropdown is Staging/Production mock; Settings has a live App picker | **Done** for Settings (`15-settings-app-picker.md`); lookup still mock |
| J | Perform Lookup / bulk xlsx | Full KYC/KYB lookup UI | **API missing** — keep UI; backend issue for registry/ID lookup + bulk |
| K | Approve / Reject / Escalate / Resubmission | Detail footers + modals | **API missing** — keep UI; backend issue for decision endpoints |
| L | Bank analysis / AML / Packages / Request | Bank partial; AML/Packages/Request placeholder | **API missing** — keep placeholders / mock until contracts exist |
| M | `POST /tenants/onboarding` | Auth register ≠ tenant org onboarding | Different concept from customer wizard — do not conflate |

---

## UI journeys vs API coverage

### KYC (UI strong, API partial)

| UI journey | Routes | API coverage |
| ---------- | ------ | ------------ |
| Browse / review | `/kyc` → `/kyc/[id]?workflowId=` | Queue from `/verifications/kyc`; detail uses customer when possible + lazy documents/risk-score tabs; OCR/IP/liveness empty per guide |
| Perform Lookup | `/kyc/lookup` → result | **No** matching endpoints |
| Validate Document wizard | `/kyc/onboarding` | Maps loosely to create + documents; missing purpose; business fields belong on KYB |

### KYB

| UI journey | Routes | API coverage |
| ---------- | ------ | ------------ |
| Browse / review | `/kyb` → `/kyb/[id]?workflowId=` | Queue from `/verifications/kyb`; documents/risk/business-overview tabs live; directors/compliance still mock until wired |
| Perform Lookup | `/kyb/lookup` → result | **No** matching endpoints |
| Validate Document | modal only | **Missing flow** — should follow API create → docs → purpose → shareholders → verify |

### Verifications (API + queue list)

`/kyc` and `/kyb` officer tables are powered by `GET /v1/verifications/kyc|kyb` (one row per workflow). Detail routes remain customer-scoped.

### Apps (API + Settings picker)

Settings header App picker lists `GET /v1/tenants/apps` and scopes API keys / compliance configuration. Lookup **Select app** remains environment-flavoured mock.

---

## Backend blockers (do not change UI)

Log / escalate to Core Platform — keep Figma UI as-is:

1. **Identity / registry lookup** (BVN, NIN, CAC, TIN, RC) + **bulk xlsx** — UI exists, no OpenAPI.
2. **Compliance decisions** — Approve, Reject, Escalate, Request Resubmission — UI exists, no OpenAPI.
3. **Rich verification detail** — extracted OCR fields, biometric/liveness, IP & device, risk charts as designed — responses not documented in OpenAPI schemas (create DTOs only; read models opaque in docs-json).
4. **AML / bank analysis / packages / request / audit logs / overview** — UI planned or mocked; no M2 OpenAPI tags.

---

## Frontend build backlog (missing screens / wiring)

When Figma is missing, **build the flow** and note “API-derived / no Figma” in the feature spec:

| Priority | Item | Notes |
| -------- | ---- | ----- |
| P0 | Allow BFF proxy `customers/` + `verifications/` (+ keep `tenants/apps`) | **Done** — `app/api/v1/[...path]` |
| P0 | KYC onboarding → live create customer + documents | **Done** — gender/address fields added for DTO; business step UI-only |
| P0 | KYB Validate Document intake flow | **Done** — `/kyb/onboarding` (`10-kyb-business-onboarding.md`) |
| P1 | Account purpose step/panel (KYC + KYB) | **Done** — API-derived / no Figma |
| P1 | Start verification (check picker from `available-checks`) | **Done** — after intake; lookup unchanged |
| P1 | Wire KYC/KYB list + detail reads | **Done** — list = verification queue (2026-09-15); detail = customers; mock unsupported panels |
| P2 | Shareholder create/edit | **Done** — Add shareholder modal on KYB Shareholders tab (API-derived) |
| P2 | Tenant apps selector / settings | **Done** on Settings; lookup App dropdown still mock |
| P2 | Flag status actions | **Done** — `CustomerFlagsPanel` on Document tab (warning → investigating → revised); Approve/Reject/Escalate unchanged |
| P2 | Document requirements checklist | **Done** — `DocumentRequirementsChecklist` on KYC/KYB Document tabs |

---

## Related

- OpenAPI: https://unifycomply-api.rokxier.com/v1/docs  
- Specs: `03-kyc-compliance.md`, `04-kyb-compliance.md`, `05-customer-onboarding-wizard.md`  
- Tracker: `context/progress-tracker.md`
