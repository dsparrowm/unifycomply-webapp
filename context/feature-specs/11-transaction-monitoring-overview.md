# Feature Spec: Transaction Monitoring Overview

**Milestone:** M3  
**Figma section:** Transaction Monitoring (`1532:157043`)  
**Primary frame:** `Transaction monitoring // TM Category` (`1532:157044`) — empty dashboard  
**Status:** In progress — overview dashboard (empty default)

Read `AGENTS.md` before starting.

## Route

| Route | Purpose | Status |
| ----- | ------- | ------ |
| `/transaction-monitoring` | TM Overview dashboard | Done — empty default + populated fixture |
| `/transactions` | Transaction explorer | Done — list + `/transactions/[id]` detail |
| `/tm-not-blocked` | Cleared transactions queue | Done |
| `/stop-payment` | Stopped payments queue | Done |
| `/cumulative-frequency` | High-frequency monitoring | Done (empty default) |
| `/tm-blocked` | Blocked transactions queue | Done |

## Overview layout (frame `1532:157044`)

1. **Page header** — title "Transaction Monitoring", subtitle "Real-time fraud detection and risk analysis dashboard", **Configure** CTA
2. **Quick Actions** — teal band with four cards linking to TM Not-Blocked, Cumulative Frequency, Stop Payment, TM Blocked
3. **Metrics** — Total Volume, High Risk Alerts, Active Users, Avg Risk Score
4. **24-Hour Activity Pattern** — line chart (transaction count vs time)
5. **TM Category** — category list with counts + progress bars + View Logs
6. **Total Volume** — larger chart with Last 30 days range control
7. **Risk Distribution** — Low / Medium / High legend values

## Data

Mock fixtures in `lib/data/transaction-monitoring.ts`. No Core Platform OpenAPI for TM yet.

## Related frames (later units)

- `Transaction monitoring // Real-time` (`1532:169205` …) — Transactions explorer
- `Transaction monitoring // PND` — PND flows (may overlap M4 sidebar)
- `TM rules setting` — rule management UI (`/rules`) — **Done** (list + editor + Adopt Template); Risk Score deferred (M4)
