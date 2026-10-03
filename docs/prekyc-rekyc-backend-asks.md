# Pre-KYC and Re-KYC — contract gaps

**From:** UnifyComply WebApp  
**To:** Core Platform  
**Date:** 2 October 2026  
**Behaviour source:** Frontend Integration Guide, 1 October 2026, §8.1–§8.5 and §13.4 (the guide marks §13.4 PARTIAL)  
**Checked live (read only, 2 October 2026):** `https://unifycomply-api.rokxier.com` on the Default sandbox app  
**Schema:** `GET /v1/docs-json` still publishes no response bodies for these routes

The WebApp stays the officer product. This note does not ask the API to match the test console. It asks for the re-KYC behaviour the guide already describes to be visible on a real tenant, and for that behaviour to be in the published schema.

---

## What the guide says re-KYC is

Re-KYC is not a separate resource. A customer who is already verified is sent back to `in-review` when one of nine app triggers fires. The officer then uses the same approve (back to `onboarded`, clock resets) or reject (to `blocked`).

| Kind | Guide | What disabling does |
| ---- | ----- | ------------------- |
| `pep-sanctions` | live | Stops a new AML match flipping a verified customer to `in-review`. The match is still recorded. |
| `transaction-monitoring-escalation` | live | Stops a monitoring alert flipping the workflow. |
| `basic-kyc` | live | Skips the periodic re-screen. Period is the app's `kycExpiryDays` / `kybExpiryDays`. |
| `expired-id`, `proof-of-address` | live | Stops an expired ID or proof-of-address document flipping the workflow. |
| `suspected-ato` | live | Stops two or more of email, phone, and address changing within 72 hours on an onboarded customer from flipping the workflow. |
| `high-risk-jurisdiction`, `forged-id`, `immigration-check` | no-op | Nothing evaluates these. The toggle changes nothing. |

The catalogue is fixed: enable, disable, or tune `config`. No create or delete. Every escalation is supposed to write a verification audit event whose `detail.trigger` is the kind and whose `detail.reason` is the sentence to show as "why is this in review". That escalation is not webhooked (`workflow.verified` and `workflow.failed` only). The client has to poll.

The clock and the account-takeover stamps are on the customer, not on the trigger row. The guide's captured onboarded customer has `lastReviewedAt` and `nextReviewAt` (one year later, from `kycExpiryDays`). Create and list rows include `nextReviewAt`, `lastReviewedAt`, `emailChangedAt`, `phoneChangedAt`, `addressChangedAt`, and `statusReasons`. The create example itself has `nextReviewAt: null`; the onboarded read is where the date appears. §8.1's sentence that a new pending customer already has `nextReviewAt` set does not match that captured create body.

---

## Verdict

The trigger list and the customer clock fields are implemented. The flip back to review is not demonstrated on this tenant, and the published schema does not describe either.

Live `GET /v1/tenants/apps/{appId}/re-kyc/trigger-rules` on Default returned all nine kinds, every one `active`, every `config` an empty object. There is no `evaluated` flag, so the three no-ops look the same as the six live kinds.

Live `GET /v1/customers/kyc` returns `nextReviewAt`, `lastReviewedAt`, `emailChangedAt`, `phoneChangedAt`, `addressChangedAt`, and `statusReasons` on each row. On Default today: **0 onboarded**, **135 review**. The review rows we read have `lastReviewedAt` set and `nextReviewAt: null`, `statusReasons: []`. The periodic clock and the 72-hour account-takeover rule both require an onboarded customer, and this app has none.

Live `GET /v1/verifications/{workflowId}` returns an `events` array. Eight workflows on this app (including `in-review` ones) had events and **none** carried `detail.trigger` or `detail.reason`. The guide's captured `transaction.monitoring.alert` event is from the docs demo tenant, not from this one.

Swagger still has no response schema for these reads, so `nextReviewAt` and `detail.reason` are invisible to anyone who trusts `/v1/docs` alone.

### Probe on Default, 2 October 2026

We created sandbox individual `Rekyc Probe` (`3d6c46ec343647bc8bd9a4f7eb317d4f`), uploaded a passport, selfie, and utility bill, declared account purpose, and started passport, selfie, and address checks. The run completed with outcome `error` and the customer moved to `review`. `POST …/approve` then returned `onboarded`.

`kycExpiryDays` on this app is 720. After approve, `lastReviewedAt` is set and `nextReviewAt` is still `null`. The periodic clock did not start.

Changing email and phone on that onboarded customer did fire re-KYC. Workflow `81fd3f791c574d6f9b43769c33184f62` gained:

`ato.suspected` — `verified` → `in-review` — `detail.trigger` `suspected-ato` — reason naming the two changed fields and the 72-hour rule.

The customer row stayed `onboarded`. `lifecycle` has no re-KYC step. `statusReasons` still holds the approve sentence, not the takeover reason. A roster filtered by `status=review` does not show this refresh. The flip is only on the verification workflow.

