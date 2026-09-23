# Feature Spec: Pre-KYC / Re-KYC tenant flow (plan)

**Milestone:** M2  
**Figma section:** None labelled Pre-KYC or Re-KYC — **plan for missing screens**  
**Status:** Plan only (not implemented)  
**Audience:** **Tenant** WebApp (Admin, Compliance Officer, Compliance Manager, MLRO, Support).  
Not platform Super Admin. Not the Landing Page.

Read `AGENTS.md`, `09-m2-api-ui-flow-gap.md`, and `ui-first-api-integration.mdc` before building.

## Why this plan exists

Design is right that the **CDD product is incomplete**. Figma shipped a **review desk** (queue → case → decide). A tenant compliance tool also needs an **intake desk** (first file) and a **refresh desk** (file has gone stale). Those were never named in Figma or OpenAPI.

This spec is the frontend plan for those missing screens. It does **not** add sidebar items called Pre-KYC or Re-KYC. Figma’s tenant nav already has **CUSTOMER → KYC / KYB**. Pre-KYC and Re-KYC are **two reasons a case is on that desk**.

## Product rules

1. This UI is for **one tenant’s customers**, scoped by the signed-in workspace and the selected **app** (Settings App picker).
2. Do **not** build platform-admin screens (all tenants, global KYC policy, UnifyComply operators).
3. Do **not** split KYC into two routes or two nav items. Officers keep using `/kyc` and `/kyb`.
4. Do **not** reshape the Figma list, detail tabs, or Approve / Reject / Escalate footers.
5. Perform Lookup stays a **quick registry check**. It is not Pre-KYC and not Re-KYC.
6. **Packages** and **Request** stay under BACKGROUND CHECK. They are not the CDD case desk. Leave them placeholder until design draws them.

## The two cycles

| Cycle | When | Who the officer is looking at | Success |
| ----- | ---- | ----------------------------- | ------- |
| **Pre-KYC** | Before the relationship is live | A **new** person or business this tenant does not yet onboard | Status **Approved** (`onboarded`). Expiry clock starts from Compliance Rules. |
| **Re-KYC** | After onboard, when the file is due | The **same** customer record | A new verification run, then the same decision. Clock resets, or they are blocked / offboarded. |

KYB is the same two cycles for businesses (plus shareholders on Pre-KYC).

---

## Actors (tenant only)

| Role | Pre-KYC | Re-KYC |
| ---- | ------- | ------ |
| Compliance Officer | Runs intake, starts checks, works the queue | Works due-for-refresh cases |
| Compliance Manager / MLRO | Same + escalate / high-risk approve | Same |
| Tenant Admin | Settings: expiry, required docs, app, API keys | Same settings drive the clock |
| Developer / Support | API create / keys; not the review footer | Not in scope to replace officers |
| End-customer | Out of this WebApp (Landing / hosted collect later) | Out of this WebApp |

---

## End-to-end flows (words)

### A — Pre-KYC (first file)

Officer is in **their tenant**, on **their app**.

1. **Open the desk** — `/kyc` (or `/kyb`). This is already the queue.
2. **Start a file** — **Add Customer** → **Validate Document** (sandbox / officer-seeded). Production tenants may create via API only (existing toast). Do not invent a third “Pre-KYC” button on the list.
3. **Collect the file** (missing Figma; wizard already exists):
   - KYC: personal + address + documents + review + consent.
   - KYB: business + address + documents (+ **shareholders** — still missing create UI) + consent.
   - Drop sending the KYC **business** step to `POST /customers/kyc` (DTO has no company fields). Relocate or dual-create KYB is a product decision already logged.
4. **Account purpose** — `/kyc/[id]/account-purpose` (already built, no Figma).
5. **Start verification** — `/kyc/[id]/start-verification` (already built, no Figma). Checks come from `available-checks` for country + individual/business.
6. **Wait on the same list** — row stays Pending / In Review. No new queue route.
7. **Open the case** — Figma detail. Officer uses existing footers: Approve / Reject / Escalate / Request Resubmission.
8. **Approved** — customer is onboarded. Pre-KYC is done. Compliance Rules `kycExpiryDays` / `kybExpiryDays` start the Re-KYC clock.

**Missing Pre-KYC screens to add (reuse existing chrome, no new nav):**

| Screen | Route | Pattern to copy | Why it is missing |
| ------ | ----- | --------------- | ----------------- |
| Bless / align onboarding wizard | `/kyc/onboarding`, `/kyb/onboarding` | Current stepper | No WebApp frames |
| Document requirements on the case | Existing Document tab | Checklist on the tab, not a new page | `GET …/documents/requirements` unused |
| KYB add shareholder | Existing Shareholders tab | Modal like Invite Team Member | Read-only today |
| Verification run on the case | Existing detail (new panel or tab **only if** Figma cannot hold it) | Detail header / a muted status row like live “Account purpose · Start verification” | Officers cannot see which checks ran |

Do **not** add `/pre-kyc`.

### B — Re-KYC (same person, new pass)

1. **Clock** — Settings → Compliance Rules already stores expiry. That is tenant policy, not a new screen.
2. **Find who is due** — still `/kyc` (and `/kyb`). Add a **list filter** (and only a filter, unless design draws a fifth metric): **Due for refresh**.  
   Figma Status values stay. Put refresh under **More filters** (next to High risk) so we do not rename Figma Status chips.
