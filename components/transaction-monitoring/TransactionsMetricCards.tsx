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

const toneStyles: Record<TmMetricTone, string> = {
  neutral: "text-[color:var(--text-muted)] bg-[color:var(--bg-muted)]",
  success: "text-[color:var(--state-success)] bg-[color:var(--state-success-soft)]",
  warning: "text-[color:var(--state-warning)] bg-[color:var(--state-warning-soft)]",
  info: "text-[color:var(--state-purple)] bg-[color:var(--state-purple-soft)]",
  error: "text-[color:var(--state-error)] bg-[color:var(--state-error-soft)]",
};

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
        const isEmpty = metric.value === "0";

        return (
          <div
            key={metric.id}
            className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-[color:var(--text-muted)]">
                  {metric.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-[color:var(--text-primary)]">
                  {metric.value}
                </p>
              </div>
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  isEmpty
                    ? "bg-[color:var(--bg-muted)] text-[color:var(--text-light)]"
                    : toneStyles[metric.tone],
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
