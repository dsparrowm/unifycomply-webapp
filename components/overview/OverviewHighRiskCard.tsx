import { ShieldAlert } from "lucide-react";
import { OverviewSectionHeader } from "@/components/overview/OverviewSectionHeader";

type OverviewHighRiskCardProps = {
  count: number;
};

export function OverviewHighRiskCard({ count }: OverviewHighRiskCardProps) {
  return (
    <section className="flex min-h-[256px] flex-col rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <OverviewSectionHeader
        icon={ShieldAlert}
        iconTone="warning"
        title="High Risk Alert"
        action={
          <button
            type="button"
            className="text-sm text-[color:var(--accent-primary-hover)] hover:underline"
          >
            View all
          </button>
        }
      />

      <div className="mt-6 space-y-1">
        <p className="text-base font-medium text-[color:var(--text-primary)]">
          Verification with urgent attention
        </p>
        <p className="text-xs leading-relaxed text-[color:var(--text-muted)]">
          Submitted verification details contain potential matches to PEPs, sanctioned
          entities, or adverse media
        </p>
      </div>

      <p className="mt-auto pt-10 text-[60px] font-semibold leading-none text-[color:var(--text-primary)]">
        {count}
      </p>
    </section>
  );
}
