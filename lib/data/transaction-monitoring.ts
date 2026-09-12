import type { TmOverviewData, TmQuickAction } from "@/types/transaction-monitoring";

export const tmQuickActions: TmQuickAction[] = [
  {
    id: "tm-not-blocked",
    title: "TM Not-Blocked",
    description: "Transactions cleared for processing",
    href: "/tm-not-blocked",
  },
  {
    id: "cumulative-frequency",
    title: "Cumulative Frequency",
    description: "High-frequency transaction monitoring",
    href: "/cumulative-frequency",
  },
  {
    id: "stop-payment",
    title: "Stop Payment",
    description: "Payments halted for review",
    href: "/stop-payment",
  },
  {
    id: "tm-blocked",
    title: "TM Blocked",
    description: "Transactions halted",
    href: "/tm-blocked",
  },
];

/** Empty dashboard — Figma `Transaction monitoring // TM Category` `1532:157044`. */
export const tmOverviewDataEmpty: TmOverviewData = {
  metrics: [
    { id: "total-volume", label: "TOTAL VOLUME", value: "0" },
    { id: "high-risk", label: "HIGH RISK ALERTS", value: "0" },
    { id: "active-users", label: "ACTIVE USERS", value: "0" },
    { id: "avg-risk", label: "AVG RISK SCORE", value: "0" },
  ],
  quickActions: tmQuickActions,
  categories: [
    { id: "tm-not-blocked", label: "TM Not-Blocked", count: 0, progress: 0 },
    { id: "cumulative-frequency", label: "Cumulative Frequency", count: 0, progress: 0 },
    { id: "stop-payment", label: "Stop Payment", count: 0, progress: 0 },
    { id: "tm-blocked", label: "TM Blocked", count: 0, progress: 0 },
  ],
  activity24h: [
    { hour: "01:00", count: 0 },
    { hour: "05:00", count: 0 },
    { hour: "09:00", count: 0 },
    { hour: "13:00", count: 0 },
    { hour: "17:00", count: 0 },
    { hour: "21:00", count: 0 },
    { hour: "23:00", count: 0 },
  ],
  volumeSeries: [
    { label: "Week 1", volume: 0 },
    { label: "Week 2", volume: 0 },
    { label: "Week 3", volume: 0 },
    { label: "Week 4", volume: 0 },
  ],
  volumeRange: "30d",
  riskDistribution: { low: 0, medium: 0, high: 0 },
};

/** Populated fixture for demo / review. */
export const tmOverviewDataPopulated: TmOverviewData = {
  metrics: [
    { id: "total-volume", label: "TOTAL VOLUME", value: "128,450" },
    { id: "high-risk", label: "HIGH RISK ALERTS", value: "24" },
    { id: "active-users", label: "ACTIVE USERS", value: "1,842" },
    { id: "avg-risk", label: "AVG RISK SCORE", value: "1.8" },
  ],
  quickActions: tmQuickActions,
  categories: [
    { id: "tm-not-blocked", label: "TM Not-Blocked", count: 8420, progress: 100 },
    { id: "cumulative-frequency", label: "Cumulative Frequency", count: 312, progress: 37 },
    { id: "stop-payment", label: "Stop Payment", count: 58, progress: 12 },
    { id: "tm-blocked", label: "TM Blocked", count: 96, progress: 18 },
  ],
  activity24h: [
    { hour: "01:00", count: 120 },
    { hour: "05:00", count: 80 },
    { hour: "09:00", count: 640 },
    { hour: "13:00", count: 920 },
    { hour: "17:00", count: 780 },
    { hour: "21:00", count: 410 },
    { hour: "23:00", count: 190 },
  ],
  volumeSeries: [
    { label: "Week 1", volume: 28000 },
    { label: "Week 2", volume: 32500 },
    { label: "Week 3", volume: 30100 },
    { label: "Week 4", volume: 37850 },
  ],
  volumeRange: "30d",
  riskDistribution: { low: 72.4, medium: 19.1, high: 8.5 },
};
