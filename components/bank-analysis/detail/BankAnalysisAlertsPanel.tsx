import { AlertTriangle, Check } from "lucide-react";
import { BankAnalysisDateRangeMenu } from "@/components/bank-analysis/detail/BankAnalysisDateRangeMenu";
import { cn } from "@/lib/utils";
import type { BankAnalysisAlert } from "@/types/bank-analysis";

type BankAnalysisAlertsPanelProps = {
  alerts: BankAnalysisAlert[];
};

const severityClasses: Record<BankAnalysisAlert["severity"], string> = {
  medium: "bg-[color:var(--state-info-soft)] text-[color:var(--state-info)]",
  high: "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  critical: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
};

export function BankAnalysisAlertsPanel({ alerts }: BankAnalysisAlertsPanelProps) {
  return (
    <section className="min-h-[1380px] overflow-hidden rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)]">
      <div className="flex flex-col gap-4 border-b border-[color:var(--border-default)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          Alerts
        </h2>
        <BankAnalysisDateRangeMenu />
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center px-6 pt-40 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-[color:var(--accent-primary-hover)] text-white">
            <Check className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <h3 className="mt-8 text-base font-semibold text-[color:var(--text-primary)]">
            No Warning or Risk
          </h3>
          <p className="mt-3 text-xs text-[color:var(--text-light)]">
            This entity has no risk posed
          </p>
        </div>
      ) : (
        <div className="space-y-4 p-4 sm:p-6">
          {alerts.map((alert) => (
            <article
              key={alert.id}
              className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]">
                    <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-[color:var(--text-primary)]">
                      {alert.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[color:var(--text-muted)]">
                      {alert.description}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "w-fit rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                    severityClasses[alert.severity],
                  )}
                >
                  {alert.severity}
                </span>
              </div>

              <dl className="mt-5 grid gap-4 border-t border-[color:var(--border-subtle)] pt-4 text-xs sm:grid-cols-4">
                {[
                  ["Account", alert.accountNumber],
                  ["Amount", alert.amount],
                  ["Detected", alert.detectedAt],
                  ["Status", alert.status],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[color:var(--text-light)]">{label}</dt>
                    <dd className="mt-1 font-medium text-[color:var(--text-primary)]">{value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
