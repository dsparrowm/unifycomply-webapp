import { AlertTriangle, Check } from "lucide-react";
import type { KybDirector, KybDirectorAmlCheckStatus } from "@/types/kyb";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function DirectorInfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-[color:var(--text-muted)]">{label}</p>
      <p className="text-sm font-semibold text-[color:var(--text-primary)]">{value}</p>
    </div>
  );
}

function NoMatchBadge() {
  return (
    <span className="text-sm font-medium text-[color:var(--state-success)]">No Match</span>
  );
}

function MatchBadge({ severity = "warning" }: { severity?: "warning" | "critical" }) {
  const isCritical = severity === "critical";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium",
        isCritical ? "text-[color:var(--state-error)]" : "text-[color:var(--state-warning)]",
      )}
    >
      <AlertTriangle className="h-4 w-4" />
      Match
    </span>
  );
}

function AmlCheckRow({
  label,
  status,
  matchSeverity = "warning",
}: {
  label: string;
  status: KybDirectorAmlCheckStatus;
  matchSeverity?: "warning" | "critical";
}) {
  const isMatch = status === "match";
  const isCritical = isMatch && matchSeverity === "critical";

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full text-white",
            isMatch
              ? isCritical
                ? "bg-[color:var(--state-error)]"
                : "bg-[color:var(--state-warning)]"
              : "bg-[color:var(--accent-primary-hover)]",
          )}
        >
          {isMatch ? <AlertTriangle className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
        </span>
        <p className="text-sm font-semibold text-[color:var(--text-primary)]">{label}</p>
      </div>
      {status === "no-match" ? (
        <NoMatchBadge />
      ) : status === "match" ? (
        <MatchBadge severity={matchSeverity} />
      ) : (
        <span className="text-sm font-medium text-[color:var(--state-warning)]">Flagged</span>
      )}
    </div>
  );
}

function getAmlRiskLevelStyles(level: string, clearanceStatus: KybDirector["amlClearanceStatus"]) {
  const normalizedLevel = level.toLowerCase();

  if (clearanceStatus === "flagged" || normalizedLevel.includes("very high")) {
    return "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]";
  }

  if (clearanceStatus === "review" || normalizedLevel.includes("medium") || normalizedLevel.includes("high")) {
    return "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]";
  }

  return "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]";
}

type KybDirectorCardProps = {
  director: KybDirector;
};

export function KybDirectorCard({ director }: KybDirectorCardProps) {
  const initials = getInitials(director.fullName);

  return (
    <article className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-primary-hover)] text-lg font-semibold text-white"
            aria-hidden
          >
            {initials}
          </div>

          <div className="space-y-2">
            <div>
              <h3 className="text-base font-semibold text-[color:var(--text-primary)]">
                {director.fullName}
              </h3>
              <p className="text-sm text-[color:var(--text-muted)]">{director.role}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {director.verificationStatus === "verified" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--state-success-soft)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--state-success)]">
                  <Check className="h-3 w-3" />
                  Verified
                </span>
              ) : null}
              {director.pepStatus === "non-pep" ? (
                <span className="inline-flex items-center rounded-full bg-[color:var(--state-info-soft)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--state-info)]">
                  Non-PEP
                </span>
              ) : null}
              {director.pepStatus === "pep" ? (
                <span className="text-sm font-medium text-[color:var(--state-error)]">PEP Match</span>
              ) : null}
              {director.pepStatus === "possible-pep" ? (
                <span className="text-sm font-medium text-[color:var(--state-warning)]">Possible PEP</span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="text-left lg:text-right">
          <p className="text-2xl font-semibold text-[color:var(--text-primary)]">
            {director.shareholdingPercent}%
          </p>
          <p className="text-sm text-[color:var(--text-muted)]">Shareholding</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <DirectorInfoField label="Nationality" value={director.nationality} />
        <DirectorInfoField label="Date Appointed" value={director.dateAppointed} />
        <DirectorInfoField label="ID Type" value={director.idType} />
        <DirectorInfoField label="ID Number" value={director.idNumber} />
        <DirectorInfoField label="Phone" value={director.phone} />
        <DirectorInfoField label="Email" value={director.email} />
      </div>

      <div className="mt-6">
        <DirectorInfoField label="Address" value={director.address} />
      </div>

      <div className="mt-6 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
            AML Screening Result
          </h4>
          <div className="flex flex-wrap items-center gap-2">
            {director.amlClearanceStatus === "clear" ? (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--state-success)]">
                <Check className="h-4 w-4" />
                Clear
              </span>
            ) : null}
            {director.amlClearanceStatus === "review" ? (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--state-warning)]">
                <AlertTriangle className="h-4 w-4" />
                Needs review
              </span>
            ) : null}
            {director.amlClearanceStatus === "flagged" ? (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--state-error)]">
                <AlertTriangle className="h-4 w-4" />
                Flagged
              </span>
            ) : null}
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                getAmlRiskLevelStyles(director.amlRiskLevel, director.amlClearanceStatus),
              )}
            >
              {director.amlRiskLevel}
            </span>
          </div>
        </div>

        <div className="mt-2 divide-y divide-[color:var(--border-subtle)]">
          {director.amlChecks.map((check) => (
            <AmlCheckRow
              key={check.id}
              label={check.label}
              status={check.status}
              matchSeverity={check.matchSeverity}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
