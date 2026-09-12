# WebApp design cache

PNG exports from the Figma **WebApp** page (`1:2`).

## Capture policy

| Capture | Skip |
| ------- | ---- |
| Base screens (empty + populated) | Same UI cloned on another Y-row (sandbox/production layout copies) |
| Modals, drawers, confirm overlays | Module 5–11 label frames (not screens) |
| Filter / dropdown / button open states | MVP flowchart reference only |
| Distinct flow steps (lookup, detail, approve/reject) | Excess identical-name TM variants beyond representatives |

## Inventory files

| File | Purpose |
| ---- | ------- |
| `_inventory-raw.json` | All 475 top-level section frames from Figma |
| `_capture-plan.json` | Curated 324 captures + 158 skips with reasons |
| `_export-results.json` | Export run log (ok / fail) |

## Full section caches

| Section | Directory | Notes |
| ------- | --------- | ----- |
| **KYC** | `design/figma/webapp/kyc/` | 2026-09-12 zip — 74 unique + stray **157** (bulk BVN) + `manifest.json` |
| **KYB** | `design/figma/webapp/kyb/` | 2026-09-12 zip — 54 unique PNGs + `manifest.json` (implemented vs gaps) |
| **AML** | `design/figma/webapp/aml/` | 2026-09-12 zip — 63 unique / 67 exported + `manifest.json` |
| **Bank Analysis** | `design/figma/webapp/bank/` | 2026-09-12 zip — 47 unique + `manifest.json` |
| Transaction Monitoring | `design/figma/webapp/tm/` | Earlier M3 export |

## Totals (from last plan)

- **On page:** 475 frames
- **To capture:** 324 (includes supporting states)
- **Skipped:** 158 (mostly Y-row / same-name duplicates)

### By section (capture count)

| Section | Capture |
| ------- | ------- |
| Onboarding | 4 |
| Overview | 10 |
| KYC | **74 unique cached** (78 exported − 4 pixel dups) in `kyc/` — see `kyc/README.md` |
| KYB | **54 unique cached** in `kyb/` — see `kyb/README.md` |
| AML | **63 unique cached** (67 exported − 4 pixel dups) in `aml/` — see `aml/README.md` |
| Bank Analysis | **47 unique cached** in `bank/` — see `bank/README.md` |
| Settings | 24 |
| Transaction Monitoring | 56 |
