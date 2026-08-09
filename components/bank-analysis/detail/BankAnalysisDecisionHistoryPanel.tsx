import { Archive, CheckCircle2, Clock3, ShieldAlert } from "lucide-react";
import { BankAnalysisDateRangeMenu } from "@/components/bank-analysis/detail/BankAnalysisDateRangeMenu";
import type { BankAnalysisDecisionHistoryEntry } from "@/types/bank-analysis";

type BankAnalysisDecisionHistoryPanelProps = {
  entries: BankAnalysisDecisionHistoryEntry[];
};

export function BankAnalysisDecisionHistoryPanel({
  entries,
}: BankAnalysisDecisionHistoryPanelProps) {
  return (
    <section className="min-h-[1380px] overflow-hidden rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)]">
      <div className="flex flex-col gap-4 border-b border-[color:var(--border-default)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          Decision History
        </h2>
        <BankAnalysisDateRangeMenu />
      </div>

      {entries.length === 0 ? (
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
      ) : (
        <ol className="divide-y divide-[color:var(--border-subtle)] px-4 sm:px-6">
          {entries.map((entry) => {
            const Icon =
              entry.type === "escalated"
                ? ShieldAlert
                : entry.type === "review-started"
                  ? Clock3
                  : CheckCircle2;

            return (
              <li key={entry.id} className="flex gap-4 py-6">
                <span
                  className={
                    entry.type === "escalated"
                      ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]"
                      : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary)]"
                  }
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">
                    {entry.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[color:var(--text-muted)]">
                    {entry.description}
                  </p>
                  <p className="mt-3 text-xs text-[color:var(--text-light)]">
                    {entry.actor} · {entry.timestamp}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
