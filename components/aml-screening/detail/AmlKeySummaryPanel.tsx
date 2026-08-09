import type { AmlKeySummaryField } from "@/types/aml-screening";

type AmlKeySummaryPanelProps = {
  fields: AmlKeySummaryField[];
};

export function AmlKeySummaryPanel({ fields }: AmlKeySummaryPanelProps) {
  return (
    <div className="divide-y divide-[color:var(--border-subtle)]">
      {fields.map((field) => (
        <div
          key={field.id}
          className="grid gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
            {field.label}
          </p>
          <div className="flex flex-wrap items-start gap-2">
            <p className="text-sm leading-relaxed text-[color:var(--text-primary)]">{field.value}</p>
            {field.badge ? (
              <span className="rounded-md bg-[color:var(--state-warning-soft)] px-2 py-0.5 text-xs font-medium text-[color:var(--state-warning)]">
                {field.badge}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
