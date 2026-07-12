# Feature Spec: Customer Onboarding Wizard

**Milestone:** M2  
**Figma section:** Referenced in MVP flowchart (`1532:157029` — module 1.1); no dedicated WebApp list frames exported yet  
**Status:** Implemented (mock flow) — layout inferred from `mvp-roadmap.md` steps

Read `AGENTS.md` before starting.

## Scope

Multi-step customer onboarding wizard launched from KYC **Add Customer → Validate Document**.

Steps (per `mvp-roadmap.md`):

1. Personal info
2. Business info
3. Document upload
4. Identity review
5. Consent → Submit

## Route

| Route | Purpose | Status |
| ----- | ------- | ------ |
| `/kyc/onboarding` | Customer onboarding wizard | Done |

Entry: `KycChooseActionModal` → **Validate Document** → `/kyc/onboarding`

## Components

| Component | Purpose |
| --------- | ------- |
| `OnboardingWizardPanel` | Step state, navigation, submit |
| `OnboardingStepper` | Step progress pills |
| `OnboardingPersonalInfoStep` | Personal details form |
| `OnboardingBusinessInfoStep` | Business details form |
| `OnboardingDocumentUploadStep` | ID front/back + selfie upload |
| `OnboardingDocumentUploadField` | Drag-and-drop file input |
| `OnboardingIdentityReviewStep` | Read-only summary |
| `OnboardingConsentStep` | Consent checkboxes + submit |

## Data

Mock client state in `OnboardingWizardPanel`; defaults in `lib/data/onboarding.ts`.

## Design note

No pixel-specific WebApp frame node IDs were available in `design/manifest.json` at implementation time. Recorded in `context/progress-tracker.md` — re-align when Figma frames are exported.

## Acceptance

- [x] Five-step wizard renders end to end
- [x] Validate Document routes to wizard
- [x] Document upload UI (front, back, selfie)
- [x] Review step shows entered data
- [x] Submit redirects to `/kyc` (mock)
- [ ] Figma frame alignment when exports exist

## Out of scope

- Real API submission
- KYB-specific onboarding route (future)
