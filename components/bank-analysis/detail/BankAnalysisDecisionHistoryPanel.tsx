import { Archive } from "lucide-react";
import { BankAnalysisDateRangeMenu } from "@/components/bank-analysis/detail/BankAnalysisDateRangeMenu";

export function BankAnalysisDecisionHistoryPanel() {
  return (
    <section className="min-h-[1380px] overflow-hidden rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)]">
      <div className="flex flex-col gap-4 border-b border-[color:var(--border-default)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          Decision History
        </h2>
        <BankAnalysisDateRangeMenu />
      </div>

      <div className="flex flex-col items-center px-6 pt-40 text-center">
        <Archive
          className="h-14 w-14 fill-[color:var(--accent-primary-hover)] text-[color:var(--accent-primary-hover)]"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <h3 className="mt-8 text-base font-semibold text-[color:var(--text-primary)]">
          Decision history
        </h3>
        <p className="mt-3 max-w-xs text-xs leading-5 text-[color:var(--text-light)]">
          This entity has no escalated review procedures or supplementary data.
        </p>
      </div>
    </section>
  );
}
