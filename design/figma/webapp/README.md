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

## Totals (from last plan)

- **On page:** 475 frames
- **To capture:** 324 (includes supporting states)
- **Skipped:** 158 (mostly Y-row / same-name duplicates)

### By section (capture count)

| Section | Capture |
| ------- | ------- |
| Onboarding | 4 |
| Overview | 10 |
| KYC | 78 |
| KYB | 48 |
| AML | 57 |
| Bank Analysis | 47 |
| Settings | 24 |
| Transaction Monitoring | 56 |
