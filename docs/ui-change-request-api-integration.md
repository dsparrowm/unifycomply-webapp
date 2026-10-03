# UI changes required to finish the Core Platform integration

**From:** UnifyComply WebApp  
**To:** Organisation (permission to change screens)  
**Date:** 2 October 2026  
**API:** `https://unifycomply-api.rokxier.com`  
**Behaviour source:** Frontend Integration Guide, 1 October 2026

The WebApp in Figma is the product. We do not change a screen, label, or flow unless this organisation allows it. Where the current screen can already hold the API, it is wired and left as designed. This note is only the set of changes that cannot be done inside the screens we have.

Nothing here asks for a new sidebar item called Pre-KYC or Re-KYC. Both cycles stay on **CUSTOMER → KYC** and **CUSTOMER → KYB**.

---

## How the two cycles work

**Pre-KYC** is the first file. The officer creates the person or business, attaches documents, declares account purpose, and starts checks. If the run leaves the customer in review, **Approve** onboards them. **Reject** blocks them. **Offboard** is a separate action and does not delete the record. We have run this path: a sandbox individual was approved and the API returned `onboarded`.

**Re-KYC** is a later pass on that same customer. It does not create a second person. After they are onboarded, a trigger can send their **verification** back to review. We confirmed one live trigger: changing email and phone on the approved customer wrote `suspected-ato` and moved the workflow from `verified` to `in-review`. The customer record stayed `onboarded`.

The screens below are what an officer still cannot do with the UI as it stands.

---

## Already wired, no screen change

These stay as they are.

| Area | What the officer already has |
| ---- | ----------------------------- |
| Sign-in, password reset, sandbox / production | Existing auth screens. The domain toggle refetches the page after a switch. |
| KYC / KYB queue and case | List, detail, documents, requirements, shareholders, flags, approve, reject, offboard. |
| First file | Onboarding wizard, account purpose, start verification. |
| Overview | Total verification, high-risk alert, recent activity, API calls, and most-used checks. |
| Transaction monitoring | Overview, four queues, transaction list and detail, rules, place PND, escalate, resolve, SAR draft on the existing assistant step. |
| Settings already on screen | Business information, team, roles, compliance rules (expiry days, required documents, flagged countries), risk weights, PEP tiers, webhook URL and delivery history. |

---

## Changes that need permission

Each item names the screen today, the smallest change, and the screen we would copy. We will not add a new navigation group for any of these.

### 1. Settings — Re-KYC triggers

**Today:** Settings → Compliance Rules stores how many days a file is valid, and which documents are required. It does not list the nine automatic reasons a file returns to review.

**API:** `GET` and `PATCH /v1/tenants/apps/{appId}/re-kyc/trigger-rules`. The catalogue is fixed. An officer can turn a kind on or off. They cannot add or delete a kind.

**Change:** A list on Settings, one row per kind, with an on/off switch.

| Kind | What the officer is switching |
| ---- | ----------------------------- |
| PEP / sanctions | A new match sends an onboarded customer’s verification back to review. Turning it off still keeps the match. |
| Transaction-monitoring escalation | A monitoring alert does the same. |
| Periodic review | Skips the scheduled re-screen. The period is the expiry days already on Compliance Rules. |
| Expired ID, proof of address | An expired document does the same. |
| Suspected account takeover | Two or more of email, phone, and address changing within 72 hours on an onboarded customer. |
| High-risk jurisdiction, forged ID, immigration check | Shown as not evaluated. The switch is visible and does not pretend to fire. |

**Copy:** The existing settings rows (label, short description, switch), not a new page layout.

### 2. KYC and KYB case — why this file is back in review

**Today:** The verification run panel lists each event as an action, a time, and an actor. It does not show the sentence that explains the event.

**API:** That sentence is already on the event, as `detail.reason`, with `detail.trigger` naming which of the nine kinds fired. On the probe it read: email and phone changed within 72 hours, trigger `suspected-ato`.

**Change:** Under the existing event row, show that sentence. Do not add a tab. Do not rename the panel.

**Copy:** The secondary line already under the action (date and actor).

### 3. KYC and KYB list — who is due for a refresh

**Today:** Filters are the Figma status chips plus More filters (including high risk). There is no way to ask “whose review date has passed”.

**API:** An onboarded customer is supposed to carry `nextReviewAt`, calculated from Compliance Rules when they are approved. The list can be filtered in the client from that date. There is no separate due-for-refresh status, and we will not add one.

**Change:** One entry under **More filters**: **Due for refresh**. It lists onboarded customers whose review date is today or earlier. Zero rows use the existing **No User Activity** empty state. Status chips stay Pending, In Review, Approved, Rejected.

