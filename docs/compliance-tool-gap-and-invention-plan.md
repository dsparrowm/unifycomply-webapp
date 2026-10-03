# Compliance tool — gap analysis and invention plan

**From:** Frontend (UnifyComply WebApp)
**For:** Product / UnifyCompliance Team — screen-change and new-screen approval
**Date:** 2 October 2026
**UI source of truth:** Figma WebApp page (`1:2`)
**API:** `https://unifycomply-api.rokxier.com` (`/v1/docs`)

---

## Why this document exists

The Figma file is a **product UI**, and the house rule is that I do not invent a
screen, a flow, or relabel copy without your sign-off. Reading the frontend integration guide end
to end from the backend Dev, the gap is bigger than "a few endpoints we can't wire yet": **the Core Platform now ships
the full lifecycle of a compliance tool, and the Figma UI only models the front half of it.**

Figma gives us a strong **intake + review desk** — add a customer, upload documents, run checks,
read the result, approve or reject. The backend goes further: it treats each customer as a living
file that is **re-screened over time** (nine Re-KYC triggers), keeps an **auditable reason
trail** on every status change (`detail.reason` / `detail.trigger`), gates approval on a
**risk decision** (`canApprove` / `requiresEscalation`), and ships a complete
**investigation + regulatory-reporting** surface — case management, PND watchlist, and SAR filings
with PDF export. The later-lifecycle pieces are the ones with **no home in the current
screens**.

This document separates the work into buckets you can approve independently:

- **Part A — Screens / flows to invent.** The backend ships them live; Figma has no built screen (or the frame exists but is gated off).
- **Part B — Existing screens to adjust.** The screen is right, but it can't express what the API (and a compliance officer) needs.
- **Part C — The "essence" gaps.** The conceptual pieces that turn this from a *KYC form* into a *compliance tool*. These justify Parts A and B.

Items already wired inside the current screens (approve, reject, offboard, flags, documents,
account purpose, start verification, TM queues, and the **transaction-detail investigation actions**
— resolve/escalate/place-PND/SAR rationale/SAR-draft chat) are **not** repeated here.

---

## The lifecycle the backend assumes (one picture)

```
          INTAKE                 REVIEW                 DECISION            ONGOING + REPORT
  ┌──────────────────┐  ┌────────────────────┐  ┌─────────────────┐  ┌────────────────────────┐
  create customer ──▶ run checks ──▶ workflow  ──▶ approve ─▶ onboarded ─▶ Re-KYC trigger fires
  + documents          (verifications)  in-review   reject  ─▶ blocked     (9 kinds) ─▶ in-review
  + account purpose      risk decision   │                                      │
                         canApprove?     │                              TM alert ─▶ case ─▶
                                   reason trail                          PND listing + SAR filing
                                   (detail.reason)                       ─▶ SAR report + PDF export
  ──────────────────────────────  ──────────────────────  ──────────────  ────────────────────────
   Figma: STRONG                    Figma: PARTIAL           Figma: STRONG    Figma: MISSING (desk)
                                                                              API: LIVE (writes wired
                                                                              on transaction detail)
```

Figma covers **intake** and most of **review/decision**. The **ongoing + report** column is where
the product is thin — and that column is exactly what a regulator inspects. The good news from the
integration guide: the backend for that column is **live**, and we've already wired the write side on
transaction detail. What's missing is the **desk** to see and work it: the Re-KYC trigger settings,
the Due-for-refresh view, the reason line on the case, and the standalone SAR / PND screens.

---

## Part A — Screens and flows to invent

Each item: what the backend ships, why a compliance tool needs it, the exact endpoint, the smallest
screen I'd propose, and the permission required. All are **new surfaces or re-enabled nav**.

### A1. Re-KYC trigger settings (Settings)

