import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type KycScreeningResultBannerProps = {
  title: string;
  description?: string;
  icon: LucideIcon;
  tone?: "success" | "warning" | "error";
};

const toneStyles = {
  success: {
    container: "bg-[color:var(--state-success-soft)] border-[color:var(--state-success)]/20",
    icon: "bg-[color:var(--bg-surface)] text-[color:var(--state-success)]",
    title: "text-[color:var(--state-success)]",
  },
  warning: {
    container: "bg-[color:var(--state-warning-soft)] border-[color:var(--state-warning)]/20",
    icon: "bg-[color:var(--bg-surface)] text-[color:var(--state-warning)]",
    title: "text-[color:var(--state-warning)]",
  },
  error: {
    container: "bg-[color:var(--state-error-soft)] border-[color:var(--state-error)]/20",
    icon: "bg-[color:var(--bg-surface)] text-[color:var(--state-error)]",
    title: "text-[color:var(--state-error)]",
  },
};

export function KycScreeningResultBanner({
  title,
  description,
  icon: Icon,
  tone = "success",
}: KycScreeningResultBannerProps) {
  const styles = toneStyles[tone];

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border px-6 py-10 text-center",
        styles.container,
      )}
    >
      <span
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full",
          styles.icon,
        )}
      >
        <Icon className="h-7 w-7" />
      </span>
      <h3 className={cn("mt-4 text-base font-semibold", styles.title)}>{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-[color:var(--text-muted)]">{description}</p>
      ) : null}
    </div>
  );
}
