import { KycPriorityBadge, KycStatusBadge } from "@/components/kyc/KycStatusBadge";
import { getRiskScoreShortLabel } from "@/lib/kyc/risk-score";
import type { KybDetail, KybVerificationStatus } from "@/types/kyb";

const statusLabels: Record<KybVerificationStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
  "in-review": "In Review",
  escalated: "Escalated",
};

type KybDetailSidebarProps = {
  detail: KybDetail;
  status: KybVerificationStatus;
};

function SidebarRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[color:var(--border-subtle)] py-3 last:border-b-0">
      <span className="text-sm text-[color:var(--text-muted)]">{label}</span>
      <span className="text-right text-sm font-medium text-[color:var(--text-primary)]">{value}</span>
    </div>
  );
}

export function KybDetailSidebar({ detail, status }: KybDetailSidebarProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6 shadow-sm">
        <h2 className="text-base font-semibold text-[color:var(--text-primary)]">Risk analysis</h2>

        <div className="mt-4 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-muted)] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[color:var(--accent-primary)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Risk Score: {detail.riskScore}
            </span>
            <span className="rounded-full bg-[color:var(--state-success-soft)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--state-success)]">
              {getRiskScoreShortLabel(detail.riskScore)}
            </span>
          </div>
          <p className="mt-3 text-sm leading-5 text-[color:var(--text-muted)]">{detail.riskSummary}</p>
        </div>

        <div className="mt-4 space-y-4">
          {detail.riskFactors.map((factor) => (
            <div
              key={factor.id}
              className="rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-muted)] p-3"
            >
              <p className="text-sm font-semibold text-[color:var(--text-primary)]">{factor.category}</p>
              <p className="mt-2 text-sm font-medium text-[color:var(--text-primary)]">{factor.title}</p>
              <p className="mt-1 text-sm leading-5 text-[color:var(--text-muted)]">{factor.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-[color:var(--text-primary)]">Verification Status</h2>
          <KycStatusBadge status={status} uppercase />
        </div>

        <div className="mt-4">
          <SidebarRow label="Current Status" value={statusLabels[status]} />
          <div className="flex items-center justify-between gap-4 border-b border-[color:var(--border-subtle)] py-3 last:border-b-0">
            <span className="text-sm text-[color:var(--text-muted)]">Priority</span>
            <KycPriorityBadge priority={detail.priority} />
          </div>
          <SidebarRow label="Submitted" value={detail.submittedAt} />
          <SidebarRow label="Last Updated" value={detail.lastUpdatedAt} />
        </div>
      </div>

      <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6 shadow-sm">
        <h2 className="text-base font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          Business Size
        </h2>

        <div className="mt-4">
          <SidebarRow label="Employee Count" value={detail.employeeCount} />
          <SidebarRow label="Annual Revenue" value={detail.annualRevenue} />
          <SidebarRow label="Business Permit" value={detail.businessPermit} />
          <SidebarRow label="Country" value={detail.operatingCountries} />
        </div>
      </div>
    </div>
  );
}
