import { cn } from "@/lib/utils";

type KybDetailSectionHeaderProps = {
  title: string;
  description?: string;
  status: string;
};

function statusBadgeClass(status: string): string {
  const normalized = status.toLowerCase();

  if (["active", "cleared", "verified"].includes(normalized)) {
    return "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]";
  }

  if (["flagged", "failed"].includes(normalized)) {
    return "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]";
  }

  return "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]";
}

export function KybDetailSectionHeader({
  title,
  description,
  status,
}: KybDetailSectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[color:var(--border-default)] px-6 py-5">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">{description}</p>
        ) : null}
      </div>
      <span
        className={cn(
          "rounded-full px-3 py-1 text-sm font-medium",
          statusBadgeClass(status),
        )}
      >
        {status}
      </span>
    </div>
  );
}
