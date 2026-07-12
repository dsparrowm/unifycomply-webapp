import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-6 py-12 text-center",
        className,
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--bg-surface)] text-[color:var(--text-light)]">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-sm font-medium text-[color:var(--text-primary)]">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-[color:var(--text-muted)]">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
