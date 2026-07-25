# Design Inventory — Unifycomply Figma

Read `AGENTS.md` before starting.

## Purpose

Catalog every frame on the Figma **WebApp** page (`1:2`) in scope for implementation.
Landing Page (`1:3`) and Cover (`0:1`) are **out of scope** — landing is built elsewhere.

## Figma Reference

| Field    | Value |
| -------- | ----- |
| File key | `gJgHsHV3Jt9wYKJfstVdWB` |
| File URL | https://www.figma.com/design/gJgHsHV3Jt9wYKJfstVdWB/%F0%9F%AA%AAUnifycomply |
| Entry node | `1:2` (WebApp page) |

## Inventory Status

**Refreshed 2026-07-23** via local Framelink MCP (`get_figma_data` depth 2 on `1:2`).

| Metric | Count |
| ------ | ----- |
| Top-level frames under sections | **475** |
| Curated for PNG capture | **324** |
| Skipped as duplicates / non-screens | **158** |

Raw + plan files: `design/figma/webapp/_inventory-raw.json`, `_capture-plan.json`.

### Pages

| Page | Node ID | Status |
| ---- | ------- | ------ |
| Cover | `0:1` | Out of scope |
| **WebApp** | **`1:2`** | **In scope — build target** |
| Landing Page | `1:3` | Out of scope (built elsewhere) |

### WebApp sections

| Section | Node ID | Frames on page | Capture | Route |
| ------- | ------- | -------------- | ------- | ----- |
| ONBOARDING - COMPLIANCE OFFICER | `886:48671` | 4 | 4 | `/sign-in`, onboarding |
| OVERVIEW PAGE | `886:49385` | 10 | 10 | `/overview` |
| KYC COMPLIANCE | `886:53858` | 79 | 78 | `/kyc` |
| KYB COMPLIANCE | `886:105537` | 48 | 48 | `/kyb` |
| AML SCREENING | `886:134392` | 66 | 57 | `/aml-screening` |
| BANK ANALYSIS | `886:161365` | 47 | 47 | `/bank-analysis` |
| SETTINGS | `886:184304` | 24 | 24 | `/settings` |
| Transaction Monitoring | `1532:157043` | 196 | 56 | `/transaction-monitoring` |
| MVP FLowchart | `1624:69149` | 1 | 0 | Reference only |

Also present (not screens): Module 4–11 label frames.

## Capture policy

**Keep (supporting states included):**

- Base screens (empty + populated)
- Modals / confirm overlays (blur + centered dialog)
- Drawers and header dropdowns / popovers
- Filter and button open states
- Distinct flow steps (lookup, detail, approve/reject)

**Skip (duplicates / non-product):**

- Same UI cloned on another Y-row (sandbox vs production layout copies)
- Excess identical-name TM frames beyond height/band representatives
- Module 5–11 labels, MVP flowchart marker
- Monitoring Levels reference diagram

### Overview states (same frame name, different UI)

| Node ID | Role |
| ------- | ---- |
| `886:49386` | Base — Sandbox |
| `886:49678` | Header dropdown / popover |
| `886:50003` | Variant |
| `886:50340` | Small popover |
| `886:50687` | Bottom popover |
| `886:51034` | Confirm modal (blur) |
| `886:51403` | Base — Production |
| `886:52269` | Large modal overlay |
| `886:51750` / `886:51954` | Billing screens |

### KYC note

Frames `Customer // KYC // 79`…`156` are **state variants**, not separate routes. Primary row is `y≈771`. Other Y bands (`3214`, `5657`, `8158`, …) are mostly sandbox/production duplicates of decision flows — captured only when the number or height is unique.

## Design tokens

See `context/ui-context.md` / `app/globals.css` (Onest, Primary/11 `#007984`, Grey/04 `#E4E7EC`, Sandbox/Production banners).

## Acceptance

- [x] All in-scope sections listed with node IDs
- [x] Capture vs skip policy recorded
- [ ] PNG cache complete for curated 324 (`design/figma/webapp/`)
- [ ] `design/manifest.json` synced to exported files
- [x] `context/project-overview.md` routes exist for M1–M2 modules
