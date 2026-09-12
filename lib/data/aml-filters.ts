import type {
  AmlAssigneeFilter,
  AmlDateFilter,
  AmlFilterOption,
  AmlListFilters,
  AmlMonitoringFilter,
  AmlMoreFilter,
  AmlStatusFilter,
} from "@/types/aml";

export const amlDefaultFilters: AmlListFilters = {
  date: "all",
  status: "all",
  monitoring: "all",
  assignee: "all",
  more: "all",
};

/** Frame 16 — Date dropdown */
export const amlDateFilterOptions: AmlFilterOption<AmlDateFilter>[] = [
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

/** Frame 17 — Status. Badge copy uses In Review (020); 017 says Under Review. */
export const amlStatusFilterOptions: AmlFilterOption<AmlStatusFilter>[] = [
  { value: "all", label: "All" },
  { value: "clear", label: "Clear" },
  { value: "flagged", label: "Flagged" },
  { value: "in-review", label: "In Review" },
  { value: "blocked", label: "Blocked" },
];

/** Frame 18 — Monitoring */
export const amlMonitoringFilterOptions: AmlFilterOption<AmlMonitoringFilter>[] = [
  { value: "all", label: "All" },
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
];

/** Frame 19 — Assignee */
export const amlAssigneeFilterOptions: AmlFilterOption<AmlAssigneeFilter>[] = [
  { value: "all", label: "All" },
  { value: "Alimi Ayomikun", label: "Alimi Ayomikun" },
  { value: "Tejumade Olomola", label: "Tejumade Olomola" },
  { value: "Favour Soma", label: "Favour Soma" },
];

export const amlMoreFilterOptions: AmlFilterOption<AmlMoreFilter>[] = [
  { value: "all", label: "All" },
  { value: "high-risk", label: "High risk" },
];
