import type {
  TmQueueFilters,
  TmTransactionRecord,
} from "@/types/transaction-monitoring";

export function filterQueueRecords(
  records: TmTransactionRecord[],
  filters: TmQueueFilters,
): TmTransactionRecord[] {
  return records.filter((record) => {
    if (filters.status !== "all" && record.status !== filters.status) {
      return false;
    }
    if (filters.entity !== "all" && record.entityType !== filters.entity) {
      return false;
    }
    if (filters.more === "high-risk" && record.riskScore < 60) {
      return false;
    }
    if (filters.more === "rules-triggered" && record.rulesTriggered <= 0) {
      return false;
    }
    return true;
  });
}
