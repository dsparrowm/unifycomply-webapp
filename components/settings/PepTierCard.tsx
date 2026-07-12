import type { ReactNode } from "react";
import { Pencil } from "lucide-react";
import { PepTierBadge } from "@/components/settings/PepTierBadge";
import type { SettingsPepTier } from "@/types/settings";
import { cn } from "@/lib/utils";

type PepTierCardProps = {
  tier: SettingsPepTier;
  onEdit: () => void;
};

function MetricCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-4 py-4">
      <p className="text-xs text-[color:var(--text-light)]">{label}</p>
      <div className="mt-2 text-sm font-medium text-[color:var(--text-primary)]">{children}</div>
    </div>
  );
}

export function PepTierCard({ tier, onEdit }: PepTierCardProps) {
  return (
    <article className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-medium text-[color:var(--text-primary)]">{tier.title}</h3>
            <PepTierBadge level={tier.level} />
          </div>
          <p className="mt-1 text-xs text-[color:var(--text-light)]">{tier.description}</p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-[color:var(--text-light)] transition-colors hover:text-[color:var(--text-primary)]"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden />
          Edit
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <MetricCard label="Risk Score Impact">+{tier.riskScoreImpact} Points</MetricCard>
        <MetricCard label="Requires Approval">{tier.requiresApproval ? "Yes" : "No"}</MetricCard>
        <MetricCard label="Auto-Escalation">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              tier.autoEscalation
                ? "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]"
                : "bg-[color:var(--bg-muted)] text-[color:var(--text-muted)]",
            )}
          >
            {tier.autoEscalation ? "Immediate" : "Disabled"}
          </span>
        </MetricCard>
      </div>

      <div className="mt-4 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-4 py-4">
        <p className="text-xs font-medium text-[color:var(--text-primary)]">Examples</p>
        <ul className="mt-2 space-y-1.5">
          {tier.examples.map((example) => (
            <li
              key={example}
              className="flex items-center gap-2 text-xs text-[color:var(--text-light)]"
            >
              <span className="h-1 w-1 shrink-0 rounded-full bg-[color:var(--text-light)]" />
              {example}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
