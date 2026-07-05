import type {
  OverviewDashboardData,
  OverviewQuickAction,
} from "@/types/overview";

export const overviewQuickActions: OverviewQuickAction[] = [
  {
    id: "kyc",
    title: "Start KYC Check",
    description: "Navigate to Start KYC Check",
  },
  {
    id: "aml",
    title: "Run AML Screening",
    description: "Navigate to Run AML Screening",
  },
  {
    id: "background-check",
    title: "background check",
    description: "Navigate to Background Check",
  },
  {
    id: "deposit",
    title: "Deposit",
    description: "Navigate to Top Up Wallet",
  },
];

export const overviewDashboardData: OverviewDashboardData = {
  walletBalance: "NGN 0.00",
  verification: {
    total: 200,
    successRate: 90.2,
    failureRate: 5.0,
    pendingReviewRate: 4.8,
  },
  highRiskCount: 12,
  endpoints: [
    {
      id: "kyc-verification",
      name: "KYC Verification",
      calls: 1191,
      percentage: 60,
    },
    {
      id: "aml-screening",
      name: "AML Screening",
      calls: 1191,
      percentage: 30,
    },
    {
      id: "document-verification",
      name: "Document Verification",
      calls: 1191,
      percentage: 20,
    },
    {
      id: "background-check",
      name: "Background Check",
      calls: 1191,
      percentage: 10,
    },
  ],
  activities: [
    {
      id: "activity-1",
      message: "KYC Verification completed",
      user: "Alimi Ayomikun",
      timestamp: "2 Minutes ago",
      tone: "success",
    },
    {
      id: "activity-2",
      message: "AML Screening flagged high risk",
      user: "Chinyere Nwankwo",
      timestamp: "8 Minutes ago",
      tone: "warning",
    },
    {
      id: "activity-3",
      message: "Document Verification",
      user: "Oluwaseun Ademola",
      timestamp: "10 Minutes ago",
      tone: "info",
    },
    {
      id: "activity-4",
      message: "Background Check completed",
      user: "Alimi Ayomikun",
      timestamp: "2 Minutes ago",
      tone: "success",
    },
    {
      id: "activity-5",
      message: "Address Verification Requested",
      user: "Chinyere Nwankwo",
      timestamp: "15 Minutes ago",
      tone: "neutral",
    },
  ],
  apiCalls: [
    { label: "Jan", calls: 450, errors: 350 },
    { label: "Feb", calls: 550, errors: 400 },
    { label: "Mar", calls: 300, errors: 250 },
    { label: "Apr", calls: 450, errors: 450 },
    { label: "May", calls: 350, errors: 250 },
    { label: "Jun", calls: 500, errors: 450 },
    { label: "Jul", calls: 450, errors: 350 },
    { label: "Aug", calls: 450, errors: 400 },
    { label: "Sep", calls: 450, errors: 350 },
    { label: "Oct", calls: 480, errors: 450 },
    { label: "Nov", calls: 550, errors: 450 },
    { label: "Dec", calls: 450, errors: 350 },
  ],
};
