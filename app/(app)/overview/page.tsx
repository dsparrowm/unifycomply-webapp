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

export default function OverviewPage() {
  const { walletBalance, verification, highRiskCount, endpoints, activities, apiCalls } =
    overviewDashboardData;

  return (
    <div className="flex flex-col gap-[32px]">
      <OverviewPageHeader walletBalance={walletBalance} />

      <OverviewQuickActions actions={overviewQuickActions} />

      <div className="grid gap-[32px] xl:grid-cols-[722fr_573fr]">
        <OverviewVerificationCard stats={verification} />
        <OverviewHighRiskCard count={highRiskCount} />
      </div>

      <div className="grid gap-[32px] xl:grid-cols-[818fr_477fr]">
        <OverviewEndpointsCard endpoints={endpoints} />
        <OverviewRecentActivityCard activities={activities} />
      </div>

      <OverviewApiCallsChart data={apiCalls} />
    </div>
  );
}
