# Feature Spec: KYB Compliance

**Milestone:** M2  
**Figma section:** KYB COMPLIANCE (`886:105537`)  
**Status:** Complete for M2 — all design-defined list, lookup, detail, and decision
actions implemented; no-design business onboarding remains deferred

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
| `/kyb/[id]` | KYB business detail (frame 93) | Done — Business Overview + decision footer |

App shell is provided by `app/(app)/layout.tsx`.

## Frame inventory (build order)

### A — List screen (`/kyb`)

| Frames | Node IDs (sample) | State | Implementation |
| ------ | ----------------- | ----- | -------------- |
| 79 | `886:106307` | **Default empty list** — metrics `0`, table shows **"No User Activity"** | **Done** — `kybListDataEmpty` |
| 80–83 | `886:106692` … `886:107834` | Filter dropdown overlays | **Done** — reuses KYC filter pattern |
| 84 | `886:108206` | **Populated list** — metrics `12` / `4` / `4` / `4`, table rows + pagination | Mock fixture ready (`kybListDataPopulated`) |
| 137 | `886:124831` | **Production Mode list state** — not a separate Batch Lookup workflow | Covered by shared list/environment state |
| 85–88 | `886:108577`–`886:109104` | Perform Lookup entry (single + bulk) | **Done** — `/kyb/lookup` |
| 89+ | `886:109281` … | Lookup result, detail, decision flows | Result + detail done |

**List UI elements (all list frames):**

- Header: **KYB** + subtitle **Know your Business** + **Add Business** CTA
- Metric cards: Successful verification, Pending Verification, High Risk Alert, Rejected verification
- Filter bar: Date, Status, Priorities, Batch search, More filters, Search, Export Report
- Table columns: checkbox, KYB ID, Business Name (+ type subtitle), Verification Type, Status, Country (ISO), Priority, Risk Score, Assigned To, Time in Queue, View
- Status labels: Pending / In Review / Verified / Failed
- Priority labels: Urgent / High / Medium / Standard
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
| `KybDetailPanel` | KYB detail with Business Overview, sidebar panels, and decision footer |
| `KybComplianceChecksTab` | Compliance Checks tab — cleared + flagged variants |
| `KybSanctionsMatchDetailPanel` | OFAC (sanctions) View Details expand — frame 112 |

### B — Detail screen (`/kyb/[id]`)

| Frames | Node IDs | State | Implementation |
| ------ | -------- | ----- | -------------- |
| 93 | `886:110808` | **Business Overview** — registry info, address/contact, activities, risk sidebar, decision footer | **Done** — `kyb-record-5` (TechVentures Limited, risk 0) |
| 95 | (cache `customer-kyb-95.png`) | **Business Overview high-risk** — tier risk-factor cards, Urgent priority, escalate footer | **Done** — `kyb-record-1` (TechVentures Limited, risk 4) |
| 112 | (cache `customer-kyb-112.png`) | **Compliance Checks flagged** — OFAC View Details expand, PEP/Warning flagged, escalate footer | **Done** — score 4 compliance fixture on `kyb-record-1` |
| 134 | (cache `customer-kyb-134.png`) | **Compliance Checks cleared** — all No Match / Passed + Approve footer | **Done** — score 0 on `kyb-record-5` |
| 122 | (cache `customer-kyb-122.png`) | **Business Overview cleared** — same composition as frame 93 | **Done** — covered by `kyb-record-5` |
| 115 / 135 | (cache) | **Confirm Approval** modal — risk 1 / risk 0 circular badge + verification type | **Done** — `KybApproveModal` |
| `frame-1618868336` | (cache) | **Directors PEP Match** cards — PEP Match + Verified pair | **Done** — score 1/2 directors fixture |
| 133 | (cache) | Compliance Checks cleared + **Approved** header badge | Covered — same cleared compliance + status badge |
| 88 / 91 / 119 | (cache) | Lookup entry / list variants | Covered by `/kyb/lookup` and list frame 84 |

**Detail UI elements (frame 93 — cleared baseline):**

- Header: Back, **KYB / {business}** + Pending badge, **Export Report** only (no header risk chip)
- Tabs: underline style — Business Overview, Risk Score Analysis, Directors & Officers, Shareholders, Document, Compliance Checks
- Single main card: Business Information + Address & Contact (muted inset) + Business Activities (teal soft tags)
- Sidebar: Risk analysis (Standard + Risk Score callout), Verification Status, Business Size
- Footer: Request Resubmission, Reject, Approve (escalate variant when approval blocked)

**Detail UI elements (frame 95 — high-risk overview):**

- Same header/tabs/overview card as frame 93
- Sidebar risk cards (tier label + title + body + optional metadata/action strip):
  - TIER 1 PEP — full EDD copy + `Permanent Secretary…` + Decline action
  - TIER 1 Sanctioned/Embargoed Location — Block access action
  - SANCTIONED Sanctions Screening Match — body only
  - TIER 3 Adverse Media - Low Risk — Document findings action
- No Risk Score callout / Standard chip when tier cards are shown
- Verification Priority: **Urgent**; Business Size revenue `>$5M`, Country **Multi**
- Footer: escalate-only (Approve disabled)

**Detail UI elements (frame 112 — Compliance Checks flagged):**

- AML Screening clearance **Cleared** with registry Passed rows
- Sanctions: OFAC/UN/EU/UK HMT **Flagged**; OFAC expands with match analysis + actions
- PEP + Warning and Regulatory Enforcement: **Flagged** with View Details
- Footer: escalate-only

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
- [x] KYB detail Directors & Officers tab — scores 0, 1, 2, 3, and 4 (frame-1618868336 PEP Match baseline)
- [x] KYB detail Shareholders tab — Share Capital Structure table for all risk levels
- [x] KYB detail Document tab — Submitted Documents list for all risk levels
- [x] KYB detail Compliance Checks tab — AML screening sections for all risk levels 0–4
- [x] Frame 95 high-risk Overview — tier risk cards + escalate footer (`kyb-record-1`)
- [x] Frame 112 Compliance Checks flagged — OFAC match expand + PEP/Warning View Details
- [x] Frames 115 / 135 — Confirm Approval modal (circular risk badge + verification type)
- [x] Frame 122 — cleared Business Overview (same as frame 93 baseline)
- [x] KYB detail transparent section headers — shared `KybDetailSectionHeader`
- [x] Frame 137 classified as a Production Mode list state, not a Batch Lookup route
- [x] Lookup result approval opens the KYB approval decision flow
- [x] Meaningful verification/lookup approval modal variants use typed business and risk data

## Out of scope (this unit)

- Real API integration
- Validate Document/business onboarding flow from choose-action modal — deferred
  because the WebApp page has no dedicated business-onboarding frames
- Standalone `/aml-screening` list UI (see `08-aml-screening.md`)
- Background chrome in frames 115/135 that uses alternate tab schemas (older/export variants);
  WebApp detail chrome stays frames 93/95/112
- Duplicate sandbox/production visual frames

## Related docs

- `context/feature-specs/03-kyc-compliance.md` — parallel list pattern
- `design/manifest.json` — section `886:105537`