Every `200` and `201` in the file has an empty description and **no response schema** (360 responses, 0 with content). Request DTOs exist for some writes. Reads are undocumented. If a field is returned at runtime and is not in this spec, it is not a contract we can build on. Please publish the response schemas, or add the fields below.

---

## What the spec does define

| Step | Operation | What the contract actually says |
| ---- | --------- | ------------------------------- |
| Create person | `POST /v1/customers/kyc` | `CreateTenantKycDto`: name, email, country, dob, address, gender, phone. No company fields. |
| Create business | `POST /v1/customers/kyb` | `CreateTenantKybDto`: business name, registration date, contacts, address. |
| Documents | `POST/PUT …/documents` | `expiryDate` is writable. `GET …/documents/requirements` says which categories are satisfied. Response shape unpublished. |
| Purpose | `GET/PUT …/account-purpose` | `DeclareAccountPurposeDto`. Not referenced by start-verification. |
| Start checks | `POST /v1/verifications/kyc` and `…/kyb` | `customerId` + `verificationTypes` only. |
| Decide | `POST …/approve`, `POST …/reject` | Approve: “moving them out of review”. Reject: “blocking them”. Reason on reject is required. |
| Offboard | `DELETE …/{customerId}` | Separate from reject. Body is a reason. |
| Clock policy | `GET/PUT …/compliance-rules` | `kycExpiryDays` / `kybExpiryDays` (example 365), required docs, `flaggedCountryCodes`. |
| Trigger switch | `GET/PATCH …/re-kyc/trigger-rules` | Nine kinds. Body is `{ status: active\|inactive, config: object }`. |

Customer list filters are `page`, `limit`, `status` (`pending` \| `onboarded` \| `review` \| `blocked` \| `offboarded`), `search`, `dateFrom`, `dateTo`, `monitoringEnabled`.

Verification list filters are `status` (`not-started` \| `processing` \| `in-review` \| `verified` \| `failed`), `profileType`, `priority`, `verificationType`, dates, `search`. There is no `customerId`.

`GET /v1/verifications/{workflowId}` is summarised as “with its task-level reasons”. The reasons are not schematised.

---

## Gaps in the spec

### 1. The clock is on the customer, and this tenant never starts it

`nextReviewAt` and `lastReviewedAt` are returned by the live customer list and detail. They are not in the OpenAPI schema. There is still no `dueForRefresh` query. List filters remain `status`, `search`, `dateFrom`, `dateTo`.

On Default, every review row we read has `nextReviewAt: null`. The guide's own onboarded example is the only place the date is a real timestamp (`lastReviewedAt` plus `kycExpiryDays`). With zero onboarded customers, `basic-kyc` has nobody to re-screen.

**Need:**

- Publish `nextReviewAt`, `lastReviewedAt`, and the three `*ChangedAt` stamps on the customer response schema.
- Say whether `nextReviewAt` is set at create or only at approve. The guide's prose and its captured create body disagree; the live app matches the captured body (`null` until someone is onboarded).
- Say that disabling `basic-kyc` stops the automatic return to review, and that `nextReviewAt` is still that date.
- Either add `dueForRefresh=true`, or confirm the client may treat `status=onboarded` and `nextReviewAt <= now` as the due book. We will not invent the date from `createdAt + kycExpiryDays`.

### 2. A second run is not a refresh

`StartKycVerificationDto` / `StartKybVerificationDto` have no `cycle`, `trigger`, or `reason`. The same POST is the first check and every later check. Nothing restricts it to `onboarded` customers. Nothing records why the run exists.

`GET /v1/verifications` cannot be filtered by `customerId`, so an officer cannot list one person’s runs from the contract.

**Need:**

- `customerId` on `GET /v1/verifications`, `GET /v1/verifications/kyc`, and `GET /v1/verifications/kyb`
- On the workflow: `cycle: "initial" | "refresh"`, `trigger` (one of the nine kinds, or `manual`), and `reason` (the sentence that explains why it is in review)
- Documented precondition: a refresh is accepted only when the customer is `onboarded`. Any other status returns 4xx. The first run stays `cycle: "initial"`.

### 3. The nine triggers have no behaviour in the contract

The kind enum is:

`high-risk-jurisdiction`, `pep-sanctions`, `transaction-monitoring-escalation`, `basic-kyc`, `expired-id`, `forged-id`, `immigration-check`, `proof-of-address`, `suspected-ato`.

`GET` returns an empty 200. `PATCH` accepts `status` and an empty `config`. The spec does not say:

- which kinds are evaluated
- what `config` is for each kind
- what happens to the customer and which workflow is opened
- what is still recorded when `status` is `inactive`

The console copy marks `high-risk-jurisdiction`, `forged-id`, and `immigration-check` as not evaluated, and says an inactive trigger still records a finding. **None of that is in OpenAPI.** Please put it in the contract. Kinds that do nothing should not be returnable as `active`.

