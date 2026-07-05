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
| Entry node | `1:2` (from shared URL `node-id=1-2`) |

## Inventory Status

**Confirmed via Figma MCP** (edit access granted 2026-07-01). Node IDs recorded in
`design/manifest.json`.

### Pages

| Page | Node ID | Status |
| ---- | ------- | ------ |
| Cover | `0:1` | Out of scope |
| **WebApp** | **`1:2`** | **In scope — build target** |
| Landing Page | `1:3` | Out of scope (built elsewhere) |

### WebApp sections

| Section | Node ID | Proposed route |
| ------- | ------- | -------------- |
| ONBOARDING - COMPLIANCE OFFICER | `886:48671` | `/sign-in`, onboarding |
| OVERVIEW PAGE | `886:49385` | `/overview` |
| KYC COMPLIANCE | `886:53858` | `/kyc` |
| KYB COMPLIANCE | `886:105537` | `/kyb` |
| BANK ANALYSIS | `886:161365` | `/bank-analysis` |
| AML SCREENING | `886:134392` | `/aml-screening` |
| Transaction Monitoring | `1532:157043` | `/transaction-monitoring` |
| SETTINGS | `886:184304` | `/settings` |
| MVP FLowchart | `1624:69149` | Reference only |

### Representative frames (verified with `get_design_context`)

| Frame | Node ID | Section |
| ----- | ------- | ------- |
| Customer // KYC // 79 | `886:70409` | KYC COMPLIANCE |
| Sign In // 3 | `886:48672` | ONBOARDING |

### How to refresh inventory

**Option A — Figma MCP (preferred)**

Use `get_metadata` on page node `1:2` or `1:3`, then `get_design_context` on individual frames.

**Option B — Export PNG cache**

Export frames to `design/figma/` per `design/README.md` for offline persistence.

## Frame Inventory

_To be filled after Figma access is granted._

| # | Frame name | Node ID | Route (proposed) | Feature spec | Priority | Notes |
| - | ---------- | ------- | ---------------- | ------------ | -------- | ----- |
| | | | | | | |

## Design Tokens to Extract

After inventory, copy values into `context/ui-context.md` and `app/globals.css`:

- [ ] Primary / secondary / accent colors
- [ ] Background and surface colors
- [ ] Text colors (primary, muted, on-dark)
- [ ] Border and divider colors
- [ ] State colors (success, warning, error, info)
- [ ] Font families and weights
- [ ] Type scale (display, heading, body, label, caption)
- [ ] Spacing scale (page padding, section gaps, card padding)
- [ ] Border radius scale
- [ ] Shadows / elevation (if any)
- [ ] Icon set and default sizes

## Proposed Build Order

_To be defined after inventory. Typical order:_

1. Project scaffold (Next.js, Tailwind, shadcn/ui, tokens in `globals.css`)
2. Layout shell (if a shared chrome frame exists)
3. Public / marketing pages (if any)
4. Auth flows (if any)
5. Core app screens (by user journey)

## Acceptance

- [ ] All in-scope frames listed with node IDs
- [ ] Build order agreed and recorded
- [ ] `context/project-overview.md` updated with routes and features
- [ ] `context/ui-context.md` populated with tokens from Figma
- [ ] Individual feature specs `01+` created for the first milestone
- [ ] `context/progress-tracker.md` updated — Phase 0 complete, Phase 1 started
