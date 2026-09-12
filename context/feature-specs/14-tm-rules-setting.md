# Feature Spec: Transaction Monitoring — Rules Setting

**Milestone:** M3  
**Figma:** `TM rules setting*.png` (Rules under COMPLIANCE)  
**Status:** List + create/edit + Adopt Template done (mock); Risk Score deferred (M4 nav)

Read `AGENTS.md` before starting.

## Routes

| Route | Purpose | Design ref | Status |
| ----- | ------- | ---------- | ------ |
| `/rules` | Transaction Rules list | `TM rules setting.png` empty, `-4` populated | **Done** |
| `/rules/new` | Create Rule | Edit Rule frames (create mode) | **Done** |
| `/rules/[id]` | Edit Rule + Live Preview | `TM rules setting-7` / `-8` | **Done** |
| Adopt Template | Industry package picker | `TM rules setting-11`–`-13` | **Done** (mock modal) |
| `/risk-score` | Risk Score list | `TM rules setting-1`–`-3` (same zip) | Deferred (nav still M4) |

## List layout

1. Header — “Transaction Rules” + subtitle; **Create New Rule** / **Adopt Template**
2. Table — checkbox, Rule Name, Description (+ conditions), Severity, Triggers, Status, ⋮
3. Empty — “0 Rules set” / “No violation rules triggered”
4. Pagination

## Edit layout

1. Back → list
2. Form card — Rule Name, Description, Severity, Action Settings (TM Condition + checkboxes), Conditions (+ Add)
3. Live Preview — name, description, severity, logic, conditions count, action/category badges

## Data

Mock fixtures in `lib/data/tm-rules.ts`. No Core Platform OpenAPI for TM rules yet.

## Components

- `components/transaction-monitoring/TransactionRulesListPanel.tsx`
- `components/transaction-monitoring/TransactionRuleEditorPanel.tsx`
- `components/transaction-monitoring/AdoptTemplateModal.tsx`
