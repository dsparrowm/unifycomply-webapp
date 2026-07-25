"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useToastStore, type ToastTone } from "@/store/toast.store";
import { cn } from "@/lib/utils";

const toneStyles: Record<
  ToastTone,
  { icon: typeof CheckCircle2; className: string; iconClassName: string }
> = {
  success: {
    icon: CheckCircle2,
    className: "border-[color:var(--state-success)]/30 bg-[color:var(--state-success-soft)]",
    iconClassName: "text-[color:var(--state-success)]",
  },
  error: {
    icon: XCircle,
    className: "border-[color:var(--state-error)]/30 bg-[color:var(--state-error-soft)]",
    iconClassName: "text-[color:var(--state-error)]",
  },
  info: {
    icon: Info,
    className: "border-[color:var(--state-info)]/30 bg-[color:var(--state-info-soft)]",
    iconClassName: "text-[color:var(--state-info)]",
  },
};

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex flex-col items-end gap-2 p-4 sm:p-6"
      aria-live="polite"
      aria-relevant="additions"
    >
      {toasts.map((toast) => {
        const tone = toneStyles[toast.tone];
        const Icon = tone.icon;
        return (
          <div
            key={toast.id}
            role={toast.tone === "error" ? "alert" : "status"}
            className={cn(
              "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg",
              "bg-[color:var(--bg-surface)] text-[color:var(--text-primary)]",
              tone.className,
            )}
          >
            <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", tone.iconClassName)} aria-hidden />
            <p className="flex-1 text-sm font-medium leading-5">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
              className="rounded-md p-0.5 text-[color:var(--text-light)] transition-colors hover:bg-black/5 hover:text-[color:var(--text-primary)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
