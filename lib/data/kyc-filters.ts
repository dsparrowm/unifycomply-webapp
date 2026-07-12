import type {
  KycDateFilter,
  KycFilterOption,
  KycListFilters,
  KycMoreFilter,
  KycPriorityFilter,
  KycSearchModeFilter,
  KycStatusFilter,
} from "@/types/kyc";

export const kycDefaultFilters: KycListFilters = {
  date: "all",
  status: "all",
  priority: "all",
  searchMode: "single-entity-search",
  more: "all",
};

/** Figma frame 80 (`886:70782`) — Date dropdown */
export const kycDateFilterOptions: KycFilterOption<KycDateFilter>[] = [
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

/** Figma frame 81 (`886:71156`) — Status dropdown */
export const kycStatusFilterOptions: KycFilterOption<KycStatusFilter>[] = [
  { value: "all", label: "All" },
  { value: "success", label: "Success" },
  { value: "pending", label: "Pending" },
  { value: "in-review", label: "In Review" },
  { value: "failed", label: "Failed" },
  { value: "error", label: "Error" },
];

/** Figma frame 82 (`886:71529`) — Priorities dropdown */
export const kycPriorityFilterOptions: KycFilterOption<KycPriorityFilter>[] = [
  { value: "all", label: "All" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "standard", label: "Standard" },
];

/** Figma frame 83 (`886:71902`) — Single entity search mode */
export const kycSearchModeFilterOptions: KycFilterOption<KycSearchModeFilter>[] = [
  { value: "single-entity-search", label: "Single entity search" },
  { value: "bulk-search", label: "Bulk search" },
];

/** Figma frames 84–85 — More filters dropdown */
export const kycMoreFilterOptions: KycFilterOption<KycMoreFilter>[] = [
  { value: "all", label: "All" },
  { value: "high-risk", label: "High risk" },
];
