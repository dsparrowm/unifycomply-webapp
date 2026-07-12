# Feature Spec: KYC Compliance

**Milestone:** M2  
**Figma section:** KYC COMPLIANCE (`886:53858`)  
**Status:** In progress — list, lookup, detail, and populated list default

Read `AGENTS.md` before starting.

## Figma reference

- File: [Unifycomply WebApp](https://www.figma.com/design/gJgHsHV3Jt9wYKJfstVdWB/%F0%9F%AA%AAUnifycomply?node-id=886-53858)
- Section node: `886:53858`
- Representative list frame (empty): `886:70409` — `Customer // KYC // 79`
- Representative list frame (populated): `886:73019` — `Customer // KYC // 86`

The KYC section contains **78 frames** (`Customer // KYC // 79` … `156`). Frames are state variants and flow steps — not separate routes. Implement behaviour as UI states, not 78 pages.

## Route

| Route | Purpose | Status |
| ----- | ------- | ------ |
| `/kyc` | KYC customer list | Done — populated default (frame 86); empty fixture reserved |
| `/kyc/[id]` | Verification detail / dashboard | Done — tabs + decision modals |
| `/kyc/lookup` | Perform lookup (BVN, etc.) | Done — entry + result (frames 90–94) |

App shell is provided by `app/(app)/layout.tsx`.

## Frame inventory (build order)

### A — List screen (`/kyc`)

| Frames | Node IDs (sample) | State | Implementation |
| ------ | ----------------- | ----- | -------------- |
| 79 | `886:70409` | **Default empty list** — metrics `0`, table shows **"No User Activity"** | **Done** — default mock + page |
| 80 | `886:70782` | Date filter dropdown open (empty list) | **Done** |
| 81 | `886:71156` | Status filter dropdown open | **Done** |
| 82 | `886:71529` | Priorities filter dropdown open | **Done** |
| 83 | `886:71902` | Single entity dropdown — **Single entity search** / **Bulk search** | **Done** |
| 84–85 | `886:72275`, `886:72648` | More filters / combined filter menus | **Done** (high-risk option) |
| 86 | `886:73019` | **Populated list** — metrics `12` / `6` / `2` / `1`, table rows + pagination | Mock fixture ready (`kycListDataPopulated`) |
| 87–90 | `886:73375` … `886:74524` | List variants (production banner, row interactions) | Not started |
| 115 | `886:81117` | List with **Perform Lookup** tab/action visible | **Done** — Add Customer choose-action modal |

**List UI elements (all list frames):**

- Header: **KYC** + subtitle **Know your customers** + **Add Customer** CTA
- Metric cards: Successful verification, Pending Verification, High Risk Alert, Rejected verification
- Filter bar: Date, Status, Priorities, Single entity, More filters, Search, Export Report
- Table columns: KYC ID, Customer Name, Document Type, Country, Status, Priority, Risk Score, Time in Queue
- Empty copy: **No User Activity** (exact Figma string)

### B — Perform lookup

| Frames | Node IDs (sample) | State | Implementation |
| ------ | ----------------- | ----- | -------------- |
| 91 | `886:74699` | BVN lookup results — tabs, BVN card, summary panel, footer actions | **Done** — `/kyc/lookup/result` |
| 92–94 | `886:74948` … `886:75456` | BVN lookup + address information tab | In progress — address tab (frame 92) |
| 109 | `886:79838` | Bulk verification entry — Batch Name, Bulk Upload (xlsx) | **Done** — bulk mode on `/kyc/lookup` |
| 110–114 | `886:80028` … `886:80735` | Lookup type dropdown menus | **Done** — entry form lookup type dropdown |

### C — Verification detail (`/kyc/[id]`)

| Frames | Node IDs (sample) | State | Implementation |
| ------ | ----------------- | ----- | -------------- |
| 96–100 | `886:76212` … `886:77640` | Detail: **National ID + Selfie** — e.g. FAVOUR PETER SOMA; risk summary | **Done** — frame 96 aligned to reference screenshot |
| 101–108 | `886:77994` … `886:79601` | Screening: **No matches found**, **No Mask Detected** | **Done** — AML + liveness tab panels |
| 116–123 | `886:86959` … `886:89201` | Detail variants (sandbox/production rows) | Not started |
| 124–156 | `886:89439` … `886:99713` | Approve / reject / escalate / review branches | **Done** — footer actions + confirmation modals |
| 143 | `886:96317` | Full scrollable detail (tall frame — all sections) | Reference for detail layout |

Detail frames repeat at multiple Y offsets in Figma (`771`, `3214`, `5657`, `8158`, `10558`, `13059`, `15963`) — same flows in sandbox vs production / workflow branches.

### Risk score model (0–4)

KYC uses the same **0–4 risk score scale** as Settings → Approvals (`maxScore: 4`). The numeric score is the source of truth — not a separate tier enum or route.

| Score | Label | Tab UI behaviour |
| ----- | ----- | ---------------- |
| 0 | No Risk | All checks pass; AML cleared; approve immediately |
| 1 | Low Risk | Minor flag (e.g. possible PEP); light EDD note |
| 2 | Moderate Risk | Warning threshold; some checks fail; manual review |
| 3 | High Risk | PEP/sanctions flagged; approval blocked |
| 4 | Very High | Multiple failures; escalate; approval blocked |

- **List + detail** share `riskScore` on `KycRecord` / `KycDetail` (0–4).
- **Tab panels** are data-driven: `lib/data/kyc-detail.ts` provides per-score fixtures; `lib/kyc/risk-score.ts` supplies labels and threshold helpers aligned to Settings.
- **Footer actions**: approve disabled when `riskScore >= approvalBlockThreshold` (default 3); warning copy at `>= warningThreshold` (default 2).
- **High-risk list filter** (`More filters → High risk`) matches scores `>= approvalBlockThreshold`.

### D — Modals and actions (cross-cutting)

Document per frame when implementing detail (frames 124+):

- Approve / reject / escalate confirmations
- Document review states
- Risk factor panels ("No risk factors. All checks passed. Approve immediately")

## Default data policy (v1 mock)

| Fixture | Use | Metrics |
| ------- | --- | ------- |
| `kycListDataEmpty` | Empty list after Add Customer flow (frame 79) | All `0` |
| `kycListDataPopulated` | **Current** `/kyc` page (frame 86) | `12` / `6` / `2` / `1` |

Do not show populated list until Add Customer or lookup flow adds records (future units).

**Current dev default:** `/kyc` uses `kycListDataPopulated` (frame 86) for M2 development.
`kycListDataEmpty` remains the post–Add Customer empty-state fixture.

## Components

| Component | Purpose |
| --------- | ------- |
| `KycPageHeader` | Title, subtitle, Add Customer |
| `KycMetricCards` | Four verification metric cards |
| `KycFilters` | Filter bar + search + export |
| `KycTable` | Data table or empty state |
| `KycPagination` | Table pagination (populated only) |
| `KycListPanel` | Composes list screen |
| `KycDetailPanel` | Verification detail dashboard |
| `KycDetailHeader` | Back link, breadcrumb, Export Report CTA |
| `KycDetailTabs` | Section tabs (document, risk, AML, etc.) |
| `KycRiskAnalysisPanel` | Risk score analysis tab |
| `KycAmlScreeningPanel` | AML screening tab with clear-state banner |
| `KycIpDevicePanel` | IP and device fingerprint tab |
| `KycLivenessPanel` | Liveness detection tab |
| `KycDetailFooterActions` | Approve / reject / escalate footer actions |
| `KycApproveModal` / `KycRejectModal` / `KycEscalateModal` | Verification decision confirmations |
| `KycDocumentViewer` | ID Front / Back / Selfie viewer |
| `KycExtractedInformation` | OCR extracted fields |
| `KycRiskAnalysisCard` | Risk score summary |
| `KycBiometricVerification` | Match score + liveness |
| `KycVerificationTimeline` | Verification events |
| `KycChooseActionModal` | Add Customer action picker (Perform Lookup, Validate Document) |
| `KycLookupEntryPanel` | Perform Lookup verification form |
| `KycLookupResultPanel` | BVN lookup results with tabs and footer actions |
| `KycStatusBadge` / `KycPriorityBadge` | Table cell badges |

## Acceptance — List empty state (frame 79)

- [x] Metrics display `0` for all four cards
- [x] Table shows **No User Activity** when no records
- [x] Filter bar renders per Figma (interactions deferred)
- [x] Add Customer button visible (flow deferred)
- [x] Filter dropdown overlays (frames 80–85)
- [x] Populated list fixture wired for M2 development (`kycListDataPopulated` on `/kyc`)
- [x] TypeScript clean
- [x] progress-tracker updated

## Out of scope (this unit)

- Real API integration

## Related docs

- `design/manifest.json` — frame `886:70409` (empty), `886:73019` (populated)
- `context/ui-context.md` — tokens from KYC list frame `886:70409`
