import type {
  BankAnalysisAssigneeFilter,
  BankAnalysisDateFilter,
  BankAnalysisFilterOption,
  BankAnalysisListFilters,
  BankAnalysisMoreFilter,
  BankAnalysisStatusFilter,
  BankAnalysisTypeFilter,
} from "@/types/bank-analysis";

export const bankAnalysisDefaultFilters: BankAnalysisListFilters = {
  date: "all",
  status: "all",
  assignee: "all",
  type: "all",
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
    { value: "specific-range", label: "Specific Date Range" },
  ];

export const bankAnalysisStatusFilterOptions: BankAnalysisFilterOption<BankAnalysisStatusFilter>[] =
  [
    { value: "all", label: "All statuses" },
    { value: "clear", label: "Clear" },
    { value: "flagged", label: "Flagged" },
    { value: "in-review", label: "Under Review" },
    { value: "blocked", label: "Blocked" },
  ];

export const bankAnalysisAssigneeFilterOptions: BankAnalysisFilterOption<BankAnalysisAssigneeFilter>[] =
  [
    { value: "all", label: "All assignees" },
    { value: "Alimi Ayomikun", label: "Alimi Ayomikun" },
    { value: "Tejumade Olomola", label: "Tejumade Olomola" },
    { value: "Favour Soma", label: "Favour Soma" },
  ];

export const bankAnalysisTypeFilterOptions: BankAnalysisFilterOption<BankAnalysisTypeFilter>[] =
  [
    { value: "all", label: "All types" },
    { value: "batch", label: "Batch" },
    { value: "organization", label: "Organization" },
    { value: "individual", label: "Individual" },
    { value: "manual", label: "Manual" },
  ];

export const bankAnalysisMoreFilterOptions: BankAnalysisFilterOption<BankAnalysisMoreFilter>[] =
  [
    { value: "all", label: "All records" },
    { value: "high-risk", label: "High risk only" },
  ];
