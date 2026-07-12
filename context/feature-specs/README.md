# Feature Specs

This folder holds route- and frame-level implementation specs for Unifycomply. Each
spec maps to one or more Figma frames and defines what to build before any code is
written.

## Workflow

1. Inventory frames in Figma → `00-design-inventory.md`
2. Create one numbered spec per feature unit (page, flow, or component group)
3. Implement against the spec; update `context/progress-tracker.md` when done
4. Keep `context/project-overview.md` routes table in sync

## Naming Convention

```
NN-short-kebab-name.md
```

Examples:

- `00-design-inventory.md` — full Figma frame list and build order
- `01-landing-header.md` — first implementable unit after inventory
- `02-dashboard-shell.md` — app shell if present in design

## Spec Template

Each feature spec should include:

```markdown
# [Feature name]

Read `AGENTS.md` before starting.

## Figma reference

- File: [Unifycomply](https://www.figma.com/design/gJgHsHV3Jt9wYKJfstVdWB/...)
- Frame name:
- Node ID:

## Scope

What to build in this unit (and what is explicitly out of scope).

## Route

`/path` (if applicable)

## Components

List of components to create or extend.

## Data

Mock data shape (required for v1).

## Acceptance

- [ ] Renders matching Figma layout
- [ ] Responsive behaviour (if frame includes breakpoints)
- [ ] TypeScript clean
- [ ] progress-tracker updated
```

## Context Files

| File | Purpose |
| ---- | ------- |
| `project-overview.md` | Product scope, roles, routes, navigation |
| `mvp-roadmap.md` | Five-milestone frontend plan |
| `go-live-checklist.md` | Frontend production readiness |
| `architecture.md` | Stack, boundaries, invariants |
| `ui-context.md` | Design tokens and layout patterns |
| `code-standards.md` | Implementation conventions |
| `progress-tracker.md` | Current phase and feature status |

## Current Coverage

| Spec | Description | Status |
| ---- | ----------- | ------ |
| `00-design-inventory.md` | Figma frame inventory and build order | Blocked (Figma access) |
| `02-overview-dashboard.md` | Overview / compliance dashboard | Done |
| `03-kyc-compliance.md` | KYC list, lookup, detail (frames 79–156) | In progress — empty list done |
