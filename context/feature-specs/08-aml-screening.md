# Feature Spec: AML Screening

**Milestone:** M2  
**Figma section:** AML SCREENING (`886:134392`)  
**Status:** Complete — standalone list, lookup/batch, detail, case, and escalation

Read `AGENTS.md` before starting.

## Figma reference

- File: [Unifycomply WebApp](https://www.figma.com/design/gJgHsHV3Jt9wYKJfstVdWB/%F0%9F%AA%AAUnifycomply?node-id=886-134392)
- Section node: `886:134392`

## Route

| Route | Purpose | Status |
| ----- | ------- | ------ |
| `/aml-screening` | Standalone AML screening list | Done |
| `/aml-screening/create-case` | Create a New Case search form (frame 44) | Done |
| `/aml-screening/search-results` | Search Results after Create Case Search | Done |
| `/aml-screening/lookup` | Single and batch screening entry | Done |
| `/aml-screening/batch` | Batch screening result | Done |
| `/aml-screening/[id]` | Screening detail, matching, case, and escalation | Done |

App shell is provided by `app/(app)/layout.tsx`.

## Related implementation (not this route)

AML screening content already exists as detail-tab panels:

- KYC detail — `KycAmlScreeningPanel` on `/kyc/[id]`
- KYB detail — `KybComplianceChecksTab` on `/kyb/[id]`

This spec covers the **standalone** AML SCREENING section from the sidebar.

## Frame inventory

| Frames | Representative nodes | Workflow |
| ------ | -------------------- | -------- |
| 15–21 | `886:134393`–`886:136693` | Empty/populated list, filters, and table states |
| 22–24 | `886:137074`–`886:137836` | Lookup and batch screening result |
| 25–27 | `886:138220`–`886:139364` | Single/Batch choose-action states |
| 34–43 | `886:140127`–`886:142750` | Customer AML detail and matching states |
| 44–65 | `886:143125`–`886:152743` | Matching configuration, Create Case, and decisions |
| Verifications | `886:145527`–`886:153253` | Senior Officer escalation states |

Duplicate sandbox/production frames do not require separate components. Each distinct
workflow and meaningful empty, populated, risk, decision, and escalation state does.

## Components

| Component | Purpose |
| --------- | ------- |
| `AmlScreeningPageHeader` | Title, Figma subtitle, **Create a Case** → `/aml-screening/create-case` |
| `AmlCreateCasePanel` | Figma Create a New Case form + Search By rail |
| `AmlEntityTypeMultiSelect` | Create-case Entity Type multi-select (Select All / Person / Organization / Aircraft / Vessel) |
| `AmlCreateCaseSearchByRail` | Relevance / Entity Type / Database filters |
| `AmlSearchResultsPanel` | Search Results list, match-status actions, pagination |
| `AmlSearchResultsRail` | Search Information / Filters rail |
| `AmlScreeningFilters` | Date / Status / Monitoring / Assignee / More filters + Search + Export Report |
| `AmlScreeningTable` | Figma columns (checkbox, AML ID, Full Name, Date & Time, Type, Initiated By, Risk Score, Assigned To, Status, Active Monitoring) |
| `AmlScreeningListPanel` | Composes list screen |
| `AmlScreeningChooseActionModal` | Single/Batch screening picker |
| `AmlScreeningLookupPanel` | Single and batch screening form |
| `AmlScreeningBatchPanel` | Batch screening result |
| `AmlScreeningDetailPanel` | Detail chrome + tabbed content + Search Information rail |
| `AmlDetailHeader` | Back, breadcrumb, Export Report |
| `AmlDetailPrimaryTabs` / `AmlDetailSummaryTabs` | Primary + Data Summary secondary tabs |
| `AmlSearchInformationRail` | Right-rail match summary (photo placeholder, score, databases) |
| `AmlKeySummaryPanel` | Key Summary field list |
| `AmlLinkedEntitiesPanel` | Linked Entities relationship/name rows |
| `AmlAdditionalInformationPanel` | Additional information source links (e.g. Twitter) |
| `AmlVerificationsPanel` | PEP / Sanctions / Warning / Insolvency sections |
| `AmlDetailActions` | Clear / Create Case / Escalate |
| `AmlCreateCaseModal` | Create a compliance case from a match |
| `AmlEscalateModal` | Escalate a screening to a Senior Officer |

## List UI (Figma frames 15–21)

Aligned to `design/figma/webapp/aml/list-15.png` / `aml-list-16.png`:

- Subtitle: “Review aml screening and monitoring”
- Metrics: TOTAL SCREENING, ACTIVE MONITORING, CLEAR STATUS, BLOCKED
- Filters: Date, Status, Monitoring, Assignee, More filters; Search; Export Report
- Status vocabulary: Flagged, Clear, In Review, Blocked (+ Escalated / Case Created for post-decision)
- Screening type: Batch / Automatic / Manual
- Empty copy: “No User Activity”
- **Create a Case** opens `/aml-screening/create-case` (Figma Create a New Case form). Single/Batch lookup remains at `/aml-screening/lookup` via choose-action when needed.

## Detail UI (Figma frame 34+)

Chrome aligned to `design/figma/webapp/aml/detail-34.png`:

- Breadcrumb `AML Screening / ENTITY` + Export Report (disabled mock)
- Primary tabs: Data Summary · Verifications · Sources · Warning and regulatory enforcement · Risk Analysis · Decision history
- Data Summary secondary: Key Summary · Linked Entities · Additional information + Active Monitoring toggle
- Persistent **Search Information** rail (avatar initials placeholder, Match Successful/Clear, score, databases, country, risk engine)
- Verifications: PEP / Sanctions (OFAC·UN·EU·UK) / Warning / Insolvency with Match / No Match
- Linked Entities: relationship/name rows per `aml-linked-entities.png` (Partner, Father, Mother, Spouse, Sibling×3, Child×3)
- Additional information: source heading + external link per `aml-additional-information.png` (Twitter → Joe Biden)
- Sources / Warning / Risk Analysis: placeholder panels pending Figma frames
- Decision Actions footer retained (Clear / Create Case / Escalate); detail Create Case remains a decision modal (not frame 44)

## Create a New Case (Figma frame 44)

Aligned to `design/figma/webapp/aml/create-case-44.png`:

- Back + Create a New Case + Active Monitoring
- Form: Full Name, DOB/Incorporation (DD/MM/YYYY), Entity Type, Biometric upload (Jpeg/Png), Unique Identifier, Country, Custom Risk Engine
- Exact Match: Match Score checkbox + slider (default 70%), Exact Match checkbox
- Advance Configuration: Match AKAs / Match RCA toggles
- Clear + Search (mock Search → `/aml-screening/search-results`)
- Search By * rail: Relevance, Entity Type, Database (Select All + lists)

## Search Results (post Create Case Search)

Aligned to `design/figma/webapp/aml/search-results.png`:

- Back → create-case; breadcrumb `Search Result / {QUERY}`
- Active Monitoring toggle
- No of Records, Change Match Status, Save (enabled when selection + status)
- Result cards: Match Score, Risk Score, Name, Match Status, Database, Relevance, DOB, avatar
- Pagination
- Right rail: Search Information (photo + Match Successful + fields; flagged DB red dot) / Filters placeholder
- Name links to screening detail

## Default data policy (v1 mock)

Use typed fixtures in `lib/data/aml-screening.ts`. Include empty and populated list
states, one single-screening detail, one batch result, and decision-history entries.

## Acceptance

- [x] List screen covers empty/populated metrics, filters, search, table, and pagination
- [x] List header, metrics, filters, and table columns match Figma frames 15–21
- [x] Choose action routes to working Single and Batch screening entry flows
- [x] Batch screening result covers successful, review, and high-risk records
- [x] List rows navigate to a typed screening detail
- [x] Detail chrome matches Figma tabs + Search Information rail (frame 34)
- [x] Detail supports Create Case and Senior Officer escalation
- [x] Nav and deep links remain RBAC + M2 gated
- [x] TypeScript clean
- [x] progress-tracker updated

## Out of scope (this unit)

- Real API integration
- Replacing KYC/KYB detail AML tab panels
- Duplicate sandbox/production visual frames
- Full Sources / Warning / Risk Analysis content parity
- Real match-photo assets (initials placeholder used)

## Related docs

- `context/feature-specs/03-kyc-compliance.md` — KYC detail AML tab
- `context/feature-specs/04-kyb-compliance.md` — KYB compliance checks tab
- `design/manifest.json` — section `886:134392`
