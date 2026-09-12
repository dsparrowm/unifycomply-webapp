import type { AmlBatchEntity, AmlListFilters } from "@/types/aml";

export function filterAmlBatchEntities(records: AmlBatchEntity[], filters: AmlListFilters) {
  return records.filter((record) => {
    if (filters.status !== "all" && record.status !== filters.status) {
      return false;
    }

    if (filters.monitoring !== "all") {
      const wantsActive = filters.monitoring === "yes";
      if (record.monitoringActive !== wantsActive) {
        return false;
      }
    }

    if (filters.assignee !== "all" && record.assignedTo !== filters.assignee) {
      return false;
    }

    if (filters.more === "high-risk" && record.riskScore < 3) {
      return false;
    }

    return true;
  });
}
