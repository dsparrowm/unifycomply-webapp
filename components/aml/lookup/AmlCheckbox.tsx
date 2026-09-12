"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type AmlCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id: string;
};

export function AmlCheckbox({ checked, onChange, label, id }: AmlCheckboxProps) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5">
      <button
        id={id}
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border transition-colors",
          checked
            ? "border-[color:var(--accent-primary-hover)] bg-[color:var(--accent-primary-hover)] text-white"
            : "border-[color:var(--border-default)] bg-white",
        )}
      >
        {checked ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
      </button>
      <span className="text-sm text-[color:var(--text-primary)]">{label}</span>
    </label>
  );
}
