import type { BankAnalysisBatchEntity, BankAnalysisBatchFilters } from "@/types/bank-analysis";

export function filterBankAnalysisBatchEntities(
  records: BankAnalysisBatchEntity[],
  filters: BankAnalysisBatchFilters,
) {
  return records.filter((record) => {
    if (filters.status !== "all" && record.status !== filters.status) {
      return false;
    }

    if (filters.assignee !== "all" && record.assignedTo !== filters.assignee) {
      return false;
    }

    if (filters.type !== "all" && record.entityType !== filters.type) {
      return false;
    }

    if (filters.more === "high-risk" && record.riskScore < 3) {
      return false;
    }

    return true;
  });
}