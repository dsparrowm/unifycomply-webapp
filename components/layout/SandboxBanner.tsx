"use client";

import { useUiStore } from "@/store/ui.store";
import { cn } from "@/lib/utils";

export function SandboxBanner() {
  const environment = useUiStore((state) => state.environment);

  if (environment !== "sandbox") {
    return null;
  }

  return (
    <div className="flex h-10 items-center justify-center border-b border-[color:var(--sandbox-border)] bg-[color:var(--sandbox-bg)]">
      <p className="text-xs font-medium text-[color:var(--sandbox-text)]">Sandbox mode</p>
    </div>
  );
}

export function EnvironmentToggle() {
  const environment = useUiStore((state) => state.environment);
  const setEnvironment = useUiStore((state) => state.setEnvironment);

  return (
    <div className="flex h-10 w-[213px] items-center rounded-lg bg-[color:var(--bg-muted)] p-1">
      {(["sandbox", "production"] as const).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => setEnvironment(value)}
          className={cn(
            "flex h-8 flex-1 items-center justify-center rounded-md text-xs capitalize transition-colors",
            environment === value
              ? "bg-[color:var(--bg-surface)] font-medium text-[color:var(--text-primary)] shadow-sm"
              : "text-[color:var(--text-muted)]",
          )}
        >
          {value}
        </button>
      ))}
    </div>
  );
}
