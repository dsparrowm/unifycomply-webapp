# Design Cache

Exported Figma frames live here so design context survives across Cursor sessions
without relying on Figma MCP access.

## Why this exists

Figma MCP requires editor access on the source file. Exported assets in this folder are
the **persistent design source of truth** when MCP is unavailable. Agents read these
files directly (PNG images are viewable; SVGs are readable as markup).

## Folder layout

```
design/
  README.md           ← this file
  manifest.json       ← frame index: name, file path, page, route, spec
  figma/
    cover/            ← Cover page frames
    landing-page/     ← Landing Page frames
    webapp/           ← WebApp frames (primary build target), by module:
      onboarding/     ← auth / sign-in / sign-up
      overview/
      kyc/
      kyb/
      aml/
      bank-analysis/
      settings/
      shared/         ← app-shell overlays (search modal, etc.)
    assets/           ← logos, icons, illustrations (optional SVG/PNG)
```

## How to export from Figma

1. Open the [Unifycomply Figma file](https://www.figma.com/design/gJgHsHV3Jt9wYKJfstVdWB/%F0%9F%AA%AAUnifycomply)
2. Select the **top-level frame** (not a nested group inside it)
3. Export settings:
   - **Format:** PNG
   - **Scale:** 2x (preferred for readable text and spacing)
   - **Contents only:** off (include frame background)
4. Save into the matching **module folder** using **kebab-case** filenames:

| Figma frame | Save as |
| ----------- | ------- |
| Customer // KYC // 79 | `design/figma/webapp/kyc/customer-kyc-79.png` |
| Customer // KYB // 84 | `design/figma/webapp/kyb/customer-kyb-84.png` |
| AML list / detail | `design/figma/webapp/aml/…` |
| Bank Analysis | `design/figma/webapp/bank-analysis/…` |
| SETTINGS | `design/figma/webapp/settings/…` |
| Sign In / Sign Up | `design/figma/webapp/onboarding/…` |
| Overview | `design/figma/webapp/overview/…` |

5. Update `design/manifest.json` — add or update the entry for each export
6. Commit the exports to git so future sessions retain them

### Optional exports

- **SVG** — logos, simple icons → `design/figma/assets/`
- **PDF** — not recommended; PNG is easier for agents to inspect visually

## How agents use this cache

When implementing a feature:

1. Read the feature spec in `context/feature-specs/`
2. Open the referenced PNG in `design/figma/`
3. Extract layout, colors, typography, and spacing into `context/ui-context.md` on first pass
4. Build components to match the export

If both Figma MCP and exports are available, prefer MCP for tokens and precise specs;
use exports as the fallback and permanent record.

## Keeping the cache current

Re-export a frame when the Figma design changes. Update `manifest.json` `exportedAt`
and note the change in `context/progress-tracker.md`.
