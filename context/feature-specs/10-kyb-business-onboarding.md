# Feature Spec: KYB Business Onboarding (Validate Document)

**Milestone:** M2  
**Figma section:** None dedicated — **API-derived** intake (see `09-m2-api-ui-flow-gap.md`)  
**Status:** Done (initial) — create business + documents via Core Platform

Read `AGENTS.md` before starting.

## Purpose

KYB **Add Business → Validate Document** previously closed the modal only. This flow
creates a KYB customer and uploads documents using OpenAPI:

- `POST /v1/customers/kyb`
- `POST /v1/customers/kyb/{customerId}/documents`

## Route

| Route | Purpose | Status |
| ----- | ------- | ------ |
| `/kyb/onboarding` | Business onboarding wizard | Done |

Entry: `KybChooseActionModal` → **Validate Document** → `/kyb/onboarding`

## Steps

1. Business info (name, registration date, contact, country, industry, website)
2. Address (house, street, city, state, zip)
3. Documents (certificate of incorporation, proof of address)
4. Review
5. Consent → submit

UI patterns reuse KYC onboarding (stepper, fields, consent) — not a Figma redesign.

## Out of scope (follow-ups)

- Shareholders create
- Tenant apps selector

Submit now continues to `/kyb/{id}/account-purpose` then start verification
(`12-account-purpose-and-verification.md`).
