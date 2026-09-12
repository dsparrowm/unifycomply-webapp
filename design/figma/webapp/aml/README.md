# AML Screening design cache

Full **AML SCREENING** section export (`AML Screening // 15` … `27`, `Customer // AML // 34` … `65`, plus `verifications` variants).

| | |
| --- | --- |
| Source zip | `C:\Users\Davis\Downloads\AML.zip` |
| Cached | 2026-09-12 |
| Exported | **67** PNGs |
| Unique cached | **63** |
| Exact pixel duplicates dropped | **4** |
| Sequence gaps (not in Figma or zip) | **28–33** |

Index with per-frame status: [`manifest.json`](./manifest.json).

Stray unnamed export in the same zip: **Frame 2147226157** (Create a New Case with browser chrome) → `frame-2147226157.png`.

## Duplicates removed (not cached)

| Dropped | Identical to | File to use |
| ------- | ------------ | ----------- |
| 25 | 21 | `021.png` |
| 23 | 22 | `022.png` |
| 55 | 35 | `035.png` |
| 64 | 48 | `048.png` |

## Sequence gaps

**28–33** are not in the WebApp inventory or this zip. Numbering jumps from list frame **27** to Customer AML **34**.

## Implementation map

`/aml-screening` list, lookup, Search Result, Batch Lookup result, case detail, and Escalate to Senior Officer are implemented. KYC/KYB detail AML tabs are **not** this standalone section.

Most frames are **state variants** (filters, sandbox/production Y-row clones, tab clones), not new routes.

### Implemented

| Gap | Frames | Note |
| --- | ------ | ---- |
| **List** | 15–22 | Empty **No User Activity** + populated queue + Date / Status / Monitoring / Assignee filters |
| **Choose action** | 26, 27 | **Single Lookup** / **Batch Lookup** |
| **Create a New Case** | 44–46, 53, 54 | Single-entity matching form + CSV/Excel batch upload |
| **Search Result** | 37–43 | Match cards + Search Information sidebar |
| **Batch Lookup result** | 24 | `AML Screening / Batch Lookup / {name}` + screened / matches / no matches / errors |
| **Case detail** | 34, 47, 50, 56, 57, 60–63, `verifications` | Person + corporate tabs at `/aml-screening/[id]` |
| **Escalate** | `verifications-13` | Escalate Submission → Escalate to Senior Officer |

### Not implemented (build these)

None in this standalone AML section.

### Representative frames

| Frames | Surface |
| ------ | ------- |
| 15 | Empty list — metrics `0`, **Create a Case**, **No User Activity** |
| 16–19 | Date / Status (Clear, Flagged, Under Review, Blocked) / Monitoring (No, Yes) / Assignee |
| 20 | Populated list — metrics `14` / `5` / `5` / `12` |
| 24 | Batch Lookup result |
| 26 | Choose action |
| 44 | Create a New Case — single |
| 45 | Create a New Case — batch file + **Download Template** |
| 37, 39 | Search Result (4 cards / 1 card) |
| 34 | Person Key Summary |
| 47, 50 | Linked Entities / Additional Information |
| 56, 57, 62 | Corporate Key Summary / Linked Entities / Risk Analysis |
| `verifications.png` | Verifications — all **No Match** |
| `verifications-13.png` | Escalate to Senior Officer |

## How to use

1. Open the PNG for the frame you are building (`015.png` empty list, `020.png` populated).
2. Check `manifest.json` `status` / `gap` before treating a clone as a new screen.
3. Visual-QA the implemented route against that PNG before the next AML unit.
