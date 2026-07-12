# Feature Spec: KYB Compliance

**Milestone:** M2  
**Figma section:** KYB COMPLIANCE (`886:105537`)  
**Status:** In progress — list, lookup, and detail (frame 93) done

Read `AGENTS.md` before starting.

## Figma reference

- File: [Unifycomply WebApp](https://www.figma.com/design/gJgHsHV3Jt9wYKJfstVdWB/%F0%9F%AA%AAUnifycomply?node-id=886-105537)
- Section node: `886:105537`
- Representative list frame (empty): `886:106307` — `Customer // KYB // 79`
- Representative list frame (populated): `886:108206` — `Customer // KYB // 84`
- Representative detail frame: `886:110808` — `Customer // KYB // 93`

The KYB section contains multiple frames (`Customer // KYB // 77` …) as state variants and flow steps — not separate routes.

## Route

| Route | Purpose | Status |
| ----- | ------- | ------ |
| `/kyb` | KYB business list | Done — empty default (frame 79) + populated fixture (frame 84) |
| `/kyb/lookup` | Perform Lookup entry (frames 85–88) | Done |
| `/kyb/lookup/result` | Registry lookup results | Done — mock CAC/TIN/RC result |
| `/kyb/[id]` | KYB business detail (frame 93) | Done — Business Overview tab + decision footer |

App shell is provided by `app/(app)/layout.tsx`.

## Frame inventory (build order)

### A — List screen (`/kyb`)

| Frames | Node IDs (sample) | State | Implementation |
| ------ | ----------------- | ----- | -------------- |
| 79 | `886:106307` | **Default empty list** — metrics `0`, table shows **"No User Activity"** | **Done** — `kybListDataEmpty` |
| 80–83 | `886:106692` … `886:107834` | Filter dropdown overlays | **Done** — reuses KYC filter pattern |
| 84 | `886:108206` | **Populated list** — metrics `12` / `4` / `4` / `4`, table rows + pagination | Mock fixture ready (`kybListDataPopulated`) |
| 85–88 | `886:108577`–`886:109104` | Perform Lookup entry (single + bulk) | **Done** — `/kyb/lookup` |
| 89+ | `886:109281` … | Lookup result, detail, decision flows | Result + detail done |

**List UI elements (all list frames):**

- Header: **KYB** + subtitle **Know your Business** + **Add Business** CTA
- Metric cards: Successful verification, Pending Verification, High Risk Alert, Rejected verification
- Filter bar: Date, Status, Priorities, Single entity, More filters, Search, Export Report
- Table columns: KYB ID, Business Name, Business Type, Country, Status, Priority, Risk Score, Time in Queue
- Empty copy: **No User Activity** (exact Figma string)

### Risk score model (0–4)

Same **0–4 risk score scale** as KYC and Settings → Approvals. Numeric score is the source of truth.

## Default data policy (v1 mock)

| Fixture | Use | Metrics |
| ------- | --- | ------- |
| `kybListDataEmpty` | Empty list after Add Business flow (frame 79) | All `0` |
| `kybListDataPopulated` | **Current** `/kyb` page (frame 84) | `12` / `4` / `4` / `4` |

## Components

| Component | Purpose |
| --------- | ------- |
| `KybPageHeader` | Title, subtitle, Add Business |
| `KybMetricCards` | Four verification metric cards (reuses `KycMetricCards`) |
| `KybFilters` | Filter bar + search + export |
| `KybTable` | Data table or empty state |
| `KybListPanel` | Composes list screen |
| `KybChooseActionModal` | Add Business action picker (Perform Lookup, Validate Document) |
| `KybLookupEntryPanel` | Perform Lookup verification form |
| `KybLookupResultPanel` | Business registry lookup results with tabs and footer actions |
| `KybDetailPanel` | KYB detail with Business Overview tab, sidebar panels, decision modals |

### B — Detail screen (`/kyb/[id]`)

| Frames | Node IDs | State | Implementation |
| ------ | -------- | ----- | -------------- |
| 93 | `886:110808` | **Business Overview** — registry info, address/contact, activities, risk sidebar, footer actions | **Done** — `kyb-record-5` (TechVentures Nigeria Limited) |

**Detail UI elements (frame 93):**

- Header: Back, **KYB / {business}** + status badge, Risk Score badge, **Export Report**
- Tabs: Business Overview, Risk Score Analysis, Directors & Officers, Shareholders, Document, Compliance Checks
- Business Information: legal name, registration, TIN, type, country, status, industry
- Business Address & Contact: registered address, phone, email, website
- Business Activities tags
- Sidebar: Risk analysis, Verification Status, Business Size
- Footer: Request Resubmission, Reject, Approve (escalate variant when approval blocked per risk score)

## Acceptance — List (frames 79 + 84)

- [x] Metrics display `0` for all four cards (empty fixture)
- [x] Table shows **No User Activity** when no records
- [x] Filter bar renders per Figma
- [x] Add Business button opens choose-action modal
- [x] Populated fixture with metrics `12` / `4` / `4` / `4`
- [x] Add Business → Perform Lookup routes to `/kyb/lookup`
- [x] Perform Lookup entry — single + bulk verification form
- [x] Perform Lookup result — registry card, summary panel, tabs, footer actions
- [x] KYB detail route (`/kyb/[id]`) — frame 93 Business Overview baseline
- [x] KYB detail Risk Score Analysis tab — reuses `KycRiskAnalysisPanel` for scores 0–4
- [x] KYB detail Directors & Officers tab — scores 0, 1, 3, and 4 baselines (score 2 placeholder)
- [x] KYB detail Shareholders tab — Share Capital Structure table for all risk levels
- [x] KYB detail Document tab — Submitted Documents list for all risk levels
- [x] KYB detail Compliance Checks tab — AML screening sections for all risk levels 0–4
- [x] KYB detail transparent section headers — shared `KybDetailSectionHeader`

## Out of scope (this unit)

- Real API integration
- Validate Document flow from choose-action modal
- Directors & Officers tab for risk score 2 baseline
- Standalone `/aml-screening` list UI (see `08-aml-screening.md`)

## Related docs

- `context/feature-specs/03-kyc-compliance.md` — parallel list pattern
- `design/manifest.json` — section `886:105537`
