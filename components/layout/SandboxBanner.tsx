"use client";

import { useSwitchDomain } from "@/lib/hooks/use-settings";
import { runAction } from "@/lib/toast";
import { useAuthStore } from "@/store/auth.store";
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
  const setDomain = useAuthStore((state) => state.setDomain);
  const switchDomainMutation = useSwitchDomain();

  const handleSwitch = async (value: "sandbox" | "production") => {
    if (value === environment || switchDomainMutation.isPending) return;
    try {
      await runAction(() => switchDomainMutation.mutateAsync(value), {
        success: value === "production" ? "Switched to production" : "Switched to sandbox",
        error: "Could not switch domain",
      });
      setEnvironment(value);
      setDomain(value);
    } catch {
      // Toast already shown by runAction
    }
  };

  return (
    <div className="flex h-10 w-[213px] items-center rounded-lg bg-[color:var(--bg-muted)] p-1">
      {(["sandbox", "production"] as const).map((value) => (
        <button
          key={value}
          type="button"
          disabled={switchDomainMutation.isPending}
          onClick={() => void handleSwitch(value)}
          className={cn(
            "flex h-8 flex-1 items-center justify-center rounded-md text-xs capitalize transition-colors disabled:opacity-60",
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
