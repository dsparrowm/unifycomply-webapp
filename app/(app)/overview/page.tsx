"use client";

import { OverviewApiCallsChart } from "@/components/overview/OverviewApiCallsChart";
import { OverviewEndpointsCard } from "@/components/overview/OverviewEndpointsCard";
import { OverviewHighRiskCard } from "@/components/overview/OverviewHighRiskCard";
import { OverviewPageHeader } from "@/components/overview/OverviewPageHeader";
import { OverviewQuickActions } from "@/components/overview/OverviewQuickActions";
import { OverviewRecentActivityCard } from "@/components/overview/OverviewRecentActivityCard";
import { OverviewVerificationCard } from "@/components/overview/OverviewVerificationCard";
import {
  overviewDashboardData,
  overviewQuickActions,
} from "@/lib/data/overview";
import { useOverviewDashboard } from "@/lib/hooks/use-overview";
import type {
  OverviewActivityItem,
  OverviewActivityTone,
  OverviewApiCallsPoint,
  OverviewDashboardApiData,
} from "@/types/overview";

function activityTone(status: string | undefined): OverviewActivityTone {
  const value = status?.toLowerCase() ?? "";
  if (["failed", "error", "blocked"].includes(value)) return "warning";
  if (["verified", "completed", "success", "passed"].includes(value)) return "success";
  if (["started", "pending", "review"].includes(value)) return "info";
  return "neutral";
}

function mapActivities(
  activities: Array<{
    id?: string;
    event?: string;
    action?: string;
    message?: string;
    user?: string;
    actor?: string;
    createdAt?: string;
    timestamp?: string;
    status?: string;
  }>,
): OverviewActivityItem[] {
  return activities.map((activity, index) => ({
    id: activity.id ?? `activity-${index}`,
    message: activity.message ?? activity.event ?? activity.action ?? "Tenant activity",
    user: activity.user ?? activity.actor ?? "System",
    timestamp: activity.timestamp ?? activity.createdAt ?? "Recently",
    tone: activityTone(activity.status ?? activity.event ?? activity.action),
  }));
}

function mapApiCalls(
  points: Array<{
    month?: string | number;
    label?: string | number;
    successful?: number;
    success?: number;
    failed?: number;
    errors?: number;
  }>,
): OverviewApiCallsPoint[] {
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return points.map((point) => ({
    label: String(
      typeof (point.label ?? point.month) === "number"
        ? monthLabels[Number(point.label ?? point.month) - 1] ?? String(point.label ?? point.month)
        : point.label ?? point.month ?? "",
    ),
    calls: point.successful ?? point.success ?? 0,
    errors: point.failed ?? point.errors ?? 0,
  }));
}

export default function OverviewPage() {
  const { data } = useOverviewDashboard();
  const liveData: OverviewDashboardApiData | null = data
    ? {
        verification: {
          total: data.summary.total ?? 0,
          successRate: data.summary.successRate ?? 0,
          failureRate: data.summary.failureRate ?? 0,
          pendingReviewRate: data.summary.pendingReviewRate ?? 0,
        },
        highRiskCount: data.highRiskCount,
        activities: mapActivities(data.activities),
        apiCalls: mapApiCalls(data.apiCalls),
      }
    : null;

  const { walletBalance, verification, highRiskCount, endpoints, activities, apiCalls } =
    overviewDashboardData;
  const dashboard = liveData ?? { verification, highRiskCount, activities, apiCalls };

  return (
    <div className="flex flex-col gap-[32px]">
      <OverviewPageHeader walletBalance={walletBalance} />

      <OverviewQuickActions actions={overviewQuickActions} />

      <div className="grid gap-[32px] xl:grid-cols-[722fr_573fr]">
        <OverviewVerificationCard stats={dashboard.verification} />
        <OverviewHighRiskCard count={dashboard.highRiskCount} />
      </div>

      <div className="grid gap-[32px] xl:grid-cols-[818fr_477fr]">
        <OverviewEndpointsCard endpoints={endpoints} />
        <OverviewRecentActivityCard activities={dashboard.activities} />
      </div>

      <OverviewApiCallsChart data={dashboard.apiCalls} />
    </div>
  );
}
