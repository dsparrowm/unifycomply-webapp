"use client";

import {
  ClipboardList,
  Search,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { OverviewQuickAction } from "@/types/overview";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui.store";

const actionIcons: Record<OverviewQuickAction["id"], LucideIcon> = {
  kyc: ShieldCheck,
  aml: ClipboardList,
  "background-check": Search,
  deposit: Wallet,
};

const actionIconTones: Record<OverviewQuickAction["id"], string> = {
  kyc: "bg-[color:var(--state-info-soft)] text-[color:var(--state-info)]",
  aml: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
  "background-check": "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  deposit: "bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary-hover)]",
};

type OverviewQuickActionsProps = {
  actions: OverviewQuickAction[];
};

export function OverviewQuickActions({ actions }: OverviewQuickActionsProps) {
  const requestWalletTopUp = useUiStore((state) => state.requestWalletTopUp);

  return (
    <section className="rounded-xl bg-[color:var(--accent-primary)] p-5 shadow-sm">
      <div className="mb-10 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-sm font-medium uppercase tracking-wide text-white">Quick Actions</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = actionIcons[action.id];

          return (
            <button
              key={action.id}
              type="button"
              onClick={action.id === "deposit" ? requestWalletTopUp : undefined}
              className="rounded-xl bg-[color:var(--bg-surface)] p-5 text-left shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    actionIconTones[action.id],
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold uppercase text-[color:var(--text-primary)]">
                    {action.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-5 text-[color:var(--text-muted)]">
                    {action.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
