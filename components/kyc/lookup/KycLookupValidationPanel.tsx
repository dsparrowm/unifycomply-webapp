import type { LookupValidationRow } from "@/lib/api/mappers/verification";
import { cn } from "@/lib/utils";

type KycLookupValidationPanelProps = {
  rows: LookupValidationRow[];
};

export function KycLookupValidationPanel({ rows }: KycLookupValidationPanelProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-6 py-16 text-center">
        <h2 className="text-base font-semibold text-[color:var(--text-primary)]">Validation Information</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[color:var(--text-muted)]">
          Field-level matches will appear here when the identity check returns.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)]">
      <div className="border-b border-[color:var(--border-subtle)] px-6 py-5">
        <h2 className="text-base font-semibold text-[color:var(--text-primary)]">Validation Information</h2>
      </div>
      <div className="divide-y divide-[color:var(--border-subtle)]">
        {rows.map((row) => (
          <div key={row.id} className="flex items-start justify-between gap-4 px-6 py-4">
            <div>
              <p className="text-sm font-medium capitalize text-[color:var(--text-primary)]">{row.field}</p>
              <p className="mt-1 text-sm text-[color:var(--text-muted)]">{row.message}</p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                row.matched
                  ? "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]"
                  : "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
              )}
            >
              {row.matched ? "Match" : "Review"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
