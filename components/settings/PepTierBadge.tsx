import type { SettingsPepTierLevel } from "@/types/settings";
import { cn } from "@/lib/utils";

const tierStyles: Record<SettingsPepTierLevel, string> = {
  4: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
  3: "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  2: "bg-[color:var(--sandbox-bg)] text-[color:var(--sandbox-text)]",
  1: "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]",
};

type PepTierBadgeProps = {
  level: SettingsPepTierLevel;
};

export function PepTierBadge({ level }: PepTierBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        tierStyles[level],
      )}
    >
      Tier {level}
    </span>
  );
}