**Need a response schema** for each rule: `kind`, `status`, `evaluated` (boolean), `config`, and a short `effect`. Per-kind `config` at least:

| Kind | Config the officer must be able to read |
| ---- | ---------------------------------------- |
| `basic-kyc` | The period, or an explicit reference to `kycExpiryDays` / `kybExpiryDays` |
| `expired-id`, `proof-of-address` | How many days before `expiryDate` the case returns |
| `suspected-ato` | Window, which fields, how many changes |
| `pep-sanctions` | Whether a match is still stored when the trigger is `inactive` |
| `transaction-monitoring-escalation` | Which TM outcome opens the case |

Document the side effect in one place: customer moves to `review`, a verification is created with `cycle: "refresh"` and `trigger` set, and the reason string is on that workflow.

### 4. Expired documents and changed identity are stub types

These schemas exist and are referenced by **no operation**. Each has `properties: {}`:

- `CustomerDocumentExpiredDto`
- `CustomerSensitiveFieldsChangedDto`
- `VerificationRunResultDto`
- `RiskAssessmentResultDto`

`expiryDate` can be written on a document. Nothing lists documents expiring before a date, and nothing ties `expiryDate` to `expired-id` or `proof-of-address`.

`PUT /v1/customers/kyc/{customerId}` is a full replace of `CreateTenantKycDto` (every field required). The spec does not say a change of email, phone, or address emits `suspected-ato`. There is no partial update.

**Need:** either wire those event DTOs to a readable customer or verification event list, with real properties, or remove them. And state whether `PUT` of email, phone, or address on an `onboarded` customer is what `suspected-ato` counts.

### 5. Two status worlds, no mapping

Customer lifecycle: `pending`, `onboarded`, `review`, `blocked`, `offboarded`.  
Workflow: `not-started`, `processing`, `in-review`, `verified`, `failed`.

The spec never says how one follows the other. Approve is described only as “moving them out of review”. It does not say what approve does when the latest run is `processing` or the run outcome is an error, or whether a second approve resets `reviewDueAt`.

Reject “blocking them” is a terminal block. There is no resubmission operation anywhere in the file (`resubmit` / `resubmission`: 0 hits). An officer cannot send the file back for a new document without blocking the customer.

**Need:**

- A status matrix: which workflow outcomes set `pending`, `review`, `onboarded`, `blocked`
- Approve preconditions, and confirmation that a later approve on an already onboarded customer resets `reviewDueAt` and does not create a second customer
- `POST …/{customerId}/request-resubmission` with `{ reason }`, which keeps the customer out of `blocked` and out of `offboarded`

### 6. Purpose, country block, and jurisdiction are three unlinked controls

`DeclareAccountPurposeDto` is not a required input of `POST /v1/verifications/kyc`. The spec allows a run with no purpose on file.

`flaggedCountryCodes` sits on compliance rules. `high-risk-jurisdiction` sits on the trigger enum. Risk-factor weights are a third API (`PUT …/risk-factor-configurations/{slug}`, body `{ riskWeight }`, slug not enumerated). Nothing says which of these refuses onboarding, which only raises the score, and which returns an onboarded customer to review.

**Need:** the precondition for starting a run (purpose required or not, and the 4xx when it is missing), and one paragraph that separates country hard-block, geographic risk weight, and the `high-risk-jurisdiction` trigger.

### 7. No extraction

`ocr` and `extracted` do not appear. `GET …/kyc/{workflowId}/documents` is summarised as signed URLs, risk score, and a verification timeline. The timeline item shape is not in the spec. There is no audit resource (`audit`: 0 hits).

**Need:** on the workflow, or on a customer event list, each entry has `at`, `action`, `actor`, `trigger`, and `reason`. Task-level reasons on `GET /v1/verifications/{workflowId}` need a schema: code, severity, check type, provider, blocking or not.

---

## What we are not asking

- A `/pre-kyc` or `/re-kyc` resource. The officer desk is still `/customers/kyc` and `/customers/kyb`, plus the verifications they already have.
- A new customer on refresh. Refresh is another `POST /v1/verifications/{kyc|kyb}` on the same `customerId`, marked `cycle: "refresh"`.
- To collapse reject and offboard. Those stay separate.
- Console wording copied into the API. Where the console and this spec disagree (which triggers evaluate, what an inactive trigger still records), the spec has to say which is true.

---

## Smallest publish that unblocks the desk

1. Response schemas for customer list/detail, verification list/detail, and trigger-rule list.  
2. `onboardedAt`, `reviewDueAt`, and `dueForRefresh` on customers.  
3. `customerId`, `cycle`, `trigger`, and `reason` on verifications, and the onboarded-only rule for a refresh.  
4. `evaluated` plus a real `config` per trigger kind, and the status transition when one fires.  
5. Resubmission as its own POST, distinct from reject and delete.
