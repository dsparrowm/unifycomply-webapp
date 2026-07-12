import { Check } from "lucide-react";
import type { KycLivenessData } from "@/types/kyc";

type KycLivenessPanelProps = {
  liveness: KycLivenessData;
};

function SummaryCard({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5">
      <p className="text-sm font-medium text-[color:var(--text-primary)]">{title}</p>
      <p className="mt-4 text-3xl font-semibold leading-none text-[color:var(--accent-primary-hover)]">
        {value}
      </p>
      <p className="mt-2 text-sm font-medium text-[color:var(--accent-primary-hover)]">{note}</p>
    </div>
  );
}

function PassIcon() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--accent-primary-hover)] text-white">
      <Check className="h-4 w-4" />
    </span>
  );
}

export function KycLivenessPanel({ liveness }: KycLivenessPanelProps) {
  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[color:var(--border-default)] px-6 py-5">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            Liveness Detection
          </h2>
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">
            Real-time biometric liveness verification
          </p>
        </div>
        <span className="text-sm font-medium text-[color:var(--state-success)]">
          {liveness.overallStatusLabel}
        </span>
      </div>

      <div className="grid gap-4 p-6 md:grid-cols-3">
        <SummaryCard
          title="Liveness Status"
          value={liveness.livenessStatus}
          note={liveness.livenessStatusNote}
        />
        <SummaryCard
          title="Confidence Score"
          value={liveness.confidenceScore}
          note={liveness.confidenceNote}
        />
        <SummaryCard
          title="Completion Time"
          value={liveness.completionTime}
          note={liveness.attemptsLabel}
        />
      </div>

      <div className="px-6 pb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
          Liveness Checks Performed
        </h3>
        <div className="mt-4 rounded-xl bg-[color:var(--bg-muted)] px-5 py-2">
          {liveness.checks.map((check, index) => (
            <div
              key={check.id}
              className={
                index < liveness.checks.length - 1
                  ? "flex items-center justify-between gap-4 border-b border-[color:var(--border-default)] py-4"
                  : "flex items-center justify-between gap-4 py-4"
              }
            >
              <p className="text-sm font-medium text-[color:var(--text-primary)]">{check.label}</p>
              {check.status === "passed" ? <PassIcon /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
