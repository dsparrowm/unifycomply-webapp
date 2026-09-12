# Feature Spec: KYB Compliance

**Milestone:** M2  
**Figma section:** KYB COMPLIANCE (`886:105537`)  
**Status:** KYB unique UI from the (4).zip cache is closed — Validate Document remains API-derived / no Figma

Read `AGENTS.md` before starting.

## Figma reference

- File: [Unifycomply WebApp](https://www.figma.com/design/gJgHsHV3Jt9wYKJfstVdWB/%F0%9F%AA%AAUnifycomply?node-id=886-105537)
- Section node: `886:105537`
- **Full cache:** `design/figma/webapp/kyb/` — 54 unique PNGs from `🪪Unifycomply (4).zip` (2026-09-12). Index: `kyb/README.md` + `kyb/manifest.json`.
- Representative empty business list: `kyb/077.png` — `Customer // KYB // 77` (`886:105538`)
- Representative populated business list: `kyb/089.png` — `Customer // KYB // 89` (`886:109281`)
- Representative batch-file list: `kyb/084.png` — `Customer // KYB // 84` (`886:108206`) — **not** the business queue
- Representative detail frame: `kyb/093.png` — `Customer // KYB // 93` (`886:110808`)
- Batch Lookup result: `kyb/137.png` — `Customer // KYB // 137` (`886:124831`)

The KYB section contains multiple frames (`Customer // KYB // 77` … `137`) as state variants and flow steps — not separate routes. Sequence gaps not in the zip: 90, 94, 98, 101, 104, 107, 110.

## Route

| Route | Purpose | Status |
| ----- | ------- | ------ |
| `/kyb` | KYB business + batch-file lists | Done — live business queue; **Bulk Search** still mock (no bulk API) |
| `/kyb/lookup` | Perform Lookup entry (frames 85–88) | Done |
| `/kyb/lookup/result` | Registry lookup results | Done — mock CAC/TIN/RC result |
| `/kyb/batch/[id]` | Batch Lookup result (frame 137) | Done — Total Business + queue table |
| `/kyb/[id]` | KYB business detail (frame 93) | Done — live customer + documents + shareholders; directors/compliance stay mock |

App shell is provided by `app/(app)/layout.tsx`.

## Frame inventory (build order)

### A — List screen (`/kyb`)

| Frames | Node IDs (sample) | State | Implementation |
| ------ | ----------------- | ----- | -------------- |
| 77, 79 | `886:105538`, `886:106307` | **Empty business list** — metrics `0`, **"No User Activity"**, **Assigned To** column | **Done** — headers match populated queue (089 order) |
| 78–81 | `886:105922` … | Date / Status / Priorities / Type (Single entity vs **Bulk Search**) filters | **Done** — Type → Bulk Search shows batch table |
| 82–83 | `886:107462`, `886:107834` | **Empty batch-file queue** — Batch ID, File Name, Created By, Total | **Done** — empty `batches` + **No User Activity** |
| 84 | `886:108206` | **Populated batch-file queue** — metrics `12` / `4` / `4` / `4` | **Done** — `KybBatchTable` |
| 85–88 | `886:108577`–`886:109104` | Perform Lookup entry (empty, country, ID type, CAC Advance filled) | **Done** — `/kyb/lookup` |
| 89, 91, 92, 119, 120 | `886:109281` … | **Populated business queue** — Verification Type + Assigned To | **Done** — `KybTable` + `KycAssignedToCell` |
| 137 | `886:124831` | Batch Lookup result — Total Business + queue table | **Done** — `/kyb/batch/[id]` |

**List UI elements (all list frames):**

- Header: **KYB** + subtitle **Know your Business** + **Add Business** CTA
- Metric cards: Successful verification, Pending Verification, High Risk Alert, Rejected verification
- Filter bar: Date, Status, Priorities, Type (Single entity search / Bulk Search), More filters, Search, Export Report
- Business-queue columns (frames 77, 89): KYB ID, Business Name, **Verification Type**, Status, Country, Priority, Risk Score, **Assigned To**, Time in Queue
- Batch-file columns (frames 82–84): Batch ID, File Name, Created Date, Created By, Assigned To, Country, Status, Total
- Empty copy: **No User Activity** (exact Figma string)

### Risk score model (0–4)

Same **0–4 risk score scale** as KYC and Settings → Approvals. Numeric score is the source of truth.

## Default data policy (v1 mock)

| Fixture | Use | Metrics |
| ------- | --- | ------- |
| `kybListDataEmpty` | Empty list after Add Business flow (frame 79) | All `0` |
| `kybListDataPopulated` | **Current** `/kyb` page (Figma business list = frame **89**, not 84) | `12` / `4` / `4` / `4` |

## Components

| Component | Purpose |
| --------- | ------- |
| `KybPageHeader` | Title, subtitle, Add Business |
| `KybMetricCards` | Four verification metric cards (reuses `KycMetricCards`) |
| `KybFilters` | Filter bar + search + export |
| `KybTable` | Business-queue table or empty state |
| `KybBatchTable` | Batch-file table (Type → Bulk Search) |
| `KybBatchResultPanel` | Batch Lookup result (frame 137) |
| `KybListPanel` | Composes list screen |
| `KybChooseActionModal` | Add Business action picker (Perform Lookup, Validate Document) |
| `KybLookupEntryPanel` | Perform Lookup verification form |
| `KybLookupResultPanel` | Business registry lookup results with tabs and footer actions |
| `KybDetailPanel` | KYB detail with Business Overview tab, sidebar panels, decision modals |
| `KybDocumentViewerModal` | Certificate of Incorporation viewer (frames 131 / 132 / 136) |

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
- Document viewer (frames 131, 132, 136): Certificate of Incorporation modal — **Done** (`KybDocumentViewerModal`; Eye opens, Cancel / Download / X)

## Build next (from 2026-09-12 cache)

1. Assigned To + Verification Type on `/kyb` — **Done**
2. Batch-file queue (frames 82–84) + Type filter Bulk Search switch — **Done**
3. Batch Lookup result (frame 137) — **Done**
4. Document viewer modal (frames 131 / 132 / 136) — **Done**

## Acceptance — List (frames 77 + 89; batch 82–84)

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
- [x] Document viewer modal — Certificate of Incorporation (Cancel / Download / X)

## Out of scope (this unit)

- Real API integration
- Validate Document flow from choose-action modal (API-derived `/kyb/onboarding` exists; no Figma)
- Directors & Officers tab for risk score 2 baseline
- Standalone `/aml-screening` list UI (see `08-aml-screening.md`)
- Perform Lookup **result** Figma — not in the (4).zip export; keep existing `/kyb/lookup/result`

## Related docs

- `context/feature-specs/03-kyc-compliance.md` — parallel list pattern
- `design/manifest.json` — section `886:105537`
