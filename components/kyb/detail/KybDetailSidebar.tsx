import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { KycStatusBadge } from "@/components/kyc/KycStatusBadge";
import { getRiskScoreShortLabel } from "@/lib/kyc/risk-score";
import type {
  KybDetail,
  KybPriority,
  KybRiskFactor,
  KybRiskFactorTone,
  KybVerificationStatus,
} from "@/types/kyb";
import { cn } from "@/lib/utils";

const statusLabels: Record<KybVerificationStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
  "in-review": "In Review",
  escalated: "Escalated",
};

const priorityLabels: Record<KybPriority, string> = {
  low: "Standard",
  medium: "Medium",
  high: "High",
  critical: "Urgent",
};

const priorityClassNames: Record<KybPriority, string> = {
  low: "text-[color:var(--accent-primary-hover)]",
  medium: "text-[color:var(--state-warning)]",
  high: "text-[color:var(--state-error)]",
  critical: "text-[color:var(--state-error)]",
};

type KybDetailSidebarProps = {
  detail: KybDetail;
  status: KybVerificationStatus;
};

function SidebarRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[color:var(--border-subtle)] py-3 last:border-b-0">
      <span className="text-sm text-[color:var(--text-muted)]">{label}</span>
      <div className="text-right text-sm font-medium text-[color:var(--text-primary)]">{children}</div>
    </div>
  );
}

function isWarningTone(tone: KybRiskFactorTone | undefined): boolean {
  return tone === "medium" || tone === "low";
}

function isErrorTone(tone: KybRiskFactorTone | undefined): boolean {
  return tone === "critical" || tone === "high";
}

function riskFactorCardClass(tone: KybRiskFactorTone | undefined): string {
  switch (tone) {
    case "critical":
      return "border-[color:var(--state-error)]/25 bg-[color:var(--state-error-soft)]";
    case "high":
      return "border-[color:var(--state-error)]/20 bg-[color:var(--state-error-soft)]/70";
    case "medium":
      return "border-[color:var(--state-warning)]/30 bg-[color:var(--state-warning-soft)]";
    case "low":
      return "border-[color:var(--state-warning)]/20 bg-[color:var(--state-warning-soft)]/70";
    default:
      return "border-[color:var(--border-subtle)] bg-[color:var(--bg-muted)]";
  }
}

function RiskFactorCard({ factor }: { factor: KybRiskFactor }) {
  const warningTone = isWarningTone(factor.tone);
  const errorTone = isErrorTone(factor.tone);
  const hasStructuredLayout = Boolean(factor.title);

  return (
    <div className={cn("rounded-lg border p-3", riskFactorCardClass(factor.tone))}>
      <p
        className={cn(
          "text-[11px] font-semibold uppercase tracking-wide",
          errorTone
            ? "text-[color:var(--state-error)]"
            : warningTone
              ? "text-[color:var(--state-warning)]"
              : "text-[color:var(--text-muted)]",
        )}
      >
        {factor.category}
      </p>

      {hasStructuredLayout ? (
        <>
          <p className="mt-1.5 text-sm font-semibold text-[color:var(--text-primary)]">
            {factor.title}
          </p>
          <p className="mt-2 text-sm leading-5 text-[color:var(--text-muted)]">{factor.description}</p>
          {factor.metadata ? (
            <p className="mt-2 text-sm font-medium text-[color:var(--text-primary)]">
              {factor.metadata}
            </p>
          ) : null}
          {factor.action ? (
            <div
              className={cn(
                "mt-3 flex items-start gap-2 rounded-md px-3 py-2 text-sm font-medium",
                warningTone
                  ? "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]"
                  : "bg-[color:var(--bg-surface)]/80 text-[color:var(--state-error)]",
              )}
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{factor.action}</span>
            </div>
          ) : null}
        </>
      ) : (
        <div className="mt-2 flex items-start justify-between gap-3">
          <p className="text-sm leading-5 text-[color:var(--text-muted)]">{factor.description}</p>
          {errorTone || warningTone ? (
            <AlertTriangle
              className={cn(
                "h-4 w-4 shrink-0",
                warningTone
                  ? "text-[color:var(--state-warning)]"
                  : "text-[color:var(--state-error)]",
              )}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

export function KybDetailSidebar({ detail, status }: KybDetailSidebarProps) {
  const riskLabel = getRiskScoreShortLabel(detail.riskScore);
  const showRiskFactors = detail.riskScore > 0 && detail.riskFactors.length > 0;
  const showScoreCallout = detail.riskScore === 0 || detail.riskFactors.length === 0;
  /** Frame 95 high-risk layout shows tier cards only — no Standard/Very High chip. */
  const showRiskChip = !showRiskFactors;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            Risk analysis
          </h2>
          {showRiskChip ? (
            <span className="inline-flex items-center rounded-full bg-[color:var(--accent-primary-soft)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--accent-primary-hover)]">
              {riskLabel}
            </span>
          ) : null}
        </div>

        {showScoreCallout ? (
          <div className="mt-4 rounded-lg border border-[color:var(--accent-primary-hover)]/25 bg-[color:var(--accent-primary-soft)] p-4">
            <p className="text-base font-semibold uppercase tracking-wide text-[color:var(--state-success)]">
              Risk Score: {detail.riskScore}
            </p>
            <p className="mt-2 text-sm leading-5 text-[color:var(--text-muted)]">{detail.riskSummary}</p>
          </div>
        ) : null}

        {showRiskFactors ? (
          <div className="mt-4 space-y-3">
            {detail.riskFactors.map((factor) => (
              <RiskFactorCard key={factor.id} factor={factor} />
            ))}
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            Verification Status
          </h2>
          <KycStatusBadge status={status} />
        </div>

        <div className="mt-4">
          <SidebarRow label="Current Status">{statusLabels[status]}</SidebarRow>
          <SidebarRow label="Priority">
            <span className={cn("text-sm font-medium", priorityClassNames[detail.priority])}>
              {priorityLabels[detail.priority]}
            </span>
          </SidebarRow>
          <SidebarRow label="Submitted">{detail.submittedAt}</SidebarRow>
          <SidebarRow label="Last Updated">{detail.lastUpdatedAt}</SidebarRow>
        </div>
      </div>

      <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          Business Size
        </h2>

        <div className="mt-4">
          <SidebarRow label="Employee Count">{detail.employeeCount}</SidebarRow>
          <SidebarRow label="Annual Revenue">{detail.annualRevenue}</SidebarRow>
          <SidebarRow label="Business Permit">{detail.businessPermit}</SidebarRow>
          <SidebarRow label="Country">{detail.operatingCountries}</SidebarRow>
        </div>
      </div>
    </div>
  );
}
