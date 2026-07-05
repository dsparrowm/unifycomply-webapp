import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type OverviewIconTone = "primary" | "warning" | "info" | "neutral";

const iconToneStyles: Record<OverviewIconTone, string> = {
  primary: "bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary)]",
  warning: "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  info: "bg-[color:var(--state-info-soft)] text-[color:var(--state-info)]",
  neutral: "bg-[color:var(--bg-muted)] text-[color:var(--text-muted)]",
};

type OverviewSectionHeaderProps = {
  icon: LucideIcon;
  title: string;
  action?: ReactNode;
  className?: string;
  iconTone?: OverviewIconTone;
  titleClassName?: string;
};

export function OverviewSectionHeader({
  icon: Icon,
  title,
  action,
  className,
  iconTone = "primary",
  titleClassName,
}: OverviewSectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            iconToneStyles[iconTone],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h2
          className={cn(
            "text-sm font-medium uppercase tracking-wide text-[color:var(--text-primary)]",
            titleClassName,
          )}
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
