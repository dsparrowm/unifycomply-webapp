# Feature Spec: Transaction Monitoring — Queue Lists

**Milestone:** M3  
**Status:** Done (mock) — visual QA vs TM Category frames

## Routes

| Route | Design ref | Default | Status |
| ----- | ---------- | ------- | ------ |
| `/tm-not-blocked` | `TM Category-13` populated / `12` empty | Populated | Done |
| `/stop-payment` | `stop-payment/list-populated.png` (+ empty) | Populated | Done |
| `/cumulative-frequency` | `TM Category-6` empty | Empty | Done |
| `/tm-blocked` | `TM Category-5` populated | Populated | Done |

## Shared layout (`TmQueueListPanel`)

1. Queue title + subtitle  
2. KPI cards (2 for Blocked; 4 for others)  
3. Filters: Date · (Status on Cum.Freq) · Entity · More · Search · Export Report  
4. Table with queue-specific columns + eye → `/transactions/[id]`  
5. Empty copy: **No User Activity**

## Open gap

- Adopt Template (industry package) frames `TM rules setting-11+` — **Done** (modal on `/rules`).
- Risk Score list frames (`TM rules setting-1`–`-3`) — nav remains M4 until that unit starts.