- **Backend ( live ):** `GET /v1/tenants/apps/{appId}/re-kyc/trigger-rules` and `PATCH …/re-kyc/trigger-rules/{kind}` with `{ status: "active" | "inactive" }`. A fixed catalogue of **nine** kinds; enable/disable/tune `config`, no create or delete.
- **Why:** this is the control that decides *when an onboarded customer is pulled back into review* — periodic refresh, a new PEP/sanctions hit, an expired ID, a monitoring escalation, suspected account-takeover. Without it the tool only ever does **one-time** KYC, which is not a compliance programme.
- **Live catalogue:** six evaluate — `pep-sanctions`, `transaction-monitoring-escalation`, `basic-kyc`, `expired-id`, `proof-of-address`, `suspected-ato`; three are **no-ops today** (`high-risk-jurisdiction`, `forged-id`, `immigration-check`).
- **Propose:** a section on **Settings → Compliance Rules**, one row per kind (label, one-line description, on/off switch), reusing the existing settings-row pattern. The three no-op kinds render as "not evaluated" and do not pretend to fire.
- **Permission needed:** add a section to an existing settings page.

### A2. SAR Reports desk (`/sar`)------ Milestone 4 Scope

- **Backend (live):** `GET /v1/sar-reports` (filters `status=pending|under-review|submitted`, `page`, `limit`; response includes a `summary` tile block — totalFiles / pendingReview / submitted / underInvestigation), `GET /v1/sar-reports/:id`, `PATCH /v1/sar-reports/:id/status`, and `GET /v1/sar-reports/:id/export` (**real PDF**, download via `Content-Disposition`). Each filing carries the five-part narrative (opening / why suspicious / activity / steps taken / summary) and numbered suspicious indicators.
- **Why:** a Suspicious Activity Report is the **regulated output** of the AML programme. We already *create* filings from transaction detail, but there is **no screen to list, review, advance status, or export** them. A programme that can file a SAR but not track or hand it to a regulator is incomplete.
- **Figma:** there are **no** frames for SAR Reports. The COMPLIANCE sidebar label is only a nav item.
- **Propose:** a new `/sar` list + detail + status + PDF export.
- **Permission needed:** unlock M4 nav + build SAR Report page

### A3. PND Watchlist desk (`/pnd-watchlist`)

- **Backend (§16.1–§16.2, live):** `GET /v1/pnd-watchlist` (filters `status=active|resolved|under-review`, `riskLevel`, paging; `summary` tiles) and `PATCH /v1/pnd-watchlist/:id/resolve` with a required `resolutionType` (`investigation-complete-no-issues`, `investigation-complete-issues-resolved`, `case-closed`, `false-positive`, `customer-cleared-by-authorities`) plus `resolutionReason`, `investigationOutcome`, `resolutionActionsTaken`.
- **Why:** "Post-No-Debit" is the enforcement side of monitoring — the officer's lever to freeze and then clear activity. We already *place* PND from transaction detail (§15.3, wired), but there is **no screen to see or resolve** the resulting watchlist.
- **Figma:** the only frame named PND is `1532:241310` (Transaction Monitoring). It is the Place PND flow, already wired from transaction detail — not a watchlist desk. No `/pnd-watchlist` frame exists.
- **Permission needed:** unlock M4 nav + build PND Watchlist page

### A4. "Start refresh" on an onboarded case (Re-KYC manual cycle)

- **Backend:** the *same* `POST /v1/verifications/{kyc|kyb}` on the *same* `customerId` — no new resource. A sensitive-field change via `PUT` already flips a verified workflow to `in-review` via the `suspected-ato` trigger; the manual refresh is the officer-initiated equivalent.
- **Why:** once a case is approved, there is no action that means "run this file again." Periodic/triggered re-screening is the ongoing half of A1.
- **Propose:** on an **approved live case only**, a `Start refresh` action on the case header that reuses the existing start-verification screen (ask account purpose again only if missing). Hidden on pending/in-review cases.
- **Permission needed:** a new action on an existing screen.

### A5. Customer edit form (full replace)

- **Backend (live):** `PUT /v1/customers/{kyc|kyb}/{id}` is a **full replace** requiring every field `create` requires; a partial "change the phone" is rejected. Changing 2+ of email/phone/address within 72h is exactly what the `suspected-ato` trigger counts.
- **Why:** an officer currently cannot correct an email, phone, or address — both an ops gap and the reason the ATO trigger has nothing to observe on this desk.
- **Propose:** an edit form opened from the case, pre-filled with the current record, submitted as a full replace. Reuse the onboarding wizard's personal/business step as a single form.
- **Permission needed:** a new form reachable from the case.

----

## Part B — Existing screens to adjust

The screen stays; it just can't currently carry what the API and the officer need. Smallest change each.

