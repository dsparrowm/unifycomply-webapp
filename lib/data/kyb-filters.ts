import type { KybFilterOption, KybListFilters } from "@/types/kyb";
import type {
  KycDateFilter,
  KycMoreFilter,
  KycPriorityFilter,
  KycSearchModeFilter,
  KycStatusFilter,
} from "@/types/kyc";

export const kybDefaultFilters: KybListFilters = {
  date: "all",
  status: "all",
  priority: "all",
  searchMode: "bulk-search",
  more: "all",
};

export const kybDateFilterOptions: KybFilterOption<KycDateFilter>[] = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last-7-days", label: "Last 7 days" },
  { value: "this-month", label: "This Month" },
  { value: "last-month", label: "Last Month" },
  { value: "last-3-months", label: "Last 3 Months" },
  { value: "last-6-months", label: "Last 6 Months" },
  { value: "specific-range", label: "Specific Date Range" },
];

export const kybStatusFilterOptions: KybFilterOption<KycStatusFilter>[] = [
  { value: "all", label: "All" },
  { value: "success", label: "Verified" },
  { value: "pending", label: "Pending" },
  { value: "in-review", label: "In Review" },
  { value: "failed", label: "Failed" },
  { value: "error", label: "Escalated" },
];

export const kybPriorityFilterOptions: KybFilterOption<KycPriorityFilter>[] = [
  { value: "all", label: "All" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "standard", label: "Standard" },
];

/** Figma KYB list — Batch search control (replaces KYC “Single entity”). */
export const kybSearchModeFilterOptions: KybFilterOption<KycSearchModeFilter>[] = [
  { value: "bulk-search", label: "Batch search" },
  { value: "single-entity-search", label: "Single entity search" },
];

export const kybMoreFilterOptions: KybFilterOption<KycMoreFilter>[] = [
  { value: "all", label: "All" },
  { value: "high-risk", label: "High risk" },
];
