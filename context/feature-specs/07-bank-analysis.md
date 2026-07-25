# Feature Spec: Bank Analysis

**Milestone:** M2  
**Figma section:** BANK ANALYSIS (`886:161365`)  
**Status:** In progress — list and all five detail tabs implemented

Read `AGENTS.md` before starting.

## Figma reference

- File: [Unifycomply WebApp](https://www.figma.com/design/gJgHsHV3Jt9wYKJfstVdWB/%F0%9F%AA%AAUnifycomply?node-id=886-161365)
- Section node: `886:161365`
- Representative list frame (empty): `886:161366` — `Bank Analysis // 11`
- Representative list frame (populated): `886:163331` — `Bank Analysis // 16`
- Choose action modal: `886:164497` — Single Lookup / Batch Lookup

## Route

| Route | Purpose | Status |
| ----- | ------- | ------ |
| `/bank-analysis` | Account analysis runs list | Done — empty + populated fixtures |
| `/bank-analysis/[id]` | Account analysis detail | Done — Bank Summary (frame 41) |
| `/bank-analysis/lookup` | Single bank lookup entry | Done — KYB lookup UI pattern |

App shell is provided by `app/(app)/layout.tsx`.

## Frame inventory (build order)

### A — List screen (`/bank-analysis`)

| Frames | Node IDs (sample) | State | Implementation |
| ------ | ----------------- | ----- | -------------- |
| 11 | `886:161366` | **Default empty list** — metrics `0`, table **No User Activity** | Done — `bankAnalysisListDataEmpty` |
| 12–15 | `886:161756` … | Filter dropdown overlays | Done — Date, Status, Priorities, Banks, More filters |
| 16 | `886:163331` | **Populated list** — metrics `20` / `8` / `12` / `3`, table rows + pagination | Done — `bankAnalysisListDataPopulated` |
| 40+ | `886:165268` … | Choose action modal, detail, batch lookup | Single lookup entry and detail tabs done; batch deferred |

**List UI elements:**

- Header: **Bank Analysis** + subtitle **Review account analysis runs** + **New Lookup** CTA
- Metric cards: Total screening, Total Alerts Generated, Completed, high risk alerts
- Filter bar: Date, Status, Priorities, Banks, More filters, Search, Export Report
- Table columns (inferred from frame layout — header text lives in Figma component instances): Analysis ID, Entity Name, Account Number, Bank, Country, Status, Alerts, Risk Score, Priority, Date Run
- Empty copy: **No User Activity** (exact Figma string)
- Choose action modal: **Single Lookup**, **Batch Lookup**

### B — Detail screen (`/bank-analysis/[id]`)

- Frame 41 (`886:165268`) — `Bank Analysis / FAVOUR PETER SOMA`
- Frame 42 (`886:165806`) — Linked Entity summary state
- Frame 46 (`886:167990`) — Account Analysis summary state
- Network Intelligence — user-provided reference screenshot; exact node pending MCP quota reset
- Alerts empty state — user-provided reference screenshot; exact node pending MCP quota reset
- Compliance — user-provided reference screenshot; exact node pending MCP quota reset
- Decision history — user-provided reference screenshot; exact node pending MCP quota reset
- Detail navigation: Bank Summary, Network Intelligence, Alerts, Compliance, Decision history
- Bank Summary: Key Summary / Linked Entity / Account Analysis controls
- Six-account portfolio grid with account tier, type, status, balance, transactions, activity, and risk
- Linked Entities: relationship cards, shared accounts, bank account, balance, tier, activity
- Account Analysis: transaction/credit/debit/net metrics and monthly financial report
- Network Intelligence: responsive customer-to-bank/entity relationship graph
- Alerts: no-warning/no-risk empty state with date-range control
- Compliance: transaction threshold, PEP, sanctions, enforcement, and watchlist checks
- Decision history: empty state for entities without escalated review or supplementary data
- Sidebar: Risk Analysis, User Profile, Network Metrics

### Deferred

- Batch lookup sub-route (`Bank Analysis / Batch Lookup / Techventures`, frame 18)
- Export Report download (rendered disabled in mock-data detail)

## Default data policy (v1 mock)

| Fixture | Use | Metrics |
| ------- | --- | ------- |
| `bankAnalysisListDataEmpty` | Empty list (frame 11) | All `0` |
| `bankAnalysisListDataPopulated` | **Current** `/bank-analysis` page (frame 16) | `20` / `8` / `12` / `3` |

## Components

| Component | Purpose |
| --------- | ------- |
| `BankAnalysisPageHeader` | Title, subtitle, New Lookup CTA |
| `BankAnalysisMetricCards` | Four screening metric cards |
| `BankAnalysisFilters` | Filter bar + search + export |
| `BankAnalysisTable` | Data table or empty state |
| `BankAnalysisListPanel` | Composes list screen |
| `BankAnalysisChooseActionModal` | New Lookup action picker |
| `BankAnalysisDetailPanel` | Composes frame 41 detail view |
| `BankAnalysisAccountCard` | Bank account portfolio card |
| `BankAnalysisDetailSidebar` | Risk, profile, and network cards |
| `BankAnalysisLookupEntryPanel` | Single verification entry using KYB lookup layout |

## Acceptance — List (frames 11 + 16)

- [x] Metrics display `0` for all four cards (empty fixture)
- [x] Table shows **No User Activity** when no records
- [x] Filter bar renders per Figma
- [x] New Lookup opens choose-action modal (Single / Batch Lookup)
- [x] Populated fixture with metrics `20` / `8` / `12` / `3`
- [x] Pagination for populated rows

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
- [x] Bulk Verification remains visibly disabled until its result design is implemented
- [x] Date-range menu opens and updates its selected option
- [x] Risk, profile, and network metric sidebar cards render

## Open design notes

- Populated frame 16 labels the fourth metric **high risk Entity**; empty frame 11 uses **high risk alerts**. Implementation uses the frame 11 string until design confirms a single canonical label.
- Exact table header strings are inside Figma table component instances and were not exported via MCP at build time; column set matches frame 16 layout widths.
- The date-menu reference shows **Last 30 days** in the trigger while **Last month** is checked; the implementation preserves this initial visual state, then updates the trigger after the user selects an option.
- Date-menu labels **Last 3 month** and **Last 6 month** preserve the exact Figma copy.
