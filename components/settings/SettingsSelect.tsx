import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";
import type { SettingsSelectOption } from "@/types/settings";
import { cn } from "@/lib/utils";

type SettingsSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: SettingsSelectOption[];
  error?: string;
};

export function SettingsSelect({
  label,
  options,
  error,
  className,
  id,
  ...props
}: SettingsSelectProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium text-[color:var(--text-primary)]">
        {label}
      </label>
      <div className="relative">
        <select
          id={fieldId}
          className={cn(
            "w-full appearance-none rounded-lg border border-[color:var(--border-default)] bg-white px-3.5 py-2.5 pr-10 text-sm text-[color:var(--text-primary)] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-none transition-colors focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]",
            error && "border-[color:var(--state-error)]",
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-light)]" />
      </div>
      {error ? <p className="text-xs text-[color:var(--state-error)]">{error}</p> : null}
    </div>
  );
}
