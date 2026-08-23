import { KycLookupProfileAvatar } from "@/components/kyc/lookup/KycLookupProfileAvatar";
import type { KycBvnLookupResult } from "@/types/kyc";

type KycLookupSummaryPanelProps = {
  result: KycBvnLookupResult;
};

export function KycLookupSummaryPanel({ result }: KycLookupSummaryPanelProps) {
  const rows = [
    { label: "First Name", value: result.firstName },
    { label: "Last Name", value: result.lastName },
    { label: "Middle Name", value: result.middleName },
    { label: "Gender", value: result.gender },
    { label: "Phone Number", value: result.phoneNumber },
  ];

  const fullName = `${result.firstName} ${result.lastName}`;

  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6">
      <div className="flex flex-col items-center">
        <KycLookupProfileAvatar
          name={fullName}
          variant="circle"
          showVerifiedBadge
          className="mb-8"
        />

        <div className="w-full space-y-0">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4 border-b border-[color:var(--border-subtle)] py-3 last:border-b-0"
            >
              <span className="text-sm text-[color:var(--text-muted)]">{row.label}</span>
              <span className="text-sm font-medium text-[color:var(--text-primary)]">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-[color:var(--bg-muted)] px-3 py-2">
            <p className="text-sm text-[color:var(--text-muted)]">Risk Score</p>
            <p className="mt-2 text-sm font-semibold text-[color:var(--accent-primary-hover)]">
              {result.riskScore}
            </p>
          </div>
          <div className="rounded-lg bg-[color:var(--bg-muted)] px-3 py-2">
            <p className="text-sm text-[color:var(--text-muted)]">Priority</p>
            <p className="mt-2 text-sm font-semibold text-[color:var(--accent-primary-hover)]">
              {result.priority}
            </p>
          </div>
          <div className="rounded-lg bg-[color:var(--bg-muted)] px-3 py-2">
            <p className="text-sm text-[color:var(--text-muted)]">Date/Time Initialized</p>
            <p className="mt-2 text-sm font-semibold text-[color:var(--text-primary)]">
              {result.initializedAt}
            </p>
          </div>
          <div className="rounded-lg bg-[color:var(--bg-muted)] px-3 py-2">
            <p className="text-sm text-[color:var(--text-muted)]">Date/Time Updated</p>
            <p className="mt-2 text-sm font-semibold text-[color:var(--text-primary)]">
              {result.updatedAt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
