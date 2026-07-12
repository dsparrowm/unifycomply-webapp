import { AlertTriangle, CheckCircle2, Clock3, XCircle } from "lucide-react";
import type { KycMetric } from "@/types/kyc";
import { cn } from "@/lib/utils";

const toneStyles = {
  success: "text-[color:var(--state-success)] bg-[color:var(--state-success-soft)]",
  info: "text-[color:var(--state-info)] bg-[color:var(--state-info-soft)]",
  warning: "text-[color:var(--state-warning)] bg-[color:var(--state-warning-soft)]",
  error: "text-[color:var(--state-error)] bg-[color:var(--state-error-soft)]",
} as const;

const toneIcons = {
  success: CheckCircle2,
  info: Clock3,
  warning: AlertTriangle,
  error: XCircle,
} as const;

type KycMetricCardsProps = {
  metrics: KycMetric[];
};

export function KycMetricCards({ metrics }: KycMetricCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = toneIcons[metric.tone];

        return (
          <div
            key={metric.id}
            className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[color:var(--text-muted)]">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold text-[color:var(--text-primary)]">
                  {metric.value}
                </p>
              </div>
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  toneStyles[metric.tone],
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
