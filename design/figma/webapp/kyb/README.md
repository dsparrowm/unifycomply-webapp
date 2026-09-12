# KYB design cache

Full **KYB COMPLIANCE** section export (`Customer // KYB // 77` … `137`).

| | |
| --- | --- |
| Source zip | `C:\Users\Davis\Downloads\🪪Unifycomply (4).zip` |
| Cached | 2026-09-12 |
| Exported | **54** KYB PNGs |
| Unique cached | **54** (`077.png` … `137.png`, skipping sequence gaps) |
| Exact pixel duplicates dropped | **0** |
| Sequence gaps (not in zip) | **90, 94, 98, 101, 104, 107, 110** |

Index with per-frame status: [`manifest.json`](./manifest.json).

Stray frame in the same zip: **Customer // KYC // 157** (KYC Bulk Verification) → `design/figma/webapp/kyc/157.png`.

## Sequence gaps

Not exported. Likely Y-row sandbox/production clones of 89 / 93 / 97 / 100 / 103 / 106 / 109. **Perform Lookup result** frames are also absent from this zip — the app still has `/kyb/lookup/result` from the earlier implementation.

## Implementation map

Most frames are **state variants** (filters, tab clones, pending vs approved, sandbox/production Y-row pairs), not new routes. The app already covers empty/populated business list chrome, lookup entry, detail tabs, and approve/reject/escalate/resubmission modals.

**Frame 84 is not the populated business queue.** Older docs treated `886:108206` as that list. In this export, **89 / 91 / 92** are the populated KYB queue; **84** (and empty **82–83**) are a **batch-file** table.

### Gaps from this cache (all built)

| Gap | Frames | Note |
| --- | ------ | ---- |
| **Batch-file queue** | 82–84 | **Done** — Type → **Bulk Search** shows `KybBatchTable`. |
| **Batch Lookup result** | 137 | **Done** — `/kyb/batch/[id]` (`KybBatchResultPanel`). |
| **Document viewer** | 131, 132, 136 | **Done** — `KybDocumentViewerModal` on Document tab Eye (Cancel / Download / X). |

### Implemented (treat as covered)

| Frames | Surface |
| ------ | ------- |
| 77–81, 89, 91, 92, 119, 120 | Business queue + **Assigned To** + **Verification Type** (089 column order) |
| 81–84 | Type filter **Bulk Search** + batch-file queue |
| 137 | Batch Lookup result — Total Business + queue |
| 85–88 | Perform Lookup entry (empty, country, ID type, CAC Advance filled) |
| 93, 95, 96, 121, 122 | Business Overview (pending / high-risk escalate / approved / score 0) |
| 97, 99, 100, 123, 124 | Risk Score Analysis |
| 102, 103, 113, 125, 126 | Directors & Officers |
| 105, 106, 117, 127, 128 | Shareholders |
| 108, 109, 118, 129, 130 | Submitted Documents list |
| 131, 132, 136 | Certificate of Incorporation viewer modal |
| 111, 112, 114, 116, 133, 134 | Compliance Checks / AML (collapsed, OFAC expanded, PEP expanded) |
| 115, 135 | Confirm Approval (risk 1 and 0) |

## How to use

1. Open the PNG for the frame you are building (`089.png` for the populated business queue, `084.png` for the batch-file list).
2. Check `manifest.json` `status` / `gap` before treating a clone as a new screen.
3. Visual-QA the implemented route against that PNG before the next KYB unit.
