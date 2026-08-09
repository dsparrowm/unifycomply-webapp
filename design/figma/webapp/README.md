# WebApp design cache

PNG exports from the Figma **WebApp** page (`1:2`), organized by module.

## Folder layout

```
design/figma/webapp/
  README.md
  _inventory-raw.json      ← inventory / capture meta (stays at root)
  _capture-plan.json
  _export-results.json
  _remaining-m2-upward.md
  onboarding/              ← auth / sign-in / sign-up
  overview/                ← dashboard
  kyc/                     ← KYC COMPLIANCE frames
  kyb/                     ← KYB COMPLIANCE frames
  aml/                     ← AML SCREENING frames
  bank-analysis/           ← BANK ANALYSIS frames
  settings/                ← SETTINGS frames
  shared/                  ← app-shell overlays (search modal, etc.)
```

## Naming

Save exports as **PNG @ 2x** into the matching module folder:

| Figma | Path |
| ----- | ---- |
| `Customer // KYB // 84` | `kyb/customer-kyb-84.png` |
| `Customer // KYC // 96` | `kyc/customer-kyc-96.png` |
| AML list frame 15 | `aml/list-15.png` |
| Sign In // 3 | `onboarding/sign-in-3.png` |

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

| Section | Capture | Folder |
| ------- | ------- | ------ |
| Onboarding | 4 | `onboarding/` |
| Overview | 10 | `overview/` |
| KYC | 78 | `kyc/` |
| KYB | 48 | `kyb/` |
| AML | 57 | `aml/` |
| Bank Analysis | 47 | `bank-analysis/` |
| Settings | 24 | `settings/` |
| Transaction Monitoring | 56 | _(add `transaction-monitoring/` when exporting)_ |
