# Unifycomply — M2 backend asks (frontend)

**From:** Davies Aniefiok (WebApp frontend)  
**To:** Core Platform / backend  
**Date:** 13 September 2026  
**OpenAPI:** https://unifycomply-api.rokxier.com/v1/docs  
**Staging API:** `https://unifycomply-api.rokxier.com`

---

## Why this note

M2 Figma unique UI is **built** (KYC, KYB, AML, Bank Analysis). Live traffic already powers auth, tenant settings, and KYC/KYB **create + list/detail + account purpose + start verification**.

The WebApp UI is the product contract. We map payloads in the BFF. We will **not** drop fields, tabs, or decision modals because OpenAPI is flatter. If a designed screen cannot be powered without changing it, we need a **backend change** (or a documented equivalent), not a UI redesign.

This list is only what **blocks wiring the remaining M2 screens to live data**.

---

## Already wired (do not break)

Browser → WebApp BFF `/api/*` → Core Platform. JWTs stay in httpOnly cookies.

| Area | Upstream |
| ---- | -------- |
| Auth / MFA / access switch | `/v1/auth/*` |
| Tenant settings | `/v1/users/me/profiles`, `/v1/tenants/settings/*` (business, teams, roles, domain) |
| App-scoped settings | `/v1/tenants/apps` + `/v1/tenants/apps/{appId}/api-key`, risk, PEP, notifications, compliance-rules |
| KYC create + list + detail + documents | `GET/POST /v1/customers/kyc`, `GET/POST …/{id}/documents` |
| KYB create + list + detail + documents + shareholders **read** | `GET/POST /v1/customers/kyb`, documents, `GET …/shareholders` |
| Account purpose | `GET/PUT …/account-purpose` (404 = not declared — we treat that as empty form) |
| Start verification | `GET /v1/verifications/available-checks`, `POST /v1/verifications/kyc`, `POST /v1/verifications/kyb` |

List envelope we handle: `{ data: [], meta: { totalItems, totalPages, … } }`. Status map we use: `pending` → Pending, `onboarded` → Approved, `review` → In Review, `blocked` / `offboarded` → Rejected.

---

## P0 — UI exists, no OpenAPI (or no usable contract)

These screens are in production UI. Officers can click them. They currently no-op or stay on mocks.

### 1. Perform Lookup + bulk upload

**UI:** `/kyc/lookup`, `/kyb/lookup`, result pages, bulk xlsx.

**Need:** Documented endpoints (or confirm they will never exist).

| Check | UI today |
| ----- | -------- |
| KYC | BVN, NIN, passport, etc. — single + bulk |
| KYB | CAC / TIN / RC — single + bulk |

Please return enough to fill the existing result layout: identity fields, match/validation rows, risk score (0–4), AML-style summary. Do **not** ask us to collapse lookup into “start verification” — that is a different designed flow.

If lookup is meant to be `POST /verifications/kyc` only, say so in OpenAPI and document the **synchronous result body** the result screen needs. Today start-verification is fire-and-forget / workflow id, which cannot fill Perform Lookup.

### 2. Officer decisions on the case

**UI:** KYC/KYB detail footer — Approve, Reject, Escalate, Request Resubmission (modals already built).

**Need one of:**

- Dedicated endpoints that match those four actions, **or**
- Written confirmation that **`PATCH /v1/customers/{kyc\|kyb}/{id}/flags/{flagId}` is the only decision API**, plus a documented flag state machine we can map onto those four buttons **without removing any button**.

“Just hide Escalate until later” is not acceptable — the Figma footer stays.

### 3. Detail-tab read models

**UI tabs still mocked:** risk analysis, AML screening, IP & device, liveness / biometrics, KYB directors, KYB compliance checks, OCR extracted fields beyond name/address.

**Need:** Stable JSON (OpenAPI schemas, not “object”) for:

- OCR / extracted document fields + confidence
- Liveness / selfie match outcome
- IP / device fingerprint
- Risk breakdown that can populate the existing 0–4 score + factor list
- AML / PEP / sanctions hits for the **customer case** (this is not the standalone AML module)

List rows also need **document type** and **assignee** if those columns stay live. Today list customers have neither, so we show **—** and **Unassigned**.

### 4. Create / start-verification contracts to freeze

Please confirm and document:

- **201 body** for `POST /customers/kyc` and `/kyb` — we accept `id` or `customerId`; we need a guaranteed field.
- **201 body** for `POST /verifications/kyc|kyb` — `workflowId` / `id` so we can poll `GET /verifications/{workflowId}`.
- Whether **`x-app-id`** is required on start-verification; we can forward it once apps are listed.

---

## P1 — APIs exist; we need behaviour / docs

| Topic | What we need |
| ----- | ------------ |
| **KYC wizard Business step** | UI still collects company fields. `CreateTenantKycDto` has none. Dual-create a KYB, extra KYC fields, or a documented “ignore” — product + backend decision. |
| **Queue model** | Officer list is **customers**, not workflows. If review work lives on `/v1/verifications`, we need a way to show workflow status **on the customer row** without a new queue screen. |
| **Document requirements** | `GET …/documents/requirements` — confirm path + schema so we can render a checklist without changing the upload UI. |
| **Shareholder write** | `POST/PATCH …/shareholders` (+ docs). Read is wired; create/edit UI is next on frontend once the write contract is stable. |
| **Flags** | `PATCH …/flags/{flagId}` — allowed statuses, who can transition, how they relate to Approve/Reject/Escalate. |
| **Tenant apps** | Settings App picker is live (`GET/POST /v1/tenants/apps`). Lookup **Select app** is still sandbox/production labels — wire that dropdown next. |
| **Google OAuth** | Upstream `redirect_uri` must match the deployed WebApp callback (`/auth/google/callback`). |

---

## P2 — no OpenAPI yet (UI mocked; needed before those modules go live)

Not asking you to build TM (M3) in this milestone. For **M2 completeness**:

| Module | UI status | Ask |
| ------ | --------- | --- |
| AML Screening | Full Figma UI on mocks | Customer/entity screening APIs + case read model |
| Bank analysis | Full Figma UI on mocks | Account/bank check APIs + run/batch read model |
| Overview dashboard | Mock charts | Metrics that match existing cards (or say “keep mock”) |
| Audit logs | Settings screen mock | List/filter/export route |
| Packages / Request / Pre-KYC | Placeholder routes | Confirm if these are backend products or design-only for now |

---

## How to reply (most useful)

For each P0 item, a short answer is enough:

1. **Endpoint(s)** (or “will not exist — use X instead”)
2. **Example JSON** for the designed screen
3. **Error cases** the officer already sees in UI (no match, provider down, already decided)

Please add **read models** to OpenAPI (`docs-json`), not only create DTOs.

---

## Out of scope for this ask

- Redesigning KYC/KYB list or detail to match current DTOs
- Folding Perform Lookup into start-verification without a new lookup contract
- A new `/compliance-queue` route (Figma uses list status filters)
- M3 Transaction Monitoring / M4 SAR APIs

---

*Prepared for Core Platform. Companion design brief already sent separately.*
