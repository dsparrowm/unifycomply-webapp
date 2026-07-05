# Feature Spec: Overview Dashboard

**Milestone:** M1  
**Figma section:** OVERVIEW PAGE (`886:49385`)  
**Primary frame:** Overview (`886:49386`)  
**Status:** Implemented (populated mock data)

## Route

| Route | Frame | Purpose |
| ----- | ----- | ------- |
| `/overview` | Overview (`886:49386`) | Compliance officer home dashboard |

App shell (sidebar, header, sandbox banner) is provided by `app/(app)/layout.tsx` — not part of this page.

## Page sections (top to bottom)

1. **Page header** — title "Overview", subtitle "Important metrics for you", wallet balance, Top Up CTA (environment-aware)
2. **Quick actions** — four shortcut cards: Start KYC Check, Run AML Screening, background check, Deposit
3. **Metrics row** — Total Verification (left) and High Risk Alert (right)
4. **Usage row** — Most Used Endpoint (left) and Recent Activity (right)
5. **API Calls** — stacked bar chart (Successful / Failed) with monthly data

## Default state (sandbox / no activity)

Matches Figma frame `886:49386` empty variant. Current mock data uses the populated variant from Figma `1955:71650`:

- Wallet balance `NGN 0.00`
- Verification total `200` with success/failure/pending rates
- High risk count `12`
- Four endpoint usage bars with call counts and percentages
- Five recent activity items with user names and status tones
- API chart with Jan–Dec successful/failed stacked bars

## Top Up behavior

Reads `environment` from `store/ui.store.ts`:

| Environment | Top up action |
| ----------- | ------------- |
| Sandbox | Opens "Switch to Production" modal — wallet funding unavailable in sandbox |
| Production | Opens "Wallet Funding" placeholder modal |

"Switch to Production" sets environment to production and opens the funding modal. Triggered from page header **Top up** button and Quick Actions **Deposit** card.

## Components

- `components/overview/OverviewPageHeader.tsx`
- `components/overview/OverviewQuickActions.tsx`
- `components/overview/OverviewVerificationCard.tsx`
- `components/overview/OverviewHighRiskCard.tsx`
- `components/overview/OverviewEndpointsCard.tsx`
- `components/overview/OverviewRecentActivityCard.tsx`
- `components/overview/OverviewApiCallsChart.tsx`
- `components/overview/OverviewSectionHeader.tsx`

## Data

Mock fixtures in `lib/data/overview.ts`. Types in `types/overview.ts`.

## Out of scope (M1)

- Navigation from quick actions to M2+ routes (links disabled while `CURRENT_MILESTONE < 2`)
- Real wallet / billing integration
- Live API usage analytics
