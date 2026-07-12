import type {
  BankAnalysisBankFilter,
  BankAnalysisDateFilter,
  BankAnalysisFilterOption,
  BankAnalysisListFilters,
  BankAnalysisMoreFilter,
  BankAnalysisPriorityFilter,
  BankAnalysisStatusFilter,
} from "@/types/bank-analysis";

export const bankAnalysisDefaultFilters: BankAnalysisListFilters = {
  date: "all",
  status: "all",
  priority: "all",
  bank: "all",
  more: "all",
};

export const bankAnalysisDateFilterOptions: BankAnalysisFilterOption<BankAnalysisDateFilter>[] =
  [
    { value: "all", label: "All time" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "last-7-days", label: "Last 7 days" },
    { value: "this-month", label: "This month" },
    { value: "last-month", label: "Last month" },
    { value: "last-3-months", label: "Last 3 months" },
    { value: "last-6-months", label: "Last 6 months" },
    { value: "specific-range", label: "Specific range" },
  ];

export const bankAnalysisStatusFilterOptions: BankAnalysisFilterOption<BankAnalysisStatusFilter>[] =
  [
    { value: "all", label: "All statuses" },
    { value: "success", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "in-review", label: "In review" },
    { value: "failed", label: "Failed" },
  ];

export const bankAnalysisPriorityFilterOptions: BankAnalysisFilterOption<BankAnalysisPriorityFilter>[] =
  [
    { value: "all", label: "All priorities" },
    { value: "urgent", label: "Critical" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "standard", label: "Low" },
  ];

export const bankAnalysisBankFilterOptions: BankAnalysisFilterOption<BankAnalysisBankFilter>[] =
  [
    { value: "all", label: "All banks" },
    { value: "access-bank", label: "Access Bank" },
    { value: "gtbank", label: "GTBank" },
    { value: "first-bank", label: "First Bank" },
    { value: "zenith-bank", label: "Zenith Bank" },
    { value: "uba", label: "UBA" },
  ];

export const bankAnalysisMoreFilterOptions: BankAnalysisFilterOption<BankAnalysisMoreFilter>[] =
  [
    { value: "all", label: "All records" },
    { value: "high-risk", label: "High risk only" },
  ];