### B1. Case event panel — show the *reason* a file is back in review

- **Today:** the verification run panel lists each event as action + time + actor.
- **Backend :** every event carries `detail.reason` (the sentence) and `detail.trigger` (which of the nine kinds fired). Verified example: a monitoring escalation wrote *"Transaction-monitoring activity identifies risk requiring renewed customer due diligence. Activity used crypto, direct-debit, not among the declared channels"* with `trigger: transaction-monitoring-escalation`.
- **Change:** render that sentence as the secondary line under the existing event row. No new tab, no rename.
- **Why it's essence:** "why is this in review" is the first question an officer and an auditor ask. The data is there; we don't show it.

### B2. KYC/KYB list — "Due for refresh" filter

- **Today:** filters are Date / Status / Priorities / Single entity / More filters. No way to ask "whose review date has passed."
- **Backend :** every customer carries `nextReviewAt` and `lastReviewedAt` (an onboarded customer gets `nextReviewAt = lastReviewedAt + kycExpiryDays`; the example shows a real `2027-10-01` timestamp). Client can filter on it.
- **Change:** one entry under **More filters** — *Due for refresh* → onboarded customers whose review date is today or earlier. Zero rows → existing "No User Activity" empty state. Status chips unchanged.

### B3. Document edit modal — require the file again

- **Today:** the modal edits type, number, issue date, expiry and saves without a file.
- **Backend:** `PUT …/documents/{id}` rejects a metadata-only save for upload-required types — the file must be present; changing an expiry means re-attaching the file.
- **Change:** add a file field to the same modal, required when the type needs an upload. Labels stay.

### B4. Settings → API keys — key list, not a single key

- **Today:** one primary key (`…/api-key`): show, rotate, secret once.
- **Backend (live):** `GET/POST/DELETE /v1/tenants/apps/{appId}/keys` + `…/keys/{keyId}/rotate`. Multiple keys per app per domain, each with a **scope** set (`customers:read`, `verifications:write`, `transactions:*`, `webhooks:*`, …), secret shown once at creation.
- **Change:** replace the single-key control with a key **list** (name, scopes, created, rotate, revoke) + a create dialog with scope checkboxes + a copy-once secret dialog. Reuse the team-list rows and invite-dialog chrome.
- **Why it's essence:** scoped, rotatable, revocable, per-app keys are how an integration is governed. A single scopeless key is a toy, not a control.

### B5. Settings → Notifications — rotate signing secret

- **Today:** webhook URL, enable, delivery history, redeliver.
- **Backend :** `POST …/webhook/rotate-secret` issues a new HMAC signing secret.
- **Change:** one *Rotate signing secret* control with the same copy-once treatment as a key. URL/enable/history stay.

### B6. KYC wizard — the business step has nowhere to go

- **Today:** the individual onboarding wizard collects a business step.
- **Backend :** `POST /v1/customers/kyc` has **no** company fields; a business file is `POST /v1/customers/kyb`. Those values are collected and silently dropped.
- **Change (needs a product call):** remove the business step from the KYC wizard, or route a business subject into the existing KYB wizard. We will not invent a combined create.

### B7. Approve button — respect the risk decision

- **Today:** Approve / Reject are live (`POST …/approve|reject`, reject requires a reason). Approve is offered the same way regardless of risk.
- **Backend:** each run's `risk` carries `band`, `priority`, `decision` (`onboard` | `review` | `block`), and crucially `canApprove` (boolean) and `requiresEscalation` (boolean). A sanctions/PEP block returns `canApprove: false, requiresEscalation: true, decision: "block"`.
- **Change:** when `canApprove` is false, the Approve action should reflect that — disabled with a "requires escalation" hint rather than a silent allow. This is the difference between a review screen and a **four-eyes risk gate**.

---

## Part C — The "essence of a compliance tool" gaps

The conceptual reasons Parts A and B matter. Each is something the backend models that the current
UI does not yet express as a first-class idea.

1. **Two status worlds, one badge.** The customer has a *lifecycle* (`pending → onboarded → review → blocked → offboarded`, with full `lifecycle` history detail); the workflow has a *status* (`not-started → processing → in-review → verified → failed`). The UI shows one badge and blurs the two. "The person is onboarded, but their latest screening is back in review" *is* Re-KYC — and already returns the lifecycle history to show it.

