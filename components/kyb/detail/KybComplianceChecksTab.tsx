import { KybDetailSectionHeader } from "@/components/kyb/detail/KybDetailSectionHeader";
import { AlertTriangle, Check } from "lucide-react";
import type {
  KybComplianceChecksData,
  KybComplianceRegistryCheck,
  KybComplianceRegistryStatus,
  KybComplianceScreeningCheck,
  KybComplianceScreeningStatus,
} from "@/types/kyb";

type KybComplianceChecksTabProps = {
  complianceChecks: KybComplianceChecksData;
};

function RegistryStatusBadge({ status }: { status: KybComplianceRegistryStatus }) {
  if (status === "passed") {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--state-success)]">
        <Check className="h-4 w-4" />
        Passed
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--state-error)]">
        <AlertTriangle className="h-4 w-4" />
        Failed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--state-warning)]">
      <AlertTriangle className="h-4 w-4" />
      Review
    </span>
  );
}

function ScreeningStatusLabel({ status }: { status: KybComplianceScreeningStatus }) {
  if (status === "no-match") {
    return <span className="text-sm font-medium text-[color:var(--state-success)]">No Match</span>;
  }

  if (status === "match") {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--state-warning)]">
        <AlertTriangle className="h-4 w-4" />
        Match
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--state-error)]">
      <AlertTriangle className="h-4 w-4" />
      Flagged
    </span>
  );
}

function TealCheckIcon() {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--accent-primary-hover)] text-white">
      <Check className="h-3.5 w-3.5" />
    </span>
  );
}

function RegistryCheckRow({ check }: { check: KybComplianceRegistryCheck }) {
  return (
    <article className="flex items-center justify-between gap-4 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-5 py-4 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-[color:var(--text-primary)]">{check.title}</p>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">{check.description}</p>
      </div>
      <RegistryStatusBadge status={check.status} />
    </article>
  );
}

function ScreeningSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
        {title}
      </h3>
      <div className="mt-3 rounded-xl bg-[color:var(--bg-muted)] px-5 py-2">{children}</div>
    </div>
  );
}

function SanctionsRow({ label, status }: { label: string; status: KybComplianceScreeningStatus }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3">
        <TealCheckIcon />
        <p className="text-sm font-semibold text-[color:var(--text-primary)]">{label}</p>
      </div>
      <ScreeningStatusLabel status={status} />
    </div>
  );
}

function ScreeningCheckRow({ check }: { check: KybComplianceScreeningCheck }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-semibold text-[color:var(--text-primary)]">{check.label}</p>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">{check.description}</p>
      </div>
      <ScreeningStatusLabel status={check.status} />
    </div>
  );
}

export function KybComplianceChecksTab({ complianceChecks }: KybComplianceChecksTabProps) {
  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
      <KybDetailSectionHeader
        title="AML Screening"
        description="Anti Money Laundering compliance screening"
        status={complianceChecks.clearanceStatus}
      />

      <div className="space-y-6 p-6">
        <div className="space-y-3">
          {complianceChecks.registryChecks.map((check) => (
            <RegistryCheckRow key={check.id} check={check} />
          ))}
        </div>

        <ScreeningSection title="Sanctions Screening (Screened against 4 global sanctions lists)">
          <div className="divide-y divide-[color:var(--border-subtle)]">
            {complianceChecks.sanctionsLists.map((entry) => (
              <SanctionsRow key={entry.id} label={entry.label} status={entry.status} />
            ))}
          </div>
        </ScreeningSection>

        <ScreeningSection title="Politically Exposed Person">
          <ScreeningCheckRow check={complianceChecks.pepCheck} />
        </ScreeningSection>

        <ScreeningSection title="Adverse Media Screening">
          <ScreeningCheckRow check={complianceChecks.adverseMediaCheck} />
        </ScreeningSection>
      </div>
    </div>
  );
}
