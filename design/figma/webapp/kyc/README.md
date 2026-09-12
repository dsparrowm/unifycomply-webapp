# KYC design cache

Full **KYC COMPLIANCE** section export (`Customer // KYC // 79` … `156`), plus stray **157** from the KYB zip.

| | |
| --- | --- |
| Source zip | `C:\Users\Davis\Downloads\🪪Unifycomply (3).zip` |
| Cached | 2026-09-12 |
| Exported | **78** PNGs |
| Unique cached | **74** from the (3).zip (`079.png` … `156.png`, skipping exact dups) + **157** from the (4).zip |
| Exact pixel duplicates dropped | **4** (same SHA256) |
| Wholly missing screens | **0** — every unique frame has a cached PNG |

Index with per-frame status: [`manifest.json`](./manifest.json).

## Duplicates removed (not cached)

| Dropped | Identical to | File to use |
| ------- | ------------ | ----------- |
| 127 | 126 | `126.png` |
| 145 | 144 | `144.png` |
| 151 | 150 | `150.png` |
| 156 | 155 | `155.png` |

## Implementation map

Most frames are **state variants** (filters, tabs, sandbox/production Y-row clones), not new routes. The app already covers list, lookup, detail tabs, choose-action, resubmission modal, approve/reject/escalate, compare-with-selfie chrome, and AML PEP expanded.

**No unique frame is a blank unbuilt screen.** Gaps below are designed elements the current UI does not match.

### Not implemented (build these)

None remaining for unique KYC UI. Remaining items are copy-only.

### Partial (copy / label only)

| Gap | Frames | Note |
| --- | ------ | ---- |
| **In Review** metric | 115 | Figma conflict — 115 says **In Review**; empty 79 and populated 86 say **High Risk Alert**. UI keeps **High Risk Alert**. |

### Implemented (treat as covered)

| Frames | Surface |
| ------ | ------- |
| 79, 115 | Empty list (`No User Activity`) |
| 86–89, 95, 116, 124–126 | Populated list + **Assigned To** |
| 80–85 | List filter dropdowns |
| 90 | Lookup entry (Single Verification) |
| 91 | BVN lookup result |
| 92–93 | Lookup Address Information + Comment |
| 96–108 | Detail tabs (document / risk / AML / IP / liveness) |
| 109–113 | Bulk lookup + type dropdowns |
| 157 | Bulk Verification filled (Nigeria / Staging / BVN) — from KYB zip |
| 114 | Add Customer → Choose action |
| 117, 119–123 | Resubmission footer + Compare with Selfie failed-match overlay |
| 118 | Request Document Re-submission modal |
| 128–142, 144, 146–155 | Approve / reject / escalate branches (modals + tab clones) |
| 132 | Confirm Approval modal |
| 143 | AML PEP match expanded |

## How to use

1. Open the PNG for the frame you are building (`086.png` for populated list).
2. Check `manifest.json` `status` / `gap` before treating a clone as a new screen.
3. Visual-QA the implemented route against that PNG before the next KYC unit.
