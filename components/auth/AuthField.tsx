"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function AuthField({ label, error, className, id, ...props }: AuthFieldProps) {
  const fieldId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : "field");

  return (
    <div className="space-y-1.5">
      {label ? (
        <label
          htmlFor={fieldId}
          className="text-sm font-medium leading-5 text-[color:var(--auth-label)]"
        >
          {label}
        </label>
      ) : null}
      <input
        id={fieldId}
        className={cn(
          "w-full rounded-lg border border-[color:var(--auth-input-border)] bg-white px-3.5 py-3 text-base leading-6 text-[color:var(--text-primary)] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-none transition-colors placeholder:text-[color:var(--auth-placeholder)] focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]",
          error && "border-[color:var(--state-error)]",
          className,
        )}
        {...props}
      />
      {error ? <p className="text-xs text-[color:var(--state-error)]">{error}</p> : null}
    </div>
  );
}

type AuthPasswordFieldProps = Omit<AuthFieldProps, "type">;

export function AuthPasswordField({
  label = "Password",
  error,
  className,
  id,
  ...props
}: AuthPasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const fieldId = id ?? "password";

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium leading-5 text-[color:var(--auth-label)]">
        {label}
      </label>
      <div className="relative">
        <input
          id={fieldId}
          type={visible ? "text" : "password"}
          className={cn(
            "w-full rounded-lg border border-[color:var(--auth-input-border)] bg-white px-3.5 py-3 pr-11 text-base leading-6 text-[color:var(--text-primary)] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-none transition-colors placeholder:text-[color:var(--auth-placeholder)] focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]",
            error && "border-[color:var(--state-error)]",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--text-light)] transition-colors hover:text-[color:var(--text-muted)]"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error ? <p className="text-xs text-[color:var(--state-error)]">{error}</p> : null}
    </div>
  );
}
