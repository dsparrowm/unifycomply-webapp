# Feature Spec: AML Screening

**Milestone:** M2  
**Figma section:** AML SCREENING (`886:134392`)  
**Status:** Placeholder route — full list UI not started

Read `AGENTS.md` before starting.

## Figma reference

- File: [Unifycomply WebApp](https://www.figma.com/design/gJgHsHV3Jt9wYKJfstVdWB/%F0%9F%AA%AAUnifycomply?node-id=886-134392)
- Section node: `886:134392`

## Route

| Route | Purpose | Status |
| ----- | ------- | ------ |
| `/aml-screening` | Standalone AML screening list and workflows | Placeholder — `RoutePlaceholderPanel` |

App shell is provided by `app/(app)/layout.tsx`.

## Related implementation (not this route)

AML screening content already exists as detail-tab panels:

- KYC detail — `KycAmlScreeningPanel` on `/kyc/[id]`
- KYB detail — `KybComplianceChecksTab` on `/kyb/[id]`

This spec covers the **standalone** AML SCREENING section from the sidebar.

## Components (planned)

| Component | Purpose |
| --------- | ------- |
| `AmlScreeningPageHeader` | Title, subtitle, primary CTA |
| `AmlScreeningFilters` | Filter bar + search |
| `AmlScreeningTable` | Screening results list |
| `AmlScreeningListPanel` | Composes list screen |

## Default data policy (v1 mock)

TBD when list UI is implemented. Use typed fixtures in `lib/data/aml-screening.ts`.

## Acceptance — placeholder (current)

- [x] Route `/aml-screening` resolves (no 404)
- [x] Placeholder panel with title and coming-soon copy
- [x] Nav link enabled at M2 with RBAC + milestone gating

## Acceptance — full list (future)

- [ ] List screen matches Figma AML SCREENING section
- [ ] Filters and table with mock data
- [ ] TypeScript clean
- [ ] progress-tracker updated

## Out of scope (this unit)

- Real API integration
- Replacing KYC/KYB detail AML tab panels

## Related docs

- `context/feature-specs/03-kyc-compliance.md` — KYC detail AML tab
- `context/feature-specs/04-kyb-compliance.md` — KYB compliance checks tab
- `design/manifest.json` — section `886:134392`
