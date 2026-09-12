import type { AmlCaseLinkedRow } from "@/types/aml";

type AmlCaseLinkedListProps = {
  rows: AmlCaseLinkedRow[];
};

export function AmlCaseLinkedList({ rows }: AmlCaseLinkedListProps) {
  return (
    <dl>
      {rows.map((row, index) => (
        <div
          key={`${row.label}-${row.value}-${index}`}
          className="border-b border-[color:var(--border-subtle)] py-4 last:border-b-0"
        >
          <dt className="text-sm text-[color:var(--text-muted)]">{row.label}</dt>
          <dd className="mt-1.5 text-sm text-[color:var(--text-primary)]">
            {row.detail ? `${row.value} - ${row.detail}` : row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