3. **Open the onboarded case** — same `/kyc/[id]`.
4. **Start refresh** — officer CTA on **onboarded / approved** live cases only: **Start refresh**. That reuses `/kyc/[id]/start-verification` (and account purpose only if it must be restated). Do **not** `POST /customers/kyc` again.
5. **Case returns to the queue** — Pending / In Review. Same decision footers.
6. **Outcome** — Approve = stay onboarded, clock resets. Reject / block / offboard = relationship stops (`DELETE …/{id}` is offboard in OpenAPI — map to existing Reject only if product confirms; otherwise keep Reject UI and log a backend gap).

**Missing Re-KYC screens to add:**

| Screen | Route | Pattern to copy | Why it is missing |
| ------ | ----- | --------------- | ----------------- |
| Due for refresh filter | `/kyc`, `/kyb` list | Existing **More filters** menu | Settings has expiry; list ignores it |
| Start refresh on an onboarded case | Detail header, live ids only | Same muted links as Account purpose · Start verification | No way to re-run checks without looking like a new customer |
| Empty state when no one is due | Same list | **No User Activity** | Filter with zero rows |

Do **not** add `/re-kyc`. Do **not** add a COMPLIANCE queue route (already decided).

---

## What stays out of this plan

| Surface | Why |
| ------- | --- |
| Packages / Request | Sidebar exists; **zero section frames**. Different job (sell / intake a background-check job). Plan later when design draws them. |
| Perform Lookup / bulk xlsx | Instant ID check. Keep as designed. |
| Platform Super Admin | Other product. |
| Customer-facing hosted collect | Not this WebApp. Request/Packages might be the tenant *view* of that later. |
| Maker–checker four-eyes | Escalate is not dual control. Separate design ask. |
| AML / Bank Analysis modules | Screening products, not the KYC cycle. |

---

## API mapping (tenant Core Platform)

Happy path already in OpenAPI — **one customer, many verification runs**:

```
Create customer          POST /v1/customers/kyc | /kyb
Documents                POST …/documents
Requirements             GET  …/documents/requirements
Account purpose          PUT  …/account-purpose
Shareholders (KYB)       POST …/shareholders
Start run                POST /v1/verifications/kyc | /kyb   (+ x-app-id)
Inspect run              GET  /v1/verifications/{workflowId}
Offboard                 DELETE …/{customerId}
```

**Gaps that block a real Re-KYC filter (raise to backend, do not fake in the UI):**

- No documented `expiresAt` / `lastOnboardedAt` on the customer list row.
- No list query `dueForRefresh=true`.
- No documented “this verification is a refresh” flag.
- Approve / Reject / Escalate still have no dedicated endpoints.

Until those exist: keep the **Start refresh** CTA and the filter chrome, but the filter cannot go live on real data. Log as a backend blocker; do not invent expiry by guessing `createdAt + kycExpiryDays` unless product signs that off.

**App scope:** start-verification already forwards `x-app-id`. List/create should use the Settings-selected app once the API requires it. Do not build a second app picker on KYC.

---

## UI inventory (tenant KYC desk)

### Already built — reuse

- `/kyc`, `/kyb` lists + Figma filters + detail + decision modals
- `/kyc/onboarding`, `/kyb/onboarding`
- `/kyc/[id]/account-purpose`, `/start-verification` (+ KYB twins)
- Settings → Compliance Rules (expiry + required docs)
- Settings → App picker

### To build (frontend units, in order)

1. **Document requirements** on KYC/KYB Document tab (`GET …/requirements`).
2. **KYB shareholder create** on the existing tab.
3. **Verification run summary** on live detail (workflow from `GET /verifications/{id}`), without replacing Figma tabs.
4. **Start refresh** on onboarded live cases → existing start-verification route.
5. **Due for refresh** More-filter + empty copy — **ship disabled / mock** until list API exposes due dates.
6. Stop. Wait for Packages/Request frames. Wait for decision APIs.

Mark every unit **API-derived / no Figma** except (5) which is a small addition to an existing Figma filter menu — log it in `progress-tracker.md` as an intentional delta.

---

## Copy (do not use DTO names)

| Meaning | Officer-facing |
| ------- | -------------- |
| Pre-KYC in progress | Existing statuses: Pending, In Review |
| Pre-KYC done | Approved |
| Re-KYC needed | **Due for refresh** (filter only) |
| Re-KYC in progress | Pending / In Review again |
| Trigger | **Start refresh** (not “Re-KYC”, not “POST verification”) |

Do not label the sidebar or page title Pre-KYC / Re-KYC unless design draws those words.

---

## Acceptance (when we implement)

- [ ] No new sidebar items
- [ ] Tenant-only; respects current workspace + app
- [ ] Pre-KYC still ends on Figma detail + existing footers
- [ ] Re-KYC does not create a second customer
- [ ] Lookup / Packages / Request unchanged
- [ ] Backend blockers listed above are either wired or still open in `progress-tracker.md`
- [ ] progress-tracker updated per unit

## Related

- `03-kyc-compliance.md`, `04-kyb-compliance.md`, `05-customer-onboarding-wizard.md`
- `10-kyb-business-onboarding.md`, `12-account-purpose-and-verification.md`
- `docs/m2-design-asks.md`, `docs/m2-backend-asks.md`
