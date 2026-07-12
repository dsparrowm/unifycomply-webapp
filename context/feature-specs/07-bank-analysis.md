# Feature Spec: Bank Analysis

**Milestone:** M2  
**Figma section:** BANK ANALYSIS (`886:161365`)  
**Status:** In progress — list screen implemented

Read `AGENTS.md` before starting.

## Figma reference

- File: [Unifycomply WebApp](https://www.figma.com/design/gJgHsHV3Jt9wYKJfstVdWB/%F0%9F%AA%AAUnifycomply?node-id=886-161365)
- Section node: `886:161365`
- Representative list frame (empty): `886:161366` — `Bank Analysis // 11`
- Representative list frame (populated): `886:163331` — `Bank Analysis // 16`
- Choose action modal: `886:165268` area — Single Lookup / Batch Lookup

## Route

| Route | Purpose | Status |
| ----- | ------- | ------ |
| `/bank-analysis` | Account analysis runs list | Done — empty + populated fixtures |

App shell is provided by `app/(app)/layout.tsx`.

## Frame inventory (build order)

### A — List screen (`/bank-analysis`)

| Frames | Node IDs (sample) | State | Implementation |
| ------ | ----------------- | ----- | -------------- |
| 11 | `886:161366` | **Default empty list** — metrics `0`, table **No User Activity** | Done — `bankAnalysisListDataEmpty` |
| 12–15 | `886:161756` … | Filter dropdown overlays | Done — Date, Status, Priorities, Banks, More filters |
| 16 | `886:163331` | **Populated list** — metrics `20` / `8` / `12` / `3`, table rows + pagination | Done — `bankAnalysisListDataPopulated` |
| 40+ | `886:165268` … | Choose action modal, detail, batch lookup | Modal done; lookup/detail deferred |

**List UI elements:**

- Header: **Bank Analysis** + subtitle **Review account analysis runs** + **New Lookup** CTA
- Metric cards: Total screening, Total Alerts Generated, Completed, high risk alerts
- Filter bar: Date, Status, Priorities, Banks, More filters, Search, Export Report
- Table columns (inferred from frame layout — header text lives in Figma component instances): Analysis ID, Entity Name, Account Number, Bank, Country, Status, Alerts, Risk Score, Priority, Date Run
- Empty copy: **No User Activity** (exact Figma string)
- Choose action modal: **Single Lookup**, **Batch Lookup**

### Deferred (not M2 list scope)

- Detail view (`Bank Analysis/ FAVOUR PETER SOMA`, frame 41+)
- Batch lookup sub-route (`Bank Analysis / Batch Lookup / Techventures`, frame 18)
- Single lookup entry form

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

## Acceptance — List (frames 11 + 16)

- [x] Metrics display `0` for all four cards (empty fixture)
- [x] Table shows **No User Activity** when no records
- [x] Filter bar renders per Figma
- [x] New Lookup opens choose-action modal (Single / Batch Lookup)
- [x] Populated fixture with metrics `20` / `8` / `12` / `3`
- [x] Pagination for populated rows

## Open design notes

- Populated frame 16 labels the fourth metric **high risk Entity**; empty frame 11 uses **high risk alerts**. Implementation uses the frame 11 string until design confirms a single canonical label.
- Exact table header strings are inside Figma table component instances and were not exported via MCP at build time; column set matches frame 16 layout widths.
