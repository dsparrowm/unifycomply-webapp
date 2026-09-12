# Feature Spec: Bank Analysis

**Milestone:** M2  
**Figma section:** BANK ANALYSIS (`886:161365`)  
**Status:** Unique UI closed on mocks — list aligned to frames 11 / 16

Read `AGENTS.md` before starting.

## Figma reference

- File: [Unifycomply WebApp](https://www.figma.com/design/gJgHsHV3Jt9wYKJfstVdWB/%F0%9F%AA%AAUnifycomply?node-id=886-161365)
- Section node: `886:161365`
- Full PNG cache: `design/figma/webapp/bank/` (`README.md` + `manifest.json`)
- Representative list frame (empty): `886:161366` — `Bank Analysis // 11`
- Representative list frame (populated): `886:163331` — `Bank Analysis // 16`
- Batch Lookup result: `886:164117` — `Bank Analysis // 18`
- Choose action modal: `886:164497` — Single Lookup / Batch Lookup

## Route

| Route | Purpose | Status |
| ----- | ------- | ------ |
| `/bank-analysis` | Account analysis runs list | Done — empty + populated fixtures |
| `/bank-analysis/lookup` | Perform Lookup (single + Bulk Analysis) | Done — `?mode=batch` for upload |
| `/bank-analysis/batch/[id]` | Batch Lookup result | Done — frame 18 Techventures fixture |
| `/bank-analysis/[id]` | Account analysis detail | Done — all five tabs (frame 41) |

App shell is provided by `app/(app)/layout.tsx`.

## Frame inventory (build order)

### A — List screen (`/bank-analysis`)

| Frames | Node IDs (sample) | State | Implementation |
| ------ | ----------------- | ----- | -------------- |
| 11 | `886:161366` | **Default empty list** — metrics `0`, table **No User Activity** | Done — `bankAnalysisListDataEmpty` |
| 12–15 | `886:161756` … | Filter dropdown overlays | Date / Status / Assignee / Type / More filters |
| 16 | `886:163331` | **Populated list** — metrics `20` / `8` / `12` / `3` | Done — `bankAnalysisListDataPopulated` |
| 17 | `886:163724` | Populated with Batch type rows | Covered by populated list chrome |
| 19 | `886:164497` | Choose action | Single → lookup; Batch → `lookup?mode=batch` |

**List UI elements (from this zip):**

- Header: **Bank Analysis** + subtitle **Review account analysis runs** + **Run a Check**
- Metric cards: Total screening, Total Alerts Generated, Completed, high risk alerts (empty) / high risk Entity (populated)
- Filter bar: Date, Status, Assignee, Type, More filters, Search, Export Report
- Empty columns: Run ID, Full Name, Date, Accounts, Analyst, Transactions, Alerts, Assignee, Risk Score, Status
- Populated columns: Run ID, Full Name, Date, Type, Accounts, Analyst, Assigned To, Alerts, Risk Score, Status
- Empty copy: **No User Activity**
- Choose action modal: **Single Lookup**, **Batch Lookup**

Populated list uses frame **16** columns. Empty frame **11** omits Type and uses Transactions / Assignee; the empty table keeps the 16 column set with **No User Activity**. CTA is **Run a Check**. Empty list via `?empty=1`.

### B — Batch Lookup (`/bank-analysis/batch/[id]`)

- Frame 18 (`886:164117`) — `Bank Analysis / Batch Lookup / Techventures`
- Back + breadcrumb
- Metrics `20` / `8` / `12` / `3` (fourth label **high risk Entity**)
- Filters: Date, Status, Assignee, Type, More filters, Search, Export Report
- Columns: Run ID, Full Name, Date, Type, Accounts, Assigned To, Alerts, Risk Score, Status + Eye
- Type badges: Individual / Organization
- Status badges: Flagged / Clear / In Review / Blocked
- Eye opens the existing Favour Peter Soma detail (`/bank-analysis/ba-run-1`) until more detail fixtures exist
- Pagination uses the real page count (10 rows → 1 page), not Figma’s dummy 1–10

### C — Perform Lookup (`/bank-analysis/lookup`)

- run 7–11 — Single Lookup (Figma: Country, Select app, Entity type, Select ID)
- run 12 — Bulk Analysis: Country, Select app, BVN xlsx upload, **Need a template?**, **Perform Analysis**
- Shipped single form still uses Select bank + Account Number (logged delta). Bulk Analysis is live.

### D — Detail screen (`/bank-analysis/[id]`)

- Frame 41 (`886:165268`) — `Bank Analysis / FAVOUR PETER SOMA`
- Frame 42 (`886:165806`) — high-risk Key Summary + Escalate Submission footer
- Frame 51 — Linked Entities + date menu
- Frame 54 — Account Analysis line chart
- Frame 57 — Network Intelligence
- Frame 60 — Alerts empty (**No Warning or Risk**)
- Frame 63 — Compliance (all No Match)
- Frame 68 — Decision history empty
- Detail navigation: Bank Summary, Network Intelligence, Alerts, Compliance, Decision history
- Sidebar: Risk Analysis, User Profile, Network Metrics

### E — Escalate (frames 71–72)

- Frame 42 footer: **Approval is disabled for high-risk entities. You can only escalate this details** + Escalate Submission + disabled Approve
- Frames 71–72: Escalate to Senior Officer — Risk Score **4**, Sanction **Yes**, Warnings and regulatory enforcement **Yes**
- Comments / Justification optional; placeholder **Enter**; audit-trail helper
- Cancel / Escalate Case both close; Decision history stays empty
- High-risk detail: `/bank-analysis/ba-run-1?view=high-risk` (batch Eye when risk ≥ 3)
- Default `/bank-analysis/ba-run-1` stays frame 41 (no footer)
- Modal numbers are the Figma 71 fixture, not the all-No-Match Compliance tab

### Deferred

- Export Report download (rendered; no file)
- Single Lookup field set vs run-07 (Entity type + Select ID)
- Frame 42 Key Summary account grid (4 cards + risk labels) — high-risk view still uses the frame 41 six-account portfolio

## Default data policy (v1 mock)

| Fixture | Use | Metrics |
| ------- | --- | ------- |
| `bankAnalysisListDataEmpty` | Empty list (frame 11) | All `0` |
| `bankAnalysisListDataPopulated` | **Current** `/bank-analysis` page (frame 16) | `20` / `8` / `12` / `3` |
| `getBankAnalysisBatchResult` | Any `/bank-analysis/batch/[id]` | `20` / `8` / `12` / `3` |

## Components

| Component | Purpose |
| --------- | ------- |
| `BankAnalysisPageHeader` | Title, subtitle, Run a Check CTA |
| `BankAnalysisMetricCards` | Four screening metric cards |
| `BankAnalysisFilters` | List filter bar + search + export |
| `BankAnalysisTable` | List data table or empty state |
| `BankAnalysisListPanel` | Composes list screen |
| `BankAnalysisChooseActionModal` | New Lookup action picker |
| `BankAnalysisLookupEntryPanel` | Single + Bulk Analysis entry |
| `BankAnalysisBatchResultPanel` | Composes frame 18 batch result |
| `BankAnalysisBatchResultTable` | Batch Run ID table |
| `BankAnalysisDetailPanel` | Composes frame 41 detail view |
| `BankAnalysisAccountCard` | Bank account portfolio card |
| `BankAnalysisDetailSidebar` | Risk, profile, and network cards |
| `BankAnalysisEscalateModal` | Escalate to Senior Officer (frames 71–72) |

## Acceptance — List (frames 11 + 16)

- [x] Metrics display `0` for all four cards (empty fixture)
- [x] Table shows **No User Activity** when no records
- [x] Filter bar is Date / Status / Assignee / Type / More filters
- [x] Run a Check opens choose-action modal (Single / Batch Lookup)
- [x] Populated fixture with metrics `20` / `8` / `12` / `3`
- [x] Pagination for populated rows

## Acceptance — Batch Lookup (frame 18)

- [x] Choose action Batch Lookup opens `/bank-analysis/lookup?mode=batch`
- [x] Bulk Analysis upload resolves to `/bank-analysis/batch/{slug}`
- [x] Breadcrumb `Bank Analysis / Batch Lookup / {slug}`
- [x] Metrics `20` / `8` / `12` / `3`
- [x] Table columns match frame 18
- [x] Eye opens `/bank-analysis/ba-run-1` (high-risk rows add `?view=high-risk`)

## Acceptance — Escalate (frames 42 + 71)

- [x] High-risk detail shows the escalate footer and disabled Approve
- [x] Escalate Submission opens Escalate to Senior Officer
- [x] Risk Summary shows Score 4 / Sanction Yes / Warnings Yes
- [x] Cancel and Escalate Case close the modal
- [x] Default low-risk detail has no footer

## Acceptance — Detail (frame 41)

- [x] Favour Peter Soma list row navigates to `/bank-analysis/ba-run-1`
- [x] Back link and customer breadcrumb render
- [x] Bank Summary and secondary navigation render
- [x] Six account cards render in a responsive two-column grid
- [x] Linked Entities secondary tab renders two linked entity cards
- [x] Account Analysis secondary tab renders four metrics and income/expense chart
- [x] Network Intelligence tab renders account and business relationship graph
- [x] Alerts tab renders no-warning/no-risk empty state
- [x] Compliance tab renders all five check groups and No Match states
- [x] Decision history tab renders the no-history empty state
- [x] Single Lookup modal action navigates to `/bank-analysis/lookup`
- [x] Lookup form validates bank-analysis fields and resolves to mock detail
- [x] Date-range menu opens and updates its selected option
- [x] Risk, profile, and network metric sidebar cards render

## Open design notes

- Populated frame 16 / batch 18 label the fourth metric **high risk Entity**; empty frame 11 uses **high risk alerts**. Each fixture uses its frame string.
- Empty 11 headers (no Type, Transactions / Assignee) are not used; populated 16 columns are the table contract.
- Filter dropdown **Under Review** vs table badge **In Review** — batch badges use **In Review**.
- The date-menu reference shows **Last 30 days** in the trigger while **Last month** is checked; the implementation preserves this initial visual state, then updates the trigger after the user selects an option.
- Date-menu labels **Last 3 month** and **Last 6 month** preserve the exact Figma copy on detail. List/batch Date filters use the shared month labels.
- Batch Eye always opens the Favour Peter Soma detail fixture until additional case fixtures exist. High-risk rows use `?view=high-risk`.
- Escalate modal uses frame 71 numbers even when Compliance is all No Match. Decision history stays empty after escalate.
