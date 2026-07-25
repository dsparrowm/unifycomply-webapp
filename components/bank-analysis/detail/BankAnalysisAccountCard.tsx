import { ChevronRight, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BankAnalysisAccount } from "@/types/bank-analysis";

type BankAnalysisAccountCardProps = {
  account: BankAnalysisAccount;
};

const detailRows: {
  label: string;
  value: (account: BankAnalysisAccount) => string | number;
  valueClassName?: string;
}[] = [
  { label: "Opened", value: (account) => account.openedAt },
  {
    label: "Balance",
    value: (account) => account.balance,
    valueClassName: "font-semibold text-[color:var(--text-primary)]",
  },
  { label: "Transactions", value: (account) => account.transactions },
  { label: "Last Activity", value: (account) => account.lastActivity },
  { label: "Risk", value: (account) => account.risk },
];

export function BankAnalysisAccountCard({ account }: BankAnalysisAccountCardProps) {
  return (
    <article
      className={cn(
        "rounded-lg border bg-[color:var(--bg-surface)] p-5",
        account.highlighted
          ? "border-[color:var(--accent-primary-hover)] bg-[color:var(--accent-primary-subtle)]"
          : "border-[color:var(--border-default)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[color:var(--accent-primary-hover)] text-[color:var(--accent-primary-hover)]">
            <Landmark className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-xl font-semibold text-[color:var(--text-primary)]">
              {account.bankName}
            </h3>
            <p className="text-xs text-[color:var(--text-light)]">
              {account.maskedAccountNumber}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[color:var(--accent-primary-hover)] px-3 py-1 text-xs font-medium text-white">
          Tier {account.tier}
        </span>
      </div>

      <div className="mt-5 space-y-3 text-xs">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[color:var(--text-muted)]">Type</span>
          <span className="rounded-full bg-[color:var(--bg-muted)] px-2.5 py-1 font-medium text-[color:var(--text-muted)]">
            {account.type}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[color:var(--text-muted)]">Status</span>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 font-medium capitalize",
              account.status === "active"
                ? "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]"
                : "bg-[color:var(--bg-muted)] text-[color:var(--text-muted)]",
            )}
          >
            {account.status}
          </span>
        </div>

        {detailRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <span className="text-[color:var(--text-muted)]">{row.label}</span>
            <span
              className={cn(
                "text-right font-medium text-[color:var(--text-primary)]",
                row.valueClassName,
              )}
            >
              {row.value(account)}
            </span>
          </div>
        ))}
      </div>

      <ChevronRight
        className="mt-4 ml-auto h-4 w-4 text-[color:var(--text-light)]"
        aria-hidden="true"
      />
    </article>
  );
}
