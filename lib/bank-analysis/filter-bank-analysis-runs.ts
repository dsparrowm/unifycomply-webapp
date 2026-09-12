import { defaultApprovalThresholds } from "@/lib/kyc/risk-score";
import type { BankAnalysisListFilters, BankAnalysisRun } from "@/types/bank-analysis";

const HIGH_RISK_THRESHOLD = defaultApprovalThresholds.approvalBlockThreshold;

function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function isWithinDateFilter(submittedAt: string, dateFilter: BankAnalysisListFilters["date"]) {
  if (dateFilter === "all" || dateFilter === "specific-range") {
    return true;
  }

  const submitted = startOfDay(new Date(submittedAt));
  const today = startOfDay(new Date());

  switch (dateFilter) {
    case "today":
      return submitted.getTime() === today.getTime();
    case "yesterday": {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return submitted.getTime() === yesterday.getTime();
    }
    case "last-7-days": {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 6);
      return submitted >= weekAgo && submitted <= today;
    }
    case "this-month":
      return (
        submitted.getFullYear() === today.getFullYear() &&
        submitted.getMonth() === today.getMonth()
      );
    case "last-month": {
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      return (
        submitted.getFullYear() === lastMonth.getFullYear() &&
        submitted.getMonth() === lastMonth.getMonth()
      );
    }
    case "last-3-months": {
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return submitted >= startOfDay(threeMonthsAgo) && submitted <= today;
    }
    case "last-6-months": {
      const sixMonthsAgo = new Date(today);
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return submitted >= startOfDay(sixMonthsAgo) && submitted <= today;
    }
    default:
      return true;
  }
}

export function filterBankAnalysisRuns(runs: BankAnalysisRun[], filters: BankAnalysisListFilters) {
  return runs.filter((run) => {
    if (!isWithinDateFilter(run.submittedAt, filters.date)) {
      return false;
    }

    if (filters.status !== "all" && run.status !== filters.status) {
      return false;
    }

    if (filters.assignee !== "all" && run.assignedTo !== filters.assignee) {
      return false;
    }

    if (filters.type !== "all" && run.type !== filters.type) {
      return false;
    }

    if (filters.more === "high-risk" && run.riskScore < HIGH_RISK_THRESHOLD) {
      return false;
    }

    return true;
  });
}