import { AlertTriangle, CheckCircle2, Clock3, XCircle } from "lucide-react";
import type { KybMetric } from "@/types/kyb";
import { cn } from "@/lib/utils";

const metricPresentation: Record<
  string,
  {
    icon: typeof CheckCircle2;
    iconClass: string;
  }
> = {
  successful: {
    icon: CheckCircle2,
    iconClass: "text-[color:var(--state-info)] bg-[color:var(--state-info-soft)]",
  },
  pending: {
    icon: Clock3,
    iconClass: "text-[color:var(--state-warning)] bg-[color:var(--state-warning-soft)]",
  },
  "high-risk": {
    icon: AlertTriangle,
    iconClass: "text-[color:var(--state-warning)] bg-[color:var(--state-warning-soft)]",
  },
  rejected: {
    icon: XCircle,
    iconClass: "text-[color:var(--state-error)] bg-[color:var(--state-error-soft)]",
  },
};

const fallbackPresentation = {
  icon: CheckCircle2,
  iconClass: "text-[color:var(--text-muted)] bg-[color:var(--bg-muted)]",
};

type KybMetricCardsProps = {
  metrics: KybMetric[];
};

export function KybMetricCards({ metrics }: KybMetricCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const presentation = metricPresentation[metric.id] ?? fallbackPresentation;
        const Icon = presentation.icon;

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
                  presentation.iconClass,
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
