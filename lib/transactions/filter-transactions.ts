import type {
  TmListFilters,
  TmTransactionRecord,
} from "@/types/transaction-monitoring";

export function filterTransactionRecords(
  records: TmTransactionRecord[],
  filters: TmListFilters,
): TmTransactionRecord[] {
  return records.filter((record) => {
    if (filters.status !== "all" && record.status !== filters.status) {
      return false;
    }

    if (filters.category !== "all" && record.category !== filters.category) {
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
