"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getDashboardActivity,
  getDashboardApiCalls,
  getDashboardHighRiskAlerts,
  getDashboardSummary,
  getDashboardVerificationTypes,
} from "@/lib/api/dashboard";

export function useOverviewDashboard() {
  return useQuery({
    queryKey: ["dashboard", "overview", "verification-types"],
    queryFn: async () => {
      const [summary, highRisk, activities, apiCalls, verificationTypes] = await Promise.all([
        getDashboardSummary(),
        getDashboardHighRiskAlerts(),
        getDashboardActivity(),
        getDashboardApiCalls(),
        getDashboardVerificationTypes(),
      ]);

      return {
        summary,
        highRiskCount: highRisk.meta?.totalItems ?? 0,
        activities,
        apiCalls,
        verificationTypes,
      };
    },
  });
}