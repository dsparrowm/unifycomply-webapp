export type OverviewQuickAction = {
  id: string;
  title: string;
  description: string;
};

export type OverviewVerificationStats = {
  total: number;
  successRate: number;
  failureRate: number;
  pendingReviewRate: number;
};

export type OverviewEndpointUsage = {
  id: string;
  name: string;
  calls: number;
  percentage: number;
};

export type OverviewActivityTone = "success" | "warning" | "info" | "neutral";

export type OverviewActivityItem = {
  id: string;
  message: string;
  user: string;
  timestamp: string;
  tone: OverviewActivityTone;
};

export type OverviewApiCallsPoint = {
  label: string;
  calls: number;
  errors: number;
};

export type OverviewDashboardData = {
  walletBalance: string;
  verification: OverviewVerificationStats;
  highRiskCount: number;
  endpoints: OverviewEndpointUsage[];
  activities: OverviewActivityItem[];
  apiCalls: OverviewApiCallsPoint[];
};
