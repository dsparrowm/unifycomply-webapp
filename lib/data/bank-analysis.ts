import type {
  BankAnalysisBatchResult,
  BankAnalysisDetail,
  BankAnalysisListData,
  BankAnalysisRun,
} from "@/types/bank-analysis";

const financialMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const incomeSeries = [
  590, 610, 600, 620, 615, 625, 620, 640, 630, 650, 640, 660, 670, 700, 690, 700, 710,
  690, 650, 660, 700, 720, 740, 750, 740, 730, 710, 730, 750, 720, 730, 740, 760, 780,
  770, 820,
] as const;

const expenseSeries = [
  380, 390, 385, 400, 395, 405, 400, 410, 405, 415, 410, 420, 425, 435, 440, 450, 455,
  445, 420, 430, 445, 455, 465, 475, 480, 470, 465, 475, 470, 460, 465, 470, 480, 490,
  500, 520,
] as const;

/** Frame 16 — Bank Analysis populated list */
const bankAnalysisRunsMock: BankAnalysisRun[] = [
  {
    id: "ba-run-30666",
    runId: "#30666",
    fullName: "Customer_List.csv",
    date: "19/01/2026",
    type: "batch",
    accounts: 3,
    analyst: "Drew Cano",
    assignedTo: null,
    alerts: 2,
    riskScore: 2,
    status: "flagged",
    submittedAt: "2026-01-19",
  },
  {
    id: "ba-run-30665",
    runId: "#30665",
    fullName: "Mary Peter",
    date: "20/01/2026",
    type: "organization",
    accounts: 5,
    analyst: "Mary Peter",
    assignedTo: "Alimi Ayomikun",
    alerts: 0,
    riskScore: 3,
    status: "clear",
    submittedAt: "2026-01-20",
  },
  {
    id: "ba-run-30664",
    runId: "#30664",
    fullName: "Corporate User.csv",
    date: "21/01/2026",
    type: "batch",
    accounts: 6,
    analyst: "Drew Cano",
    assignedTo: "Alimi Ayomikun",
    alerts: 2,
    riskScore: 2,
    status: "in-review",
    submittedAt: "2026-01-21",
  },
  {
    id: "ba-run-30663",
    runId: "#30663",
    fullName: "Customer_List.csv",
    date: "25/01/2026",
    type: "batch",
    accounts: 2,
    analyst: "Drew Cano",
    assignedTo: null,
    alerts: 2,
    riskScore: 1,
    status: "flagged",
    submittedAt: "2026-01-25",
  },
  {
    id: "ba-run-30662",
    runId: "#30662",
    fullName: "Kate Morrison",
    date: "19/01/2026",
    type: "individual",
    accounts: 10,
    analyst: "Kate Morrison",
    assignedTo: "Alimi Ayomikun",
    alerts: 2,
    riskScore: 0,
    status: "flagged",
    submittedAt: "2026-01-19",
  },
  {
    id: "ba-run-30661",
    runId: "#30661",
    fullName: "Drew Cano",
    date: "19/01/2026",
    type: "individual",
    accounts: 4,
    analyst: "Drew Cano",
    assignedTo: "Tejumade Olomola",
    alerts: 0,
    riskScore: 3,
    status: "clear",
    submittedAt: "2026-01-19",
  },
  {
    id: "ba-run-30660",
    runId: "#30660",
    fullName: "Andi Lane",
    date: "29/01/2026",
    type: "organization",
    accounts: 3,
    analyst: "Andi Lane",
    assignedTo: "Favour Soma",
    alerts: 0,
    riskScore: 2,
    status: "blocked",
    submittedAt: "2026-01-29",
  },
  {
    id: "ba-run-30659",
    runId: "#30659",
    fullName: "Peter Sam",
    date: "19/01/2026",
    type: "organization",
    accounts: 2,
    analyst: "Peter Sam",
    assignedTo: null,
    alerts: 2,
    riskScore: 4,
    status: "clear",
    submittedAt: "2026-01-19",
  },
  {
    id: "ba-run-30658",
    runId: "#30658",
    fullName: "Tejumade Olomola",
    date: "24/01/2026",
    type: "organization",
    accounts: 5,
    analyst: "Tejumade Olomola",
    assignedTo: null,
    alerts: 0,
    riskScore: 2,
    status: "clear",
    submittedAt: "2026-01-24",
  },
  {
    id: "ba-run-30657",
    runId: "#30657",
    fullName: "Favour Chris",
    date: "29/01/2026",
    type: "manual",
    accounts: 6,
    analyst: "Favour Chris",
    assignedTo: "Favour Soma",
    alerts: 0,
    riskScore: 4,
    status: "in-review",
    submittedAt: "2026-01-29",
  },
];

export function getBankAnalysisRunHref(run: Pick<BankAnalysisRun, "riskScore">) {
  return run.riskScore >= 3
    ? "/bank-analysis/ba-run-1?view=high-risk"
    : "/bank-analysis/ba-run-1";
}

