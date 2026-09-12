"use client";

import { cn } from "@/lib/utils";

type AmlToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id: string;
};

export function AmlToggle({ checked, onChange, label, id }: AmlToggleProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <span id={`${id}-label`} className="text-sm text-[color:var(--text-muted)]">
        {label}
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors",
          checked
            ? "bg-[color:var(--accent-primary-hover)]"
            : "bg-[color:var(--border-default)]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-[left]",
            checked ? "left-[18px]" : "left-0.5",
          )}
        />
      </button>
    </div>
  );
}
