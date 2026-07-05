import { Network } from "lucide-react";
import type { OverviewApiCallsPoint } from "@/types/overview";
import { OverviewSectionHeader } from "@/components/overview/OverviewSectionHeader";

type OverviewApiCallsChartProps = {
  data: OverviewApiCallsPoint[];
};

const yAxisMax = 1000;
const yAxisLabels = [1000, 800, 600, 400, 200, 0];

export function OverviewApiCallsChart({ data }: OverviewApiCallsChartProps) {
  return (
    <section className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <OverviewSectionHeader icon={Network} iconTone="neutral" title="API Calls" />

      <div className="mt-4 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[color:var(--chart-api-success)]" />
          <span className="text-xs text-[color:var(--text-muted)]">Successful</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[color:var(--chart-api-failed)]" />
          <span className="text-xs text-[color:var(--text-muted)]">Failed</span>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex gap-3">
          <div className="flex w-12 shrink-0 flex-col">
            <p className="mb-2 text-[10px] text-[color:var(--text-light)]">Counts</p>
            <div className="flex h-[240px] flex-col justify-between text-right text-xs text-[color:var(--text-light)]">
              {yAxisLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>

          <div className="relative min-w-0 flex-1">
            <div className="absolute inset-x-0 top-0 flex h-[240px] flex-col justify-between">
              {yAxisLabels.map((label) => (
                <div key={label} className="border-t border-[color:var(--border-subtle)]" />
              ))}
            </div>

            <div className="relative flex h-[240px] items-end justify-between gap-1 px-1">
              {data.map((point) => {
                const successfulHeight = (point.calls / yAxisMax) * 100;
                const failedHeight = (point.errors / yAxisMax) * 100;

                return (
                  <div
                    key={point.label}
                    className="flex h-full flex-1 flex-col items-center justify-end"
                  >
                    <div className="flex w-full max-w-8 flex-1 flex-col justify-end">
                      <div
                        className="w-full bg-[color:var(--chart-api-failed)]"
                        style={{ height: `${failedHeight}%` }}
                      />
                      <div
                        className="w-full bg-[color:var(--chart-api-success)]"
                        style={{ height: `${successfulHeight}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-2 flex justify-between gap-1 text-[10px] text-[color:var(--text-light)] sm:text-xs">
              {data.map((point) => (
                <span key={point.label} className="min-w-0 flex-1 text-center">
                  {point.label}
                </span>
              ))}
            </div>
            <p className="mt-1 text-center text-[10px] text-[color:var(--text-light)]">Month</p>
          </div>
        </div>
      </div>
    </section>
  );
}
