import type { AmlListFilters, AmlScreeningRecord } from "@/types/aml-screening";

function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function isWithinDateFilter(submittedAt: string, dateFilter: AmlListFilters["date"]) {
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

export function filterAmlRecords(
  records: AmlScreeningRecord[],
  filters: AmlListFilters,
  searchQuery: string,
) {
  const query = searchQuery.trim().toLowerCase();

  return records.filter((record) => {
    if (!isWithinDateFilter(record.submittedAt, filters.date)) {
      return false;
    }

    if (filters.status !== "all" && record.status !== filters.status) {
      return false;
    }

    if (filters.monitoring === "yes" && !record.activeMonitoring) {
      return false;
    }

    if (filters.monitoring === "no" && record.activeMonitoring) {
      return false;
    }

    if (filters.assignee === "assigned" && !record.assignedTo) {
      return false;
    }

    if (filters.assignee === "unassigned" && record.assignedTo) {
      return false;
    }

    if (filters.more === "high-risk" && record.riskScore < 3) {
      return false;
    }

    if (filters.more === "batch-only" && record.screeningType !== "batch") {
      return false;
    }

    if (filters.more === "manual-only" && record.screeningType !== "manual") {
      return false;
    }

    if (
      query &&
      ![
        record.amlId,
        record.screeningId,
        record.entityName,
        record.initiatedBy,
        record.assignedTo ?? "",
        record.status,
        record.screeningType,
      ].some((value) => value.toLowerCase().includes(query))
    ) {
      return false;
    }

    return true;
  });
}
