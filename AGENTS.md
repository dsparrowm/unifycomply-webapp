# Unifycomply Agent Instructions

## Scope

This repository is **frontend only** — the **WebApp** from Figma (page `1:2`). Do not
implement backend services or the **Landing Page** (built in a separate project).

**Current milestone: M2** (`lib/constants/milestones.ts`). M1 is complete. Implement
routes and feature specs for the active milestone and earlier milestones only. Do not
implement M3–M5 until `CURRENT_MILESTONE` is advanced and `mvp-roadmap.md` completion
criteria are met.

Use **Next.js App Router** with routes under `app/` at the project root. Use mock data
until external APIs are integrated.

## Design Source of Truth

Figma file: [Unifycomply](https://www.figma.com/design/gJgHsHV3Jt9wYKJfstVdWB/%F0%9F%AA%AAUnifycomply?node-id=1-2)

**Build target:** WebApp page (`1:2`) only. Ignore Landing Page frames (`1:3`).

**Persistent design cache:** exported frames in `design/figma/` (indexed by
`design/manifest.json`). Use these when Figma MCP is unavailable — agents read PNG
exports directly and they persist across sessions when committed to git.

When implementing UI, match the referenced frame in Figma or its export in
`design/figma/`. If the design and the context docs conflict, record the mismatch in
`context/progress-tracker.md` before implementing.

See `design/README.md` for export instructions.

## Read First

Before implementing or making architectural decisions, read the following files in
order:

1. `context/project-overview.md` — product definition, goals, routes, and scope
2. `context/mvp-roadmap.md` — five-milestone **frontend** delivery plan
3. `context/architecture.md` — system structure, boundaries, and invariants
4. `context/ui-context.md` — theme, colors, typography, and layout conventions
5. `context/code-standards.md` — implementation rules and naming conventions
6. `context/progress-tracker.md` — current phase, completed work, open questions, and next steps
7. `context/go-live-checklist.md` — frontend production readiness

Update `context/progress-tracker.md` after each meaningful implementation change.

If implementation changes the architecture, scope, or standards documented in the
context files, update the relevant file before continuing.

## Workflow

Build Unifycomply incrementally using the spec-driven workflow defined in the
`context/` folder. Work one feature unit at a time — one page, one component group,
or one store slice.

A feature unit is complete when it renders correctly with mock data end to end.

## Handling Missing Requirements

- Do not invent behaviour not defined in the context files or Figma frames
- If a requirement is ambiguous, add it to `context/progress-tracker.md` as an open
  question and resolve it before implementing
- If a Figma frame implies a feature not in `context/project-overview.md`, update
  the overview and add or update the relevant feature spec before coding

## Protected Files

Do not modify the following unless explicitly instructed:

- `components/ui/*` — generated shadcn/ui primitives
- Any third-party library internals

## Keeping Docs in Sync

Update the relevant context file whenever implementation produces a decision:

- New component boundaries or folder structure → `context/architecture.md`
- New color tokens, component patterns, or layout rules → `context/ui-context.md`
- New coding conventions or naming decisions → `context/code-standards.md`
- Feature progress or decisions → `context/progress-tracker.md`
- Milestone scope changes → `context/mvp-roadmap.md`
- Release readiness status → `context/go-live-checklist.md`
- New frames or routes from Figma → `context/feature-specs/` and `context/project-overview.md`

## Before Moving to the Next Unit

1. The current unit renders correctly end to end with mock data
2. No invariant defined in `context/architecture.md` was violated
3. `context/progress-tracker.md` reflects the completed work
4. TypeScript validation passes for the touched area
5. No hardcoded hex values or inline styles were introduced unless required by the
   design token system
6. No TODO comments were left in production code paths
