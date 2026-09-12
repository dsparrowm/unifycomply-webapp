# Feature Spec: AML Screening

**Milestone:** M2  
**Figma section:** AML SCREENING (`886:134392`)  
**Status:** List + Create a Case + Search Result + Batch Lookup + Case detail + Escalate done

Read `AGENTS.md` before starting.

## Figma reference

- File: [Unifycomply WebApp](https://www.figma.com/design/gJgHsHV3Jt9wYKJfstVdWB/%F0%9F%AA%AAUnifycomply?node-id=886-134392)
- Section node: `886:134392`
- **Full cache:** `design/figma/webapp/aml/` — 63 unique / 67 exported from `AML.zip` (2026-09-12). Index: `aml/README.md` + `aml/manifest.json`.
- Representative empty list: `aml/015.png` — `AML Screening // 15` (`886:134393`)
- Representative populated list: `aml/020.png` — `AML Screening // 20` (`886:136312`)
- Batch Lookup result: `aml/024.png` — `AML Screening // 24` (`886:137836`)
- Detail: `aml/034.png` — `Customer // AML // 34` (`886:140127`) — **AML Screening / FAVOUR PETER SOMA**

Sequence gaps not in Figma or zip: **28–33**. Pixel dups dropped: 25=21, 23=22, 55=35, 64=48.

## Route

| Route | Purpose | Status |
| ----- | ------- | ------ |
| `/aml-screening` | Standalone AML list | Done — empty (`?empty=1`) + populated (frame 20) |
| `/aml-screening/lookup` | Create a New Case (single + batch) | Done — frames 44–46 / 45 (`?mode=batch`) |
| `/aml-screening/lookup/result` | Search Result | Done — frames 37 / 39 (`?view=single`) |
| `/aml-screening/batch/[id]` | Batch Lookup result | Done — frame 24 (`/aml-screening/batch/techventures`) |
| `/aml-screening/[id]` | Case detail | Done — person `favour-peter-soma` (034) + corporate `meridian-trading?kind=corporate` (056) |

App shell is provided by `app/(app)/layout.tsx`. Planned routes are not created until each unit is built.

## Related implementation (not this route)

AML screening content already exists as detail-tab panels:

- KYC detail — `KycAmlScreeningPanel` on `/kyc/[id]`
- KYB detail — `KybComplianceChecksTab` on `/kyb/[id]`

This spec covers the **standalone** AML SCREENING section from the sidebar.

## List UI (frames 15 + 20)

- Header: **AML Screening** + subtitle **Review aml screening and monitoring** + **Create a Case**
- Metrics: Total Screening, Active Monitoring, Clear Status, Blocked
- Empty metrics `0` / populated `14` / `5` / `5` / `12`
- Filters: Date, Status (Clear, Flagged, Under Review, Blocked), Monitoring (No, Yes), Assignee, More filters, Search, Export Report
- Columns: AML ID, Customer Name, Date, Type (Batch / Automatic / Manual), Initiated By, Risk Score, Assigned To, Status, Active Monitoring
- Empty copy: **No User Activity**
- Create a Case opens Choose action — **Single Lookup** / **Batch Lookup** (frames 26–27)

## Create a New Case (frames 26, 44, 45)

- **Create a Case** → `AmlChooseActionModal` — compact **Single Lookup** / **Batch Lookup** rows
- `/aml-screening/lookup` — single form (Full Name, DOB, Entity Type, Unique Identifier, biometric Jpeg/Png, risk engine, country, Match Score 70%, Match AKA / RCA, Search By)
- `/aml-screening/lookup?mode=batch` — File Name, CSV/Excel upload, Download Template
- Single **Search** opens `/aml-screening/lookup/result`

## Search Result (frames 37–43)

- Breadcrumb **Search Result / {name}** + Active Monitoring
- Match cards: Match Score, Risk Score, Name, Relevance, Match Status, DOB, Database
- Selecting a card shows **Change Match Status** (No Match / Potential Match / Match / False Positive / True Positive) + **Save**
- Sidebar: **Search Information** + **Filters** (Clear / Apply)
- Default 4-card grid (037). `?view=single` is the 1-card photo state (038 / 039)

## Case detail (frames 34, 47, 50, 56, 57, 60–63, verifications)

- `/aml-screening/favour-peter-soma` — person Key Summary (034), Linked Entities (047), Additional Information Twitter (050)
- `/aml-screening/meridian-trading?kind=corporate` — corporate Key Summary (056), linked table (057), OFAC sources (060)
- Top tabs: Data Summary / Verifications / Sources / Warning and regulatory enforcement / Risk Analysis / Decision history
- Persistent Search Information sidebar; Active Monitoring on the content card
- Warning empty: **No Warning and Regulatory Enforcement Found**
- Decision history empty: **This entity has no escalated review procedures or supplementary data.**
- Footer reuses `KycDetailFooterActions` (approval blocked). **Escalate Submission** opens `AmlEscalateModal` (frame `verifications-13`)
- List person Eye and batch entity Eye open this route (`?kind=corporate` for corporate)

## Batch Lookup result (frame 24)

- Breadcrumb **AML Screening / Batch Lookup / {slug}**
- Metrics: Total Screened 14 / Matches Found 8 / No Matches 3 / Errors 3
- Columns: AML ID, Customer Name, Type (Corporate / Individual), Country (NG / GH), Matches, Risk Score, Assigned To, Status, Monitoring
- Batch Create a Case **Search** and list Batch-row Eye open `/aml-screening/batch/{slug}`
- Entity Eye opens case detail (`person` or `?kind=corporate`)

## Build next (from 2026-09-12 cache)

1. Empty + populated list + filters (15–22) — **Done**
2. Choose action (26) + Create a New Case single (44) + batch upload (45) — **Done**
3. Search Result (37 / 39) — **Done**
4. Batch Lookup result (24) — **Done**
5. Case detail person + corporate tabs (34, 47, 50, 56, 62, verifications) — **Done**
6. Escalate to Senior Officer (`verifications-13`) — **Done**

## Components (planned)

| Component | Purpose |
| --------- | ------- |
| `AmlPageHeader` | Title, subtitle, Create a Case |
| `AmlMetricCards` | Four muted icon-left metric cards |
| `AmlFilters` | Date / Status / Monitoring / Assignee / More filters + search |
| `AmlTable` | Screening results list or **No User Activity** |
| `AmlListPanel` | Composes list screen |
| `AmlChooseActionModal` | Single Lookup / Batch Lookup |
| `AmlCreateCasePanel` | Create a New Case form + Search By sidebar |
| `AmlSearchResultPanel` | Search Result cards + Search Information / Filters |
| `AmlBatchResultPanel` | Batch Lookup result metrics + entity table |
| `AmlCaseDetailPanel` | Case detail tabs + Search Information sidebar + footer |
| `AmlEscalateModal` | Escalate to Senior Officer — risk summary + comments |

## Default data policy (v1 mock)

| Fixture | Use | Metrics |
| ------- | --- | ------- |
| `amlListDataEmpty` | `?empty=1` (frame 15) | All `0` |
| `amlListDataPopulated` | **Current** `/aml-screening` (frame 20) | `14` / `5` / `5` / `12` |

## Acceptance — placeholder (current)

- [x] Route `/aml-screening` resolves (no 404)
- [x] Placeholder panel with title and coming-soon copy
- [x] Nav link enabled at M2 with RBAC + milestone gating
- [x] Full section PNG cache + manifest

## Acceptance — full list

- [x] List screen matches Figma AML SCREENING section (`015` / `020`)
- [x] Filters and table with mock data
- [x] TypeScript clean
- [x] progress-tracker updated
- [x] Create a Case opens Choose action
- [x] Single + batch Create a New Case at `/aml-screening/lookup`
- [x] Search Result at `/aml-screening/lookup/result`
- [x] Batch Lookup result at `/aml-screening/batch/[id]`
- [x] Case detail at `/aml-screening/[id]` (person + corporate tabs)
- [x] Escalate Submission opens Escalate to Senior Officer (`verifications-13`)

## Out of scope (this unit)

- Real API integration (no OpenAPI for AML)
- Replacing KYC/KYB detail AML tab panels
- Adding a **Batch Screening** sidebar item until design confirms it is a separate route (frame 15 shows it; frame 24 is Batch Lookup under `/aml-screening`)

## Related docs

- `context/feature-specs/03-kyc-compliance.md` — KYC detail AML tab
- `context/feature-specs/04-kyb-compliance.md` — KYB compliance checks tab
- `design/manifest.json` — section `886:134392`
- `design/figma/webapp/aml/README.md`
