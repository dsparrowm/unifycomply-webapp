import type {
  TmCategoryFilter,
  TmDateFilter,
  TmEntityFilter,
  TmFilterOption,
  TmListFilters,
  TmMoreFilter,
  TmQueueFilters,
  TmStatusFilter,
} from "@/types/transaction-monitoring";

export const tmDefaultFilters: TmListFilters = {
  date: "all",
  status: "all",
  category: "all",
  more: "all",
};

/** Figma `TM Category-3` — Date dropdown */
export const tmDateFilterOptions: TmFilterOption<TmDateFilter>[] = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last-7-days", label: "Last 7 days" },
  { value: "this-month", label: "This Month" },
  { value: "last-month", label: "Last Month" },
];

/** Figma `TM Category-4` — Status dropdown */
export const tmStatusFilterOptions: TmFilterOption<TmStatusFilter>[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "cleared", label: "Cleared" },
  { value: "in-review", label: "Review" },
  { value: "blocked", label: "Blocked" },
];

export const tmCategoryFilterOptions: TmFilterOption<TmCategoryFilter>[] = [
  { value: "all", label: "All" },
  { value: "tm-not-blocked", label: "Non Blocked" },
  { value: "stop-payment", label: "Stop Payment" },
  { value: "cumulative-frequency", label: "Cumul. Freq" },
  { value: "tm-blocked", label: "Blocked" },
];

export const tmMoreFilterOptions: TmFilterOption<TmMoreFilter>[] = [
  { value: "all", label: "All" },
  { value: "high-risk", label: "High risk (≥60%)" },
  { value: "rules-triggered", label: "Rules triggered" },
];

export const tmDefaultQueueFilters: TmQueueFilters = {
  date: "all",
  status: "all",
  entity: "all",
  more: "all",
};

export const tmEntityFilterOptions: TmFilterOption<TmEntityFilter>[] = [
  { value: "all", label: "All" },
  { value: "individual", label: "Individual" },
  { value: "organization", label: "Organization" },
];
