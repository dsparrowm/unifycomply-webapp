import { Check } from "lucide-react";
import { BankAnalysisDateRangeMenu } from "@/components/bank-analysis/detail/BankAnalysisDateRangeMenu";

export function BankAnalysisAlertsPanel() {
  return (
    <section className="min-h-[1380px] overflow-hidden rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)]">
      <div className="flex flex-col gap-4 border-b border-[color:var(--border-default)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          Alerts
        </h2>
        <BankAnalysisDateRangeMenu />
      </div>

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
    </section>
  );
}
