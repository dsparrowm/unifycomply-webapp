import { FileChartColumnIncreasing } from "lucide-react";
import type { BankAnalysisAccountAnalysis } from "@/types/bank-analysis";

type BankAnalysisFinancialReportProps = {
  analysis: BankAnalysisAccountAnalysis;
};

const chartHeight = 240;
const chartWidth = 720;
const chartMaximum = 1000;
const yAxisLabels = [1000, 800, 600, 400, 200, 0] as const;

function createPoints(values: number[]): string {
  const lastIndex = Math.max(values.length - 1, 1);

  return values
    .map((value, index) => {
      const x = (index / lastIndex) * chartWidth;
      const y = chartHeight - (value / chartMaximum) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");
}

export function BankAnalysisFinancialReport({
  analysis,
}: BankAnalysisFinancialReportProps) {
  const incomePoints = createPoints(analysis.report.map((point) => point.income));
  const expensePoints = createPoints(analysis.report.map((point) => point.expenses));
  const incomeAreaPoints = `0,${chartHeight} ${incomePoints} ${chartWidth},${chartHeight}`;

  const metrics = [
    {
      label: "Total Transaction",
      value: analysis.totalTransactions.toString(),
      valueClassName: "text-[color:var(--text-primary)]",
      supportingText: null,
    },
    {
      label: "Total Credits",
      value: analysis.totalCredits,
      valueClassName: "text-[color:var(--accent-primary-hover)]",
      supportingText: `${analysis.creditTransactions} transactions`,
    },
    {
      label: "Total Debit",
      value: analysis.totalDebits,
      valueClassName: "text-[color:var(--state-error)]",
      supportingText: `${analysis.debitTransactions} transactions`,
    },
    {
      label: "Net Position",
      value: analysis.netPosition,
      valueClassName: "text-[color:var(--text-primary)]",
      supportingText: null,
    },
  ] as const;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="min-w-0 overflow-hidden rounded-lg border border-[color:var(--accent-primary-hover)] p-5"
          >
            <p className="text-xs font-medium text-[color:var(--text-muted)]">
              {metric.label}
            </p>
            <p
              className={`mt-4 max-w-full whitespace-nowrap text-sm leading-tight font-semibold tracking-[-0.02em] ${metric.valueClassName}`}
            >
              {metric.value}
            </p>
            {metric.supportingText ? (
              <p className="mt-2 text-[10px] text-[color:var(--text-light)]">
                {metric.supportingText}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <section className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-[color:var(--bg-muted)] text-[color:var(--text-muted)]">
            <FileChartColumnIncreasing className="h-4 w-4" aria-hidden="true" />
          </span>
          <h3 className="text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
            Financial Report
          </h3>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="flex items-center gap-5 text-xs text-[color:var(--text-muted)]">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--state-error)]" />
              Expenses
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--chart-api-success)]" />
              Income
            </span>
          </div>
        </div>

        <div className="mt-3 flex gap-3">
          <div className="flex w-10 shrink-0 flex-col">
            <span className="mb-2 text-[10px] text-[color:var(--text-light)]">Counts</span>
            <div className="flex h-[240px] flex-col justify-between text-right text-[10px] text-[color:var(--text-light)]">
              {yAxisLabels.map((label) => (
                <span key={label}>{label.toLocaleString()}</span>
              ))}
            </div>
          </div>

          <div className="min-w-0 flex-1 overflow-x-auto">
            <div className="min-w-[560px]">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="h-[240px] w-full overflow-visible"
                role="img"
                aria-label="Monthly income and expenses financial report"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="bank-income-area" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--chart-api-success)"
                      stopOpacity="0.14"
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--chart-api-success)"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                {yAxisLabels.map((label, index) => {
                  const y = (index / (yAxisLabels.length - 1)) * chartHeight;
                  return (
                    <line
                      key={label}
                      x1="0"
                      y1={y}
                      x2={chartWidth}
                      y2={y}
                      className="stroke-[color:var(--border-subtle)]"
                      strokeWidth="1"
                    />
                  );
                })}

                <polygon points={incomeAreaPoints} fill="url(#bank-income-area)" />
                <polyline
                  points={incomePoints}
                  className="fill-none stroke-[color:var(--chart-api-success)]"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <polyline
                  points={expensePoints}
                  className="fill-none stroke-[color:var(--state-error)]"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>

              <div className="mt-3 grid grid-cols-12 text-center text-[10px] text-[color:var(--text-light)]">
                {analysis.report
                  .filter((_, index) => index % 3 === 0)
                  .map((point) => (
                  <span key={point.month}>{point.month}</span>
                  ))}
              </div>
              <p className="mt-2 text-center text-[10px] text-[color:var(--text-light)]">
                Month
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