**Copy:** The existing More filters menu.

### 4. KYC and KYB case — start a refresh

**Today:** Starting checks is part of the first-file path. On an already approved case there is no action that means “run this file again”.

**API:** The same start-verification call, on the same customer id. It must be offered only when the customer is onboarded. It must not create another customer.

**Change:** On an approved live case, a **Start refresh** action that opens the existing start-verification screen. Account purpose is asked again only if it is missing. Pending and in-review cases do not show it.

**Copy:** The existing account-purpose and start-verification links on the case header.

### 5. KYC and KYB case — edit the customer

**Today:** There is no edit form. An officer cannot correct an email, phone, or address. Those are the fields the account-takeover rule counts, and the only way to change them is a full replace of the customer.

**API:** `PUT /v1/customers/{kyc|kyb}/{id}` requires every field that create requires. Sending only the changed phone is rejected.

**Change:** An edit form opened from the existing case, pre-filled with the current record, submitted as a full replace. One field on screen still sends the whole record.

**Copy:** The onboarding wizard’s personal (or business) step, as a single form rather than a new wizard.

### 6. Document edit modal — the file has to be sent again

**Today:** The document modal edits type, number, issue date, and expiry, and saves without a file.

**API:** `PUT …/documents/{id}` rejects that save. A passport update without the file returns “requires a file upload”. Replacing an expiry date means attaching the file again.

**Change:** The same modal gains a file field, required when the document type needs an upload. Labels for type, number, and dates stay.

**Copy:** The upload control already used when a document is first added.

### 7. Settings → API keys

**Today:** One primary key: show, rotate, and the secret once.

**API:** A list of keys for the selected app: create with scopes, rotate one key, revoke one key, and show the secret only at creation.

**Change:** A key list on the existing API keys section, with scope checkboxes, issue, rotate, revoke, and a copy-once dialog. The single primary key control is replaced by that list, not placed beside a second unrelated key.

**Copy:** Team member list (rows and actions) and the invite dialog (for the copy-once secret).

### 8. Settings → Notifications — rotate the signing secret

**Today:** Webhook URL, enable, delivery history, and redeliver.

**API:** `POST …/webhook/rotate-secret` issues a new signing secret.

**Change:** One **Rotate signing secret** control on that section, with the same copy-once treatment as an API key. URL, enable, and history stay.

### 9. KYC wizard — the business step has nowhere to go

**Today:** The individual onboarding wizard collects a business step.

**API:** `POST /v1/customers/kyc` has no company fields. Those values are collected and not sent. A business file is `POST /v1/customers/kyb`.

**Change, if permitted:** Remove that step from the KYC wizard, or send the officer into the existing KYB wizard when the subject is a business. We will not invent a combined create.

---

## Designed screens not built yet

These are not redesigns. Figma already has them. They stay off until this organisation says to build them, because the nav is still on an earlier milestone.

| Screen | Route | API already available |
| ------ | ----- | --------------------- |
| SAR Report | `/sar` | List, read, status, PDF export |
| PND Watchlist | `/pnd-watchlist` | List, resolve |

**Risk Score** (`/risk-score`) has no endpoint. Leave it disabled. Do not draw a live screen for it.

---

## Leave unchanged

| Screen | Why it stays |
| ------ | ------------ |
| Approve, Reject, Escalate, Request Resubmission | The footer stays. Approve and Reject are live. Escalate and Request Resubmission have no customer endpoint, so they remain on screen and do not call the API. |
| Status chips and page titles | Due for refresh is a filter, not a new status and not a new title. |
| Perform Lookup and bulk upload | No lookup endpoint. Lookup is not Pre-KYC and not Re-KYC. |
| AML, Bank Analysis, Packages, Request, Billing, Audit logs | No contract for these modules. |
| Transaction Monitoring → Not-Blocked | A transaction that matches no rule is in no queue. The screen is not “cleared for processing”, and we will not relabel it. |
| Rule-condition and onboarding country dropdowns | The words on the screen do not match the server’s option labels. The screen copy stays. Gender already matches and is live. |

---

## Permission asked for

1. Settings list of the nine Re-KYC triggers.  
2. The reason sentence on the existing verification event row.  
3. **Due for refresh** under More filters on KYC and KYB.  
4. **Start refresh** on an approved case, reusing start verification.  
5. Pre-filled customer edit (full replace).  
6. File required again on the document edit modal.  
7. API key list, and rotate signing secret.  
8. A decision on the KYC wizard business step.  
9. Whether to build the existing SAR Report and PND Watchlist frames now.

Until that permission is given, those screens stay as they are.
