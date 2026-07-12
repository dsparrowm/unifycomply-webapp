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
};

export type BankAnalysisListData = {
  metrics: BankAnalysisMetric[];
  runs: BankAnalysisRun[];
};
