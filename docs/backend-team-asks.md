# Asks for the backend

**From:** Frontend (UnifyComply WebApp)
**To:** Backend (same team)
**Date:** 2 October 2026
**API:** `https://unifycomply-api.rokxier.com`
**Behaviour source:** Frontend Integration Guide, 1 October 2026

These items were taken out of the notes for the UnifyComply team. That pack asks only for permission to add or change screens. This note is what the API still has to provide before those screens can tell the truth.

**Answered 2 October 2026.** Their reply is `docs/backend-response-to-frontend-asks.pdf`. Status below is theirs: live, partial, or not built.

---

## 1. The review clock does not start on approve — live

Approve now sets `lastReviewedAt` to now and `nextReviewAt` to now plus the app's expiry days. Reject, offboard, or a return to review clears `nextReviewAt`. Due book is `status=onboarded` and `nextReviewAt <= now`. Customers approved by hand before 2 October can still have `nextReviewAt: null` until they run a backfill. Show that as "no review scheduled", not an error. Do not invent the date from `createdAt`.

## 2. A second run is not marked as a refresh — partial

`customerId` is live on `GET /v1/verifications`, `/verifications/kyc`, and `/verifications/kyb`. An empty `customerId` is a 400.

`cycle`, `trigger`, `reason`, and the 409 for a refresh on a customer who is not onboarded are **not built**. Until then, the reason a file returned to review is on the workflow event: `detail.trigger` and `detail.reason`.

## 3. Send-back without blocking the customer — live

They did not add a `{ reason }` body. Both actions leave the customer's own status alone.

**Request resubmission:** `POST /v1/customers/{kyc|kyb}/{customerId}/request-resubmission` with `{ issues, instructions? }`. `issues` comes from `GET /v1/public/misc/options/resubmission-issues` (`label` is the title, `meta.description` is the help text). At least one issue is required. The workflow goes back to `processing` (the list pill stays Pending) and the row carries `resubmission`. Show the word Resubmission under the name when that object is present. Only a case in review can be sent back (409 otherwise). The next document upload, or a new verification run, clears it.

**Escalate:** `POST /v1/customers/{kyc|kyb}/{customerId}/escalate` with `{ notes, userId? }`. Priority becomes `urgent`. Optional `userId` assigns it. Once only, any time before verified.

**Approve:** a high-risk customer (`canApprove` false / `requiresEscalation` true) returns 409 `data.code === "escalation-required"` until the case has been escalated. After escalation, approve succeeds. If the risk verdict cannot be loaded, approve returns 503.

## 4. Assignment has no write — live

`PUT /v1/verifications/{workflowId}/assignee` with `{ userId }` or `{ userId: null }`. Queue rows return `assignedTo: { id, name }` or `null`. Filter with `?assigneeId=`. Scope `verifications:write`.

Cases: `POST /v1/transactions/{transactionId}/actions/assign-case` with the same body. `assignedTo` is the display name and `assignedToId` is the user id. Session only, and the user needs `case:escalate` or `case:resolve`.

Officer picker: `GET /v1/tenants/settings/teams` rows that have a `userId`, plus the signed-in user from `GET /v1/auth/user` when the owner is missing from that list.

## 5. Investigation dropdowns are not in the option registry — live

`GET /v1/public/misc/options/{key}` now has: `case-resolution-types`, `case-actions-taken`, `pnd-resolution-types`, `pnd-statuses`, `investigation-entity-types`, `investigation-risk-levels`, `sar-statuses`. A value from the set is what the write endpoints accept. Keep the words already on the screen when a label differs, and send the option `value`.

## 6. Reads the designed screens still cannot fill — not built

They treat these as new features, not missing fields on a contract that exists. Their suggestion is to hide Lookup, hide Bank Analysis, and use the verification AML tab instead of the standalone AML module. That is a screen change, so it stays with the UnifyComply team. The screens stay as they are until that permission exists. Empty document extraction, device, and liveness tabs stay empty states.

## 7. Behaviour the guide already marks as incomplete — partial

- **SAR draft is live as a clear error.** `POST …/sar-draft/…/messages` returns 503 with `data.code === "ai-not-configured"` when no AI key is set. Show "drafting unavailable" from that code.
- **Re-KYC `evaluated` is live.** Each trigger row now has `evaluated: true | false`. Read the flag. Do not hardcode the three no-op kinds.
- **Two of the four dead rules are still waiting on numbers** from Compliance (Large Withdrawal Pattern, Velocity Spike). New Device High Amount needs a stated amount. High ML Fraud Probability needs a fraud model. Show them as configured but inactive.
- **Extra webhooks are not built.** Still poll for Re-KYC returns to review, transaction alerts, and investigation actions. `workflow.resubmission-requested` is the one new webhook, and it is live.
