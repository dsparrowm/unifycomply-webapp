# Feature Spec: Account purpose + start verification

**Milestone:** M2  
**Figma section:** None — **API-derived / no Figma**  
**Status:** Done (initial)

Read `AGENTS.md` and `09-m2-api-ui-flow-gap.md` before changing this flow.

## Purpose

After a KYC/KYB customer exists, Core Platform requires:

1. `PUT /v1/customers/{kyc|kyb}/{id}/account-purpose`
2. `GET /v1/verifications/available-checks`
3. `POST /v1/verifications/{kyc|kyb}`

There are no WebApp frames for these steps. Do **not** fold them into Perform Lookup
or replace Figma detail footers (Approve / Reject / Escalate stay as-is).

## Routes

| Route | Purpose |
| ----- | ------- |
| `/kyc/[id]/account-purpose` | Declare purpose / source of funds |
| `/kyc/[id]/start-verification` | Pick checks and start a KYC run |
| `/kyb/[id]/account-purpose` | Same for businesses |
| `/kyb/[id]/start-verification` | Same for businesses |

Entry:

- Onboarding submit → account purpose → start verification → detail
- Live detail only: muted **Account purpose · Start verification** links (hidden on fixture ids)

## UI

Reuse onboarding chrome (`KycLookupBackHeader`, `SettingsField` / `SettingsSelect`, teal
primary / outline skip). User-facing labels are product copy, not DTO names.

GET account-purpose `404` means “not declared yet” — show an empty form, not an error.

Start verification defaults providers to a `sandbox*` key when the country offers one.

## Out of scope

- Perform Lookup / bulk
- Shareholder create
- Tenant apps CRUD
- Polling `/v1/verifications/{workflowId}` as a dedicated queue
