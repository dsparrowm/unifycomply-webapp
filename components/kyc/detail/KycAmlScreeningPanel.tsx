import { Check, X } from "lucide-react";
import { KycPepMatchDetailPanel } from "@/components/kyc/detail/KycPepMatchDetailPanel";
import type { KycAmlScreeningData, KycAmlScreeningRow } from "@/types/kyc";
import { cn } from "@/lib/utils";

type KycAmlScreeningPanelProps = {
  amlScreening: KycAmlScreeningData;
};

function SummaryCard({
  title,
  value,
  note,
  showAlert,
}: {
  title: string;
  value: string;
  note: string;
  showAlert?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[color:var(--accent-primary-hover)]/25 bg-[color:var(--bg-surface)] p-5">
      <p className="text-sm font-medium text-[color:var(--text-muted)]">{title}</p>
      <div className="mt-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-5xl font-semibold leading-none text-[color:var(--state-error)]">{value}</p>
          {showAlert ? (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--state-error)] text-white">
              <X className="h-4 w-4" />
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm font-medium text-[color:var(--accent-primary-hover)]">{note}</p>
      </div>
    </div>
  );
}

function NoMatchBadge() {
  return (
    <span className="rounded-full bg-[color:var(--state-success-soft)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--state-success)]">
      No Match
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

function SanctionsScreeningRow({
  label,
  status,
}: {
  label: string;
  status: "match" | "no-match";
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3">
        <TealCheckIcon />
        <p className="text-sm font-semibold text-[color:var(--text-primary)]">{label}</p>
      </div>
      {status === "match" ? (
        <span className="text-sm font-medium text-[color:var(--state-error)]">Match</span>
      ) : (
        <NoMatchBadge />
      )}
    </div>
  );
}

function ScreeningRow({ row }: { row: KycAmlScreeningRow }) {
  const isNoMatch = row.status === "no-match";

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-semibold text-[color:var(--text-primary)]">{row.label}</p>
        {row.description ? (
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">{row.description}</p>
        ) : null}
      </div>
      {isNoMatch ? (
        <NoMatchBadge />
      ) : (
        <span className="text-sm font-medium text-[color:var(--state-error)]">{row.statusLabel}</span>
      )}
    </div>
  );
}

export function KycAmlScreeningPanel({ amlScreening }: KycAmlScreeningPanelProps) {
  const hasPepMatch = Boolean(amlScreening.pepMatchDetail);
  const hasPepAlert = amlScreening.screeningStatusNote.toLowerCase().includes("pep");

  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[color:var(--border-default)] px-6 py-5">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            AML Screening
          </h2>
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">
            Anti-Money Laundering compliance screening
          </p>
        </div>
        <span
          className={cn(
            "text-sm font-medium",
            hasPepMatch
              ? "text-[color:var(--state-error)]"
              : "text-[color:var(--state-success)]",
          )}
        >
          {amlScreening.clearanceStatus}
        </span>
      </div>

      <div className="grid gap-4 p-6 md:grid-cols-2">
        <SummaryCard
          title="Screening Status"
          value={amlScreening.screeningStatus}
          note={amlScreening.screeningStatusNote}
          showAlert={hasPepAlert}
        />
        <SummaryCard
          title="Risk Level"
          value={String(amlScreening.riskLevel)}
          note={`Risk Score : ${amlScreening.riskScore}/${amlScreening.riskScoreMax}`}
          showAlert={amlScreening.riskLevel > 0}
        />
      </div>

      <div className="space-y-6 px-6 pb-6">
        {hasPepMatch && amlScreening.pepMatchDetail ? (
          <KycPepMatchDetailPanel detail={amlScreening.pepMatchDetail} />
        ) : (
          <ScreeningSection title="Politically Exposed Person (PEP) Check">
            <ScreeningRow row={amlScreening.pepCheck} />
          </ScreeningSection>
        )}

        <ScreeningSection title="Sanctions Screening (Screened against 4 global sanctions lists)">
          <div className="divide-y divide-[color:var(--border-default)]">
            {amlScreening.sanctionsLists.map((entry) => (
              <SanctionsScreeningRow key={entry.id} label={entry.label} status={entry.status} />
            ))}
          </div>
        </ScreeningSection>

        <ScreeningSection title="Adverse Media Screening">
          <ScreeningRow row={amlScreening.warningEnforcement} />
        </ScreeningSection>

        <ScreeningSection title="Watchlist Screening">
          <ScreeningRow row={amlScreening.watchlist} />
        </ScreeningSection>
      </div>
    </div>
  );
}