2. **The file is alive, not one-and-done.** Re-KYC (A1, A4, B2) is the line between a KYC *form* and an ongoing-monitoring *programme*. The whole nine-trigger catalogue exists for this and has no UI.

3. **Auditability.** Every status change has a `reason`, a `trigger`, and an `actor` (B1); approve/reject write a `customer.review.approved|rejected` event; cases carry an `activity` log. An auditor's core question is "who did what, when, and why" — we have the data and under-surface the "why."

4. **Resubmission as a real path.** A compliance desk usually sends a file back for a corrected document without blocking the person. The case footer already shows **Request Resubmission** and **Escalate** next to Approve and Reject. Approve and Reject are the live decisions. Request Resubmission and Escalate stay on the screen as designed.

5. **Reporting is the point, and it's live.** SAR (A2) and PND (A3) are the regulated outputs. The backend ships them with PDF export; we create filings from transaction detail but have **no desk** to list, review, status-advance, or export them.

6. **Risk is a decision, not a number (B7).** the api gives an internal 0–100 score, an external 0–4 band → priority → `decision`, and explicit `canApprove` / `requiresEscalation`. The UI should let the decision gate the Approve action, not just paint a score.

7. **Investigations are case-centric.** On transaction monitoring, the first time an officer acts on a payment — resolve it, escalate it, freeze it, or start a suspicious-activity report — the system opens a folder for that payment. That folder then holds everything that follows: the freeze (PND), the report (SAR), and a timeline of who did what. That folder is the case. On KYC and KYB there is no folder like that. What looks like a case is the identity check and its history: documents, risk result, and events. Approving or rejecting a person does not open the same kind of investigation folder. An officer ends up with two desks — "who is this customer?" and "what happened with this payment?" — and they are not joined into one file. The product question is whether those stay separate, or whether one customer should have one case that contains both the identity review and the payment investigation. (Backend: the first transaction action creates the case and it aggregates PND listings, SAR filings, and the activity timeline. KYC/KYB has no equivalent object; its "case" is the verification workflow plus events.)

8. **RBAC is finer than our role slugs.** The screen decides who can click a button from the person's job title: Admin, Compliance Officer, Compliance Manager, and so on. If the title is allowed into that area, the button shows. The API decides from a specific ability: open the dashboard (`dashboard:access`), change tenant settings (`tenant-settings:update`), resolve a case (`case:resolve`), escalate a case (`case:escalate`), place or lift a freeze (`pnd:manage`), and file a suspicious-activity report (`sar:file`). One Compliance Officer can have "resolve a case" and not have "file a SAR." Those two checks can disagree. The screen shows File SAR because the job title can see transaction monitoring, the person clicks it, and the API refuses because that account does not have the file-a-SAR ability. SAR, PND, and case actions (A2, A3, and the wired transaction-monitoring actions) should appear only when the account has that ability.

---

## Part D — Decisions I need from you (ranked by compliance value)

1. Build **SAR Reports** (`/sar`) and **PND Watchlist** (`/pnd-watchlist`) as **API-derived / no Figma** desks and advance to **M4** (A2, A3). Endpoints are live. The existing SAR frames are the rationale wizard (`SAR Rationale // 8` = `1532:232754` and siblings), already shipped; the PND frame is `1532:241310` (Place PND), already shipped.
2. Add the **Re-KYC trigger settings** section (A1) and the **reason sentence** on the event row (B1).
3. Add **Due for refresh** filter (B2) and **Start refresh** action (A4).
4. Make **Approve respect `canApprove`/`requiresEscalation`** (B7).
5. Build the **customer edit** form (A5) and add the **file field** to the document edit modal (B3).
6. Rebuild **API keys** as a scoped key list (B4) and add **webhook secret rotation** (B5).
7. Resolve the **KYC wizard business step** (B6): drop it, or route to KYB.
8. Migrate action/nav gating from job titles to the specific abilities in C8.

---

## Relationship to existing docs

- `docs/ui-change-request-api-integration.md` — the short permission memo. This document is the wider rationale and adds the SAR/PND desks, the risk-decision gate (B7), and the ability-based buttons (C8).
- `docs/status-update-screens-and-endpoints.md` — what is already built and wired (including the transaction-detail investigation actions).
