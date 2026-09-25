import {
  Activity,
  Ban,
  BarChart3,
  CheckCheck,
  Crosshair,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TmListMetric, TmMetricTone } from "@/types/transaction-monitoring";
import { cn } from "@/lib/utils";

const toneIcons: Record<TmMetricTone, LucideIcon> = {
  neutral: BarChart3,
  success: CheckCheck,
  warning: Crosshair,
  info: Activity,
  error: Ban,
};

type TransactionsMetricCardsProps = {
  metrics: TmListMetric[];
};

export function TransactionsMetricCards({ metrics }: TransactionsMetricCardsProps) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2",
        metrics.length <= 2
          ? "xl:grid-cols-2"
          : metrics.length === 4
            ? "lg:grid-cols-4"
            : "lg:grid-cols-3 xl:grid-cols-5",
      )}
    >
      {metrics.map((metric) => {
        const Icon = toneIcons[metric.tone];

        return (
          <div
            key={metric.id}
            className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color:var(--bg-muted)] text-[color:var(--text-muted)]">
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
                {metric.label}
              </p>
            </div>
            <p className="mt-5 text-4xl font-semibold text-[color:var(--text-primary)]">
              {metric.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
