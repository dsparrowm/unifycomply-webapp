"use client";

import { useUiStore } from "@/store/ui.store";

type OverviewPageHeaderProps = {
  walletBalance: string;
};

export function OverviewPageHeader({ walletBalance }: OverviewPageHeaderProps) {
  const requestWalletTopUp = useUiStore((state) => state.requestWalletTopUp);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-[color:var(--text-primary)]">Overview</h1>
        <p className="mt-0.5 text-sm text-[color:var(--text-muted)]">important metrics for you</p>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-sm text-[color:var(--text-muted)]">
          Wallet Balance:{" "}
          <span className="font-medium text-[color:var(--text-primary)]">{walletBalance}</span>
        </p>
        <button
          type="button"
          onClick={requestWalletTopUp}
          className="rounded-lg bg-[color:var(--accent-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary-hover)]"
        >
          Top up
        </button>
      </div>
    </div>
  );
}
