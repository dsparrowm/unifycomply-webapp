import { Clock3, UserRound } from "lucide-react";
import type { BankAnalysisDetail } from "@/types/bank-analysis";

type BankAnalysisDetailSidebarProps = {
  detail: BankAnalysisDetail;
};

export function BankAnalysisDetailSidebar({
  detail,
}: BankAnalysisDetailSidebarProps) {
  const { profile, networkMetrics } = detail;

  const profileRows = [
    ["Entity Type", profile.entityType],
    [profile.entityType === "Business" ? "Registration ID" : "BVN", profile.bvn],
    ["Email", profile.email],
    ["Phone", profile.phone],
  ] as const;

  const networkRows = [
    ["Alerts", networkMetrics.alerts.toString(), "success"],
    ["Shared Account", `${networkMetrics.sharedAccounts} Accounts`, "info"],
    ["Total Transaction", networkMetrics.totalTransactions.toString(), "info"],
    ["Network Depth", `${networkMetrics.networkDepth} Levels`, "info"],
  ] as const;

  return (
    <aside className="space-y-6">
      <section className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          Risk Analysis
        </h2>
        <div className="mt-5 rounded-lg border border-[color:var(--accent-primary-hover)] bg-[color:var(--accent-primary-subtle)] p-4">
          <p className="font-semibold uppercase text-[color:var(--accent-primary-hover)]">
            Alerts: {networkMetrics.alerts}
          </p>
          <p className="mt-5 text-sm text-[color:var(--text-light)]">
            {networkMetrics.alerts === 0
              ? "No active alerts or suspicious activity detected"
              : `${networkMetrics.alerts} active alerts require compliance review`}
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          User Profile
        </h2>
        <div className="mt-6 flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary-hover)]">
            <UserRound className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-medium text-[color:var(--text-primary)]">{profile.name}</p>
            <p className="text-xs text-[color:var(--text-light)]">{profile.reference}</p>
          </div>
        </div>

        <dl className="mt-6 space-y-5">
          {profileRows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 text-xs">
              <dt className="text-[color:var(--text-muted)]">{label}</dt>
              <dd className="text-right font-medium text-[color:var(--text-primary)]">
                {value}
              </dd>
            </div>
          ))}
          <div className="flex items-center gap-3 pt-1">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary-hover)]">
              <Clock3 className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <dt className="text-sm font-medium text-[color:var(--text-primary)]">
                Last Reviewed
              </dt>
              <dd className="text-xs text-[color:var(--text-light)]">
                {profile.lastReviewed}
              </dd>
            </div>
          </div>
        </dl>
      </section>

      <section className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          Network Metrics
        </h2>
        <dl className="mt-6 space-y-5">
          {networkRows.map(([label, value, tone]) => (
            <div key={label} className="flex items-center justify-between gap-4 text-xs">
              <dt className="text-[color:var(--text-muted)]">{label}</dt>
              <dd
                className={
                  tone === "success"
                    ? "rounded-full bg-[color:var(--state-success-soft)] px-2.5 py-1 font-medium text-[color:var(--state-success)]"
                    : "rounded-full bg-[color:var(--state-info-soft)] px-2.5 py-1 font-medium text-[color:var(--state-info)]"
                }
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </aside>
  );
}
