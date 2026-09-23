# Unifycomply — M2 design asks (frontend)

**From:** Davies Aniefiok (WebApp frontend)  
**To:** Design  
**Date:** 13 September 2026  
**Figma:** WebApp page (`1:2`) only

---

## Why this note

KYC, KYB, AML, and Bank Analysis unique UI from the zips is **built and visually checked**. We did **not** change those frames to match the API.

The designed product is a **review desk** (queue → case → decide). A working CDD tool also needs an **intake desk**, a **UBO desk**, and a **job desk**. Those were not in the M2 frames.

The WebApp UI stays as designed. We will not reshape screens to match backend DTOs.

A companion backend brief was sent separately.

---

## Please do not redesign

- KYC/KYB list columns, metrics, or filters
- Case tabs and Approve / Reject / Escalate footers
- Perform Lookup (it stays; it is not the same as “start verification”)
- Do not add a separate **Compliance queue** route — frames 79–86 already are the queue
- Do not add **Batch Screening** as a sidebar item unless you mean a new section (AML frame 15 vs Batch Lookup 24)

---

## We already shipped without Figma (please align or bless)

| Flow | What we built | Ask |
| ---- | ------------- | --- |
| KYC onboarding wizard | Personal → business → docs → review → consent (`/kyc/onboarding`) | Roadmap-only; no WebApp frames. Export or mark as accepted. |
| KYB Validate Document | Same pattern (`/kyb/onboarding`) | Modal used to close only. Need a real frame or accept current. |
| Account purpose | `/kyc/[id]/account-purpose` (KYB twin) | Purpose, source of funds, channels. No frame. |
| Start verification | `/kyc/[id]/start-verification` | Check picker from live `available-checks`. No frame. |
| Live detail links | “Account purpose · Start verification” under the header on **live** cases only | Additive; hidden on Figma fixture ids. Keep, restyle, or move. |

---

## Please design (in this order)

1. **Add shareholder / UBO** (KYB) — create/edit on the existing Shareholders tab: type, %, appointment, ID upload. Tab stays; it is read-only today.
2. **Document requirements** — “required vs received” on the existing Document tab (not a new page).
3. **Verification run on the case** — status, checks run, fail reasons, retry. Not a new nav item.
4. **Packages / Request / Pre-KYC** — sidebar labels exist, **zero section frames**. This is how customers arrive (hosted collect, partner request). If Pre-KYC is a real product, we need the surface.
5. **Maker–checker** — Escalate is not four-eyes. Checker view or dual-control on Approve.
6. **Ongoing review** — Settings already has KYC/KYB expiry; no “due for refresh” queue.
7. **Small label conflicts to close**
   - KYC empty metric: frame 115 **In Review** vs 79/86 **High Risk Alert** (we kept High Risk Alert)
   - Bank Analysis: empty **high risk alerts** vs populated **high risk Entity**
   - Bank Analysis Single Lookup: run-07 is Country / App / Entity type / ID; we still have Bank + Account Number because later list work used that

---

## Decisions we need

1. Bless the API-derived purpose + start-verification screens, or you will draw them?
2. Is Packages/Request in M2, or do we leave placeholders?
3. Is Pre-KYC = the onboarding wizard, Packages/Request, or something else?

**Frontend plan (2026-09-14):** Pre-KYC / Re-KYC are cycles on the existing KYC/KYB desk, not Packages/Request and not new nav. See `context/feature-specs/16-prekyc-rekyc-tenant-flow.md`.

---

## Out of scope for this meeting

TM, SAR, PND, case management — later milestones. Do not pull them into M2.

---

*Prepared for design. Companion backend brief: `docs/m2-backend-asks.html`.*
