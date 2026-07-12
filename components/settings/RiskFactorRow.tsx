import { ChevronDown } from "lucide-react";
import { riskFactorImpactOptions } from "@/lib/data/settings";
import type { SettingsRiskFactor, SettingsRiskFactorImpact } from "@/types/settings";
import { cn } from "@/lib/utils";

const impactLabels: Record<SettingsRiskFactorImpact, string> = {
  low: "+1 Low Impact",
  medium: "+2 Medium Impact",
  high: "+3 High Impact",
};

type RiskFactorRowProps = {
  factor: SettingsRiskFactor;
  onImpactChange: (impact: SettingsRiskFactorImpact) => void;
};

export function RiskFactorRow({ factor, onImpactChange }: RiskFactorRowProps) {
  return (
    <div className="rounded-lg border border-[color:var(--border-default)] px-6 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-[color:var(--text-primary)]">{factor.title}</p>
            {factor.enabled ? (
              <span className="inline-flex items-center rounded-full bg-[color:var(--state-success-soft)] px-2 py-0.5 text-xs font-medium text-[color:var(--state-success)]">
                Enabled
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-[color:var(--text-light)]">{factor.description}</p>
        </div>

        <div className="relative shrink-0">
          <select
            value={factor.impact}
            onChange={(event) => onImpactChange(event.target.value as SettingsRiskFactorImpact)}
            aria-label={`Impact for ${factor.title}`}
            className={cn(
              "appearance-none rounded-full border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] py-1.5 pl-3 pr-8 text-xs font-medium text-[color:var(--text-primary)]",
              "outline-none transition-colors focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]",
            )}
          >
            {riskFactorImpactOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[color:var(--text-light)]" />
          <span className="sr-only">{impactLabels[factor.impact]}</span>
        </div>
      </div>
    </div>
  );
}
