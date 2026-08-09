import type { AmlDecisionHistoryEntry } from "@/types/aml-screening";

type AmlDecisionHistoryPanelProps = {
  entries: AmlDecisionHistoryEntry[];
};

export function AmlDecisionHistoryPanel({ entries }: AmlDecisionHistoryPanelProps) {
  return (
    <section className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
      <div className="border-b border-[color:var(--border-default)] px-5 py-4">
        <h2 className="font-semibold text-[color:var(--text-primary)]">Decision History</h2>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">
          Screening and reviewer activity
        </p>
      </div>
      <ol className="divide-y divide-[color:var(--border-subtle)] px-5">
        {entries.map((entry) => (
          <li key={entry.id} className="py-4">
            <p className="text-sm font-medium text-[color:var(--text-primary)]">{entry.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-[color:var(--text-muted)]">
              {entry.description}
            </p>
            <p className="mt-2 text-xs text-[color:var(--text-light)]">
              {entry.actor} · {entry.timestamp}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
