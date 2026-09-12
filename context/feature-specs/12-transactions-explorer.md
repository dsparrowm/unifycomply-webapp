# Feature Spec: Transaction Monitoring — Transactions Explorer

**Milestone:** M3  
**Figma:** `Transaction monitoring // TM Category` (list) + `Real-time` (detail)  
**Status:** List + detail + Account Statement + Resolve/PND/Escalate + SAR wizard done (mock)

Read `AGENTS.md` before starting.

## Routes

| Route | Purpose | Design ref | Status |
| ----- | ------- | ---------- | ------ |
| `/transactions` | Real-time Monitoring explorer | `TM Category-7` populated, `TM Category-2` empty | Done |
| `/transactions/[id]` | Transaction Details | Real-time frames (e.g. Stop Payment / Cum.Freq / Blocked) | Done |
| `/transactions/[id]/account-statement` | Account Statement (“View Account Activity”) | `stop-payment/account-statement-*.png`, Real-time-15/20 | **Done** (mock) |
| `/transactions/[id]/sar-rationale` | SAR Rationale wizard | Real-time-35+ / `stop-payment/sar-*.png` | **Done** (mock) |
| Resolve Case / Place PND modals | Actions menu | Real-time-8 / 12 / PND-1 | **Done** (mock submit) |
| Escalate Case modal | Actions → Escalate Case | API-derived (KYC escalate pattern; no dedicated TM frame) | **Done** (mock) |

## List layout (`TM Category-7`)

1. **Header** — “Real-time Monitoring”, subtitle fraud-detection dashboard
2. **Metrics** — Total Transaction, Not Blocked, Stop Payment, Cumulative Frequency, TM-Blocked
3. **Filters** — Date, Status, Category, More filters, Search, Export Report
4. **Table** — checkbox, Transaction ID, Timestamp (relative + clock), Customer, Amount, TM Category, Risk Score bar, Rules Trigger, Status, view
5. **Empty** — “No User Activity” (`TM Category-2`)
6. **Pagination** — Previous / pages / Next

## Detail layout (Real-time)

1. Back → list; title + TXN id + INCOMING/OUTGOING; Actions dropdown
2. Tabs — Transaction Details | Case Management
3. Left — AI Risk Analysis, Transaction Summary, Counterparty, Customer (+ View Account Activity), Rules Triggered, Related Transactions
4. Right — Timeline, Quick Stats, Full Metadata

## Data

Mock fixtures in `lib/data/transactions.ts`. No Core Platform OpenAPI for TM yet.

## Components

- `components/transaction-monitoring/TransactionsListPanel.tsx`
- `components/transaction-monitoring/TransactionDetailPanel.tsx`
- `components/transaction-monitoring/AccountStatementPanel.tsx`
- `components/transaction-monitoring/SarRationaleWizardPanel.tsx`
- `components/transaction-monitoring/EscalateCaseModal.tsx`
- Badges / filters / table / metrics under same folder

## Account Statement

- Entry: Customer card → **View Account Activity**
- Populated ledger mock for **Sophie Williams** (Figma KPIs + 10 lines)
- Other customers: empty ledger (“No User Activity”) for empty-state QA
- Filters: All time · Types · More filters · Search · Export Statement/Report

## SAR Rationale wizard

- Entry: Actions → **Generate SAR Rationale**
- Steps: Basic Information → Red Flags → Rationale (+ SAR Assistant) → Export and Review
- Submit shows success modal (internal rationale, not SAR filing)
- Escalate Case: Actions modal with notes (mock confirm)
