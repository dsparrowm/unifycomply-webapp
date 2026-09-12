import { Check, CircleAlert, Clock3, LayoutGrid, X } from "lucide-react";
import type { AmlMetric } from "@/types/aml";

const metricIcons = {
  total: LayoutGrid,
  active: Clock3,
  clear: Check,
  blocked: X,
  matches: X,
  none: Check,
  errors: CircleAlert,
} as const;

type AmlMetricCardsProps = {
  metrics: AmlMetric[];
};

export function AmlMetricCards({ metrics }: AmlMetricCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metricIcons[metric.id as keyof typeof metricIcons] ?? LayoutGrid;

        return (
          <div
            key={metric.id}
            className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--bg-muted)] text-[color:var(--text-muted)]">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <p className="text-sm text-[color:var(--text-muted)]">{metric.label}</p>
            </div>
            <p className="mt-4 text-3xl font-semibold text-[color:var(--text-primary)]">
              {metric.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
