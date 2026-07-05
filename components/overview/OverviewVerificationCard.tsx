import { Activity } from "lucide-react";
import type { OverviewVerificationStats } from "@/types/overview";
import { OverviewSectionHeader } from "@/components/overview/OverviewSectionHeader";

type RateStatProps = {
  value: number;
  label: string;
  tone: "success" | "error" | "warning";
};

const toneColors = {
  success: "bg-[color:var(--state-success)]",
  error: "bg-[color:var(--state-error)]",
  warning: "bg-[color:var(--state-warning)]",
} as const;

function RateStat({ value, label, tone }: RateStatProps) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-3 w-3 shrink-0 rounded-full ${toneColors[tone]}`} />
      <div>
        <p className="text-sm font-medium text-[color:var(--text-primary)]">
          {value.toFixed(1)}%
        </p>
        <p className="text-xs text-[color:var(--text-muted)]">{label}</p>
      </div>
    </div>
  );
}

type OverviewVerificationCardProps = {
  stats: OverviewVerificationStats;
};

export function OverviewVerificationCard({ stats }: OverviewVerificationCardProps) {
  return (
    <section className="flex min-h-[256px] flex-col rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <OverviewSectionHeader icon={Activity} title="Total Verification" />

      <p className="mt-14 text-[60px] font-semibold leading-none text-[color:var(--text-primary)]">
        {stats.total}
      </p>

      <div className="mt-auto flex flex-wrap gap-x-8 gap-y-4 pt-8">
        <RateStat value={stats.successRate} label="Success rate" tone="success" />
        <RateStat value={stats.failureRate} label="Failure rate" tone="error" />
        <RateStat value={stats.pendingReviewRate} label="Pending review" tone="warning" />
      </div>
    </section>
  );
}