export const bankAnalysisListDataEmpty: BankAnalysisListData = {
  metrics: [
    { id: "total-screening", label: "Total screening", value: 0, tone: "info" },
    { id: "total-alerts", label: "Total Alerts Generated", value: 0, tone: "warning" },
    { id: "completed", label: "Completed", value: 0, tone: "success" },
    {
      id: "high-risk-alerts",
      label: "high risk alerts",
      value: 0,
      tone: "error",
    },
  ],
  runs: [],
};

export const bankAnalysisListDataPopulated: BankAnalysisListData = {
  metrics: [
    { id: "total-screening", label: "Total screening", value: 20, tone: "info" },
    { id: "total-alerts", label: "Total Alerts Generated", value: 8, tone: "warning" },
    { id: "completed", label: "Completed", value: 12, tone: "success" },
    {
      id: "high-risk-alerts",
      label: "high risk Entity",
      value: 3,
      tone: "error",
    },
  ],
  runs: bankAnalysisRunsMock,
};

const bankAnalysisDetails: BankAnalysisDetail[] = [
  {
    id: "ba-run-1",
    customerName: "Favour Peter Soma",
    riskScore: 0,
    escalateSummary: {
      riskScore: 4,
      sanction: true,
      warningEnforcement: true,
    },
    riskBanner: {
      alerts: 0,
      title: null,
      description: "No active alerts or suspicious activity detected",
      tone: "clear",
    },
    accountPortfolio: 6,
    linkedEntities: 2,
    accounts: [
      {
        id: "first-bank",
        bankName: "First Bank",
        maskedAccountNumber: "****8821",
        tier: 3,
        type: "Current",
        status: "active",
        openedAt: "12 - 02 - 2020",
        balance: "₦58,000,000.00",
        transactions: 63,
        lastActivity: "2 Hours ago",
        risk: "-",
        highlighted: true,
      },
      {
        id: "access-bank",
        bankName: "Access Bank",
        maskedAccountNumber: "****8821",
        tier: 3,
        type: "Savings",
        status: "active",
        openedAt: "12 - 02 - 2020",
        balance: "₦1,020,000.00",
        transactions: 63,
        lastActivity: "2 Hours ago",
        risk: "-",
      },
      {
        id: "gtbank",
        bankName: "GTBank",
        maskedAccountNumber: "****8821",
        tier: 1,
        type: "Domiciliary",
        status: "active",
        openedAt: "12 - 02 - 2020",
        balance: "₦1,020,000.00",
        transactions: 63,
        lastActivity: "2 Hours ago",
        risk: "-",
      },
      {
        id: "uba",
        bankName: "UBA",
        maskedAccountNumber: "****8821",
        tier: 1,
        type: "Savings",
        status: "dormant",
        openedAt: "12 - 02 - 2020",
        balance: "₦1,000.00",
        transactions: 63,
        lastActivity: "4 months ago",
        risk: "-",
      },
      {
        id: "zenith-bank",
        bankName: "Zenith Bank",
        maskedAccountNumber: "****8821",
        tier: 3,
        type: "Domiciliary",
        status: "active",
        openedAt: "12 - 02 - 2020",
        balance: "₦1,020,000.00",
        transactions: 63,
        lastActivity: "2 Hours ago",
        risk: "-",
      },
      {
        id: "stanbic-ibtc",
        bankName: "Stanbic IBTC",
        maskedAccountNumber: "****8821",
        tier: 3,
        type: "Savings",
        status: "dormant",
        openedAt: "12 - 02 - 2020",
        balance: "₦1,000.00",
        transactions: 63,
        lastActivity: "4 months ago",
        risk: "-",
      },
    ],
    linkedEntityAccounts: 4,
    linkedEntityRecords: [
      {
        id: "charles-family-trust",
        name: "Charles Family Trust",
        relationship: "Legitimate business entity",
        kind: "trust",
        tier: 3,
        sharedAccounts: 1,
        bankName: "First Bank",
        maskedAccountNumber: "****8821",
        balance: "N20,000,000.00",
        accountType: "Corporate",
        lastActivity: "2 Hours ago",
      },
      {
        id: "johnson-trading",
        name: "Johnson Trading Ltd",
        relationship: "Business partner",
        kind: "business",
        tier: 2,
        sharedAccounts: 2,
        bankName: "GTBank",
        maskedAccountNumber: "****8821",
        balance: "N20,000,000.00",
        accountType: "Corporate",
        lastActivity: "2 Hours ago",
      },
    ],
    accountAnalysis: {
      totalTransactions: 524,
      totalCredits: "₦58,420,000.00",
      creditTransactions: 312,
      totalDebits: "₦42,775,000.00",
      debitTransactions: 282,
      netPosition: "₦42,775,000.00",
      report: incomeSeries.map((income, index) => ({
        month: financialMonths[Math.floor(index / 3)] ?? "Dec",
        income,
        expenses: expenseSeries[index] ?? 0,
      })),
    },
    networkGraph: {
      nodes: [
        {
          id: "customer",
          label: "Customer",
          subtitle: "Primary account",
          kind: "customer",
          x: 50,
          y: 45,
        },
        { id: "uba", label: "UBA", subtitle: "Savings", kind: "bank", x: 50, y: 10 },
        {
          id: "stanbic",
          label: "Stanbic IBTC",
          subtitle: "Current",
          kind: "bank",
          x: 80,
          y: 22,
        },
        {
          id: "access",
          label: "Access Bank",
          subtitle: "Savings",
          kind: "bank",
          x: 8,
          y: 45,
        },
        {
          id: "gtbank",
          label: "GTBank",
          subtitle: "Current",
          kind: "bank",
          x: 92,
          y: 45,
        },
        {
          id: "zenith",
          label: "Zenith Bank",
          subtitle: "Savings",
          kind: "bank",
          x: 19,
          y: 69,
        },
        {
          id: "first-bank",
          label: "First Bank",
          subtitle: "Domiciliary",
          kind: "bank",
          x: 50,
          y: 80,
        },
        {
          id: "business-right",
          label: "Business",
          subtitle: "",
          kind: "business",
          x: 92,
          y: 60,
        },
        {
          id: "business-bottom",
          label: "Business",
          subtitle: "",
          kind: "business",
          x: 60,
          y: 93,
        },
      ],
      edges: [
        { from: "customer", to: "uba" },
        { from: "customer", to: "stanbic" },
        { from: "customer", to: "access" },
        { from: "customer", to: "gtbank" },
        { from: "customer", to: "zenith" },
        { from: "customer", to: "first-bank" },
        { from: "gtbank", to: "business-right", dashed: true },
        { from: "first-bank", to: "business-bottom", dashed: true },
      ],
    },
    alerts: [],
    complianceSections: [
      {
        id: "transaction-threshold",
        title: "Transaction Threshold Compliance",
        checks: [
          {
            id: "transaction-threshold-check",
            label: "Transaction Threshold",
            description:
              "Monitors transactions against regulatory limits and internal thresholds.",
            status: "No Match",
          },
        ],
      },
      {
        id: "pep",
        title: "Politically Exposed Person (PEP) Check",
        checks: [
          {
            id: "pep-match",
            label: "PEP Match",
            description: "Screens individuals against global PEP databases",
            status: "No Match",
          },
        ],
      },
      {
        id: "sanctions",
        title: "Sanctions Screening (Screened Against 4 Global Sanctions Lists)",
        checks: [
          { id: "ofac", label: "OFAC", status: "No Match", verified: true },
          { id: "un", label: "UN", status: "No Match", verified: true },
          { id: "eu", label: "EU", status: "No Match", verified: true },
          { id: "uk-hmt", label: "UK HMT", status: "No Match", verified: true },
        ],
      },
      {
        id: "warnings",
        title: "Warning and Regulatory Enforcement",
        checks: [
          {
            id: "warning-match",
            label: "Warnings",
            description:
              "Checks for adverse media, regulatory actions, fines, penalties, or enforcement",
            status: "No Match",
          },
        ],
      },
      {
        id: "watchlist",
        title: "Watchlist Screening",
        checks: [
          {
            id: "watchlist-match",
            label: "Watchlist Matches",
            description:
              "Screens against custom and proprietary watchlists including internal blacklists.",
            status: "No Match",
          },
        ],
      },
    ],
    decisionHistory: [
      {
        id: "ba-run-1-completed",
        type: "analysis-completed",
        title: "Bank analysis completed",
        description:
          "Account activity, linked entities, network relationships, and compliance checks were reviewed.",
        actor: "UnifyComply Analysis Engine",
        timestamp: "11 Jul 2026, 09:42",
      },
    ],
    profile: {
      name: "Alimi Ayomikun",
      reference: "#3066",
      entityType: "Individual",
      bvn: "22425685401",
      email: "Mikun@gmail.com",
      phone: "070123456789",
      lastReviewed: "12 mins ago",
    },
    networkMetrics: {
      alerts: 0,
      sharedAccounts: 2,
      totalTransactions: 5040,
      networkDepth: 2,
    },
  },
];

const highRiskBanner: BankAnalysisDetail["riskBanner"] = {
  alerts: 3,
  title: "High risk",
  description: "High risk indicators detected. Enhanced monitoring recommended",
  tone: "high",
};

export function getBankAnalysisDetailById(
  id: string,
  options?: { highRisk?: boolean },
): BankAnalysisDetail | undefined {
  const detail = bankAnalysisDetails.find((item) => item.id === id);

  if (!detail) {
    return undefined;
  }

  if (!options?.highRisk) {
    return detail;
  }

  return {
    ...detail,
    riskScore: 4,
    riskBanner: highRiskBanner,
    networkMetrics: {
      ...detail.networkMetrics,
      alerts: 3,
      sharedAccounts: 3,
      networkDepth: 3,
    },
  };
}
