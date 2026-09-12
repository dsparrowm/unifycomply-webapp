# Bank Analysis design cache

Full **BANK ANALYSIS** section export (`Bank Analysis // 11` … `19`, `Bank analysis // 41` … `72`, `Bank analysis // run // 7` … `12`).

| | |
| --- | --- |
| Source zip | `C:\Users\Davis\Downloads\Bank_Analysis.zip` |
| Cached | 2026-09-12 |
| Exported | **47** PNGs |
| Unique cached | **47** |
| Exact pixel duplicates dropped | **0** |
| Sequence gaps (not in Figma or zip) | **20–40** |

Index with per-frame status: [`manifest.json`](./manifest.json).

## Sequence gaps

**20–40** are not in the WebApp inventory or this zip. Numbering jumps from list frame **19** to detail frame **41**.

## Implementation map

`/bank-analysis` list, choose action, Single Lookup, five-tab detail, Batch Lookup result, and Escalate to Senior Officer are implemented.

Most frames are **state variants** (filters, high-risk clones, sandbox/production Y-row pairs), not new routes.

### Implemented

| Gap | Frames | Note |
| --- | ------ | ---- |
| **List** | 11–17 | Empty **No User Activity** + populated queue + Date / Status / Assignee / Type filters |
| **Choose action** | 19 | **Single Lookup** / **Batch Lookup** |
| **Perform Lookup** | run 7–12 | Single Lookup form + Bulk Analysis upload → batch result |
| **Batch Lookup result** | 18 | `Bank Analysis / Batch Lookup / {name}` + 20 / 8 / 12 / 3 |
| **Detail** | 41–70 | Bank Summary / Network Intelligence / Alerts / Compliance / Decision history |
| **Escalate** | 71, 72 | Escalate Submission → Escalate to Senior Officer |

### Not implemented (build these)

None in this standalone Bank Analysis section.

### Representative frames

| Frames | Surface |
| ------ | ------- |
| 11 | Empty list — metrics `0`, **Run a Check**, **No User Activity** |
| 12–14 | Date / Status (Clear, Flagged, Under Review, Blocked) / Assignee |
| 15–17 | Populated list — metrics `20` / `8` / `12` / `3`, Type filter |
| 18 | Batch Lookup result — Techventures |
| 19 | Choose action |
| run-07 | Perform Lookup — Single Lookup |
| run-12 | Perform Lookup — Bulk Analysis + template |
| 41 | Bank Summary Key Summary (low risk) |
| 42 | Bank Summary high-risk + Escalate Submission footer |
| 51 | Linked Entities + date menu |
| 54 | Account Analysis (line chart) |
| 57 | Network Intelligence |
| 60 | Alerts empty — **No Warning or Risk** |
| 63 | Compliance — all **No Match** |
| 68 | Decision history empty |
| 71 | Escalate to Senior Officer |

### Known Figma ↔ list deltas

The list was first built from inferred table headers. This zip is the contract:

- Empty **11** columns: Run ID, Full Name, Date, Accounts, Analyst, Transactions, Alerts, Assignee, Risk Score, Status
- Populated **16** columns: Run ID, Full Name, Date, Type, Accounts, Analyst, Assigned To, Alerts, Risk Score, Status
- Batch **18** columns: Run ID, Full Name, Date, Type, Accounts, Assigned To, Alerts, Risk Score, Status (no Analyst)
- Filters: Date, Status, Assignee, Type, More filters — not Priorities / Banks
- Header CTA: **Run a Check** (not **New Lookup**)
- Status values: Clear / Flagged / In Review / Blocked (filter label **Under Review**)
- Fourth metric: **high risk alerts** on 11, **high risk Entity** on 16 / 18

The list matches frame **16**. Empty **11** headers (Transactions / no Type) are not used. Batch result matches frame **18**.

## How to use

1. Open the PNG for the frame you are building (`011.png` empty list, `016.png` populated, `018.png` batch).
2. Check `manifest.json` `status` / `gap` before treating a clone as a new screen.
3. Visual-QA the implemented route against that PNG before the next Bank Analysis unit.
