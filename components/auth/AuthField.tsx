"use client";

import { useState } from "react";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const inputBaseClass =
  "w-full rounded-lg border border-[color:var(--auth-input-border)] bg-white px-3.5 py-3 text-base leading-6 text-[color:var(--text-primary)] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-none transition-colors placeholder:text-[color:var(--auth-placeholder)] focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function AuthField({ label, error, className, id, ...props }: AuthFieldProps) {
  const fieldId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : "field");
  const errorId = `${fieldId}-error`;

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
      <div className="relative">
        <input
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            inputBaseClass,
            error && "border-[color:var(--state-error)] pr-11 focus:border-[color:var(--state-error)] focus:ring-[color:var(--state-error-soft)]",
            className,
          )}
          {...props}
        />
        {error ? (
          <CircleAlert
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--state-error)]"
            aria-hidden
          />
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className="text-xs text-[color:var(--state-error)]">
          {error}
        </p>
      ) : null}
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
  const errorId = `${fieldId}-error`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium leading-5 text-[color:var(--auth-label)]">
        {label}
      </label>
      <div className="relative">
        <input
          id={fieldId}
          type={visible ? "text" : "password"}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            inputBaseClass,
            error ? "pr-[4.5rem]" : "pr-11",
            error &&
              "border-[color:var(--state-error)] focus:border-[color:var(--state-error)] focus:ring-[color:var(--state-error-soft)]",
            className,
          )}
          {...props}
        />
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
          {error ? (
            <CircleAlert
              className="h-4 w-4 text-[color:var(--state-error)]"
              aria-hidden
            />
          ) : null}
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            className="text-[color:var(--text-light)] transition-colors hover:text-[color:var(--text-muted)]"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {error ? (
        <p id={errorId} className="text-xs text-[color:var(--state-error)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
