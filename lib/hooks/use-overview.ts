"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getDashboardActivity,
  getDashboardApiCalls,
  getDashboardHighRiskAlerts,
  getDashboardSummary,
} from "@/lib/api/dashboard";

export function useOverviewDashboard() {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: async () => {
      const [summary, highRisk, activities, apiCalls] = await Promise.all([
        getDashboardSummary(),
        getDashboardHighRiskAlerts(),
        getDashboardActivity(),
        getDashboardApiCalls(),
      ]);

      return {
        summary,
        highRiskCount: highRisk.meta?.totalItems ?? 0,
        activities,
        apiCalls,
      };
    },
  });
}