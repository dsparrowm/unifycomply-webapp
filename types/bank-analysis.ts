import type { KycFilterOption, KycMetric, KycPriority } from "@/types/kyc";

export type BankAnalysisMetric = KycMetric;

export type BankAnalysisRunStatus = "completed" | "pending" | "in-review" | "failed";

export type BankAnalysisPriority = KycPriority;

export type BankAnalysisDateFilter =
  | "all"
  | "today"
  | "yesterday"
  | "last-7-days"
  | "this-month"
  | "last-month"
  | "last-3-months"
  | "last-6-months"
  | "specific-range";

export type BankAnalysisStatusFilter =
  | "all"
  | "success"
  | "pending"
  | "in-review"
  | "failed";

export type BankAnalysisPriorityFilter = "all" | "urgent" | "high" | "medium" | "standard";

export type BankAnalysisBankFilter =
  | "all"
  | "access-bank"
  | "gtbank"
  | "first-bank"
  | "zenith-bank"
  | "uba";

export type BankAnalysisMoreFilter = "all" | "high-risk";
export type BankAnalysisLookupBank = Exclude<BankAnalysisBankFilter, "all">;
export type BankAnalysisLookupMode = "single" | "batch";

export type BankAnalysisListFilters = {
  date: BankAnalysisDateFilter;
  status: BankAnalysisStatusFilter;
  priority: BankAnalysisPriorityFilter;
  bank: BankAnalysisBankFilter;
  more: BankAnalysisMoreFilter;
};

export type BankAnalysisFilterOption<T extends string = string> = KycFilterOption<T>;

export type BankAnalysisRun = {
  id: string;
  analysisId: string;
  entityName: string;
  accountNumber: string;
  bank: string;
  bankKey: BankAnalysisBankFilter;
  country: string;
  status: BankAnalysisRunStatus;
  alertsGenerated: number;
  riskScore: number;
  priority: BankAnalysisPriority;
  dateRun: string;
  submittedAt: string;
  detailAvailable?: boolean;
};

export type BankAnalysisListData = {
  metrics: BankAnalysisMetric[];
  runs: BankAnalysisRun[];
};

export type BankAnalysisBatchRecord = {
  id: string;
  analysisId: string;
  entityName: string;
  accountNumber: string;
  bank: string;
  country: string;
  status: BankAnalysisRunStatus;
  alertsGenerated: number;
  riskScore: number;
  detailId?: string;
};

export type BankAnalysisBatchResult = {
  id: string;
  batchName: string;
  fileName: string;
  submittedAt: string;
  totalRecords: number;
  completed: number;
  inReview: number;
  failed: number;
  records: BankAnalysisBatchRecord[];
};

export type BankAnalysisAccountStatus = "active" | "dormant";

export type BankAnalysisAccount = {
  id: string;
  bankName: string;
  maskedAccountNumber: string;
  tier: 1 | 3;
  type: "Current" | "Savings" | "Domiciliary";
  status: BankAnalysisAccountStatus;
  openedAt: string;
  balance: string;
  transactions: number;
  lastActivity: string;
  risk: string;
  highlighted?: boolean;
};

export type BankAnalysisProfile = {
  name: string;
  reference: string;
  entityType: "Individual" | "Business";
  bvn: string;
  email: string;
  phone: string;
  lastReviewed: string;
};

export type BankAnalysisNetworkMetrics = {
  alerts: number;
  sharedAccounts: number;
  totalTransactions: number;
  networkDepth: number;
};

export type BankAnalysisLinkedEntity = {
  id: string;
  name: string;
  relationship: string;
  kind: "trust" | "business";
  tier: 2 | 3;
  sharedAccounts: number;
  bankName: string;
  maskedAccountNumber: string;
  balance: string;
  accountType: "Corporate";
  lastActivity: string;
};

export type BankAnalysisFinancialPoint = {
  month: string;
  income: number;
  expenses: number;
};

export type BankAnalysisAccountAnalysis = {
  totalTransactions: number;
  totalCredits: string;
  creditTransactions: number;
  totalDebits: string;
  debitTransactions: number;
  netPosition: string;
  report: BankAnalysisFinancialPoint[];
};

export type BankAnalysisNetworkNode = {
  id: string;
  label: string;
  subtitle: string;
  kind: "customer" | "bank" | "business";
  x: number;
  y: number;
};

export type BankAnalysisNetworkEdge = {
  from: string;
  to: string;
  dashed?: boolean;
};

export type BankAnalysisNetworkGraph = {
  nodes: BankAnalysisNetworkNode[];
  edges: BankAnalysisNetworkEdge[];
};

export type BankAnalysisComplianceCheck = {
  id: string;
  label: string;
  description?: string;
  status: "No Match";
  verified?: boolean;
};

export type BankAnalysisComplianceSection = {
  id: string;
  title: string;
  checks: BankAnalysisComplianceCheck[];
};

export type BankAnalysisAlertSeverity = "medium" | "high" | "critical";

export type BankAnalysisAlert = {
  id: string;
  title: string;
  description: string;
  severity: BankAnalysisAlertSeverity;
  status: "Open" | "Under Review";
  accountNumber: string;
  amount: string;
  detectedAt: string;
};

export type BankAnalysisDecisionType = "analysis-completed" | "review-started" | "escalated";

export type BankAnalysisDecisionHistoryEntry = {
  id: string;
  type: BankAnalysisDecisionType;
  title: string;
  description: string;
  actor: string;
  timestamp: string;
};

export type BankAnalysisDetail = {
  id: string;
  customerName: string;
  accountPortfolio: number;
  linkedEntities: number;
  accounts: BankAnalysisAccount[];
  linkedEntityAccounts: number;
  linkedEntityRecords: BankAnalysisLinkedEntity[];
  accountAnalysis: BankAnalysisAccountAnalysis;
  networkGraph: BankAnalysisNetworkGraph;
  alerts: BankAnalysisAlert[];
  complianceSections: BankAnalysisComplianceSection[];
  decisionHistory: BankAnalysisDecisionHistoryEntry[];
  profile: BankAnalysisProfile;
  networkMetrics: BankAnalysisNetworkMetrics;
};
