import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SettingsFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function SettingsField({ label, error, className, id, ...props }: SettingsFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium text-[color:var(--text-primary)]">
        {label}
      </label>
      <input
        id={fieldId}
        className={cn(
          "w-full rounded-lg border border-[color:var(--border-default)] bg-white px-3.5 py-2.5 text-sm text-[color:var(--text-primary)] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-none transition-colors placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]",
          error && "border-[color:var(--state-error)]",
          className,
        )}
        {...props}
      />
      {error ? <p className="text-xs text-[color:var(--state-error)]">{error}</p> : null}
    </div>
  );
}
