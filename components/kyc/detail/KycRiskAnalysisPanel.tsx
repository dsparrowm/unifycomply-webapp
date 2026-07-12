import { Check, X } from "lucide-react";
import { getRiskAnalysisScoreLabel } from "@/lib/kyc/risk-score";
import type {
  KycRiskAnalysisAction,
  KycRiskAnalysisData,
  KycRiskAnalysisItem,
  KycRiskAnalysisRecommendationTone,
} from "@/types/kyc";
import { cn } from "@/lib/utils";

type KycRiskAnalysisPanelProps = {
  riskScore: number;
  riskAnalysis: KycRiskAnalysisData;
};

type ScoreTone = "success" | "warning" | "error";

function AnalysisStatusIcon({
  status,
  failTone = "error",
}: {
  status: "pass" | "fail";
  failTone?: "warning" | "error";
}) {
  if (status === "pass") {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary-hover)]">
        <Check className="h-4 w-4" />
      </span>
    );
  }

  if (failTone === "warning") {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]">
        <X className="h-4 w-4" />
      </span>
    );
  }

  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]">
      <X className="h-4 w-4" />
    </span>
  );
}

function NoMatchBadge({ label = "No Match" }: { label?: string }) {
  return (
    <span className="rounded-full bg-[color:var(--state-success-soft)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--state-success)]">
      {label}
    </span>
  );
}

function AnalysisItemRow({
  item,
  failTone,
}: {
  item: KycRiskAnalysisItem;
  failTone?: "warning" | "error";
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <p className="text-sm font-medium text-[color:var(--text-primary)]">{item.label}</p>
      {item.status === "no-match" ? (
        <NoMatchBadge label={item.statusLabel} />
      ) : (
        <AnalysisStatusIcon status={item.status} failTone={failTone} />
      )}
    </div>
  );
}

function getScoreTone(score: number): ScoreTone {
  if (score === 0) {
    return "success";
  }

  if (score === 1) {
    return "warning";
  }

  return "error";
}

function getFailIconTone(score: number): "warning" | "error" {
  return score <= 1 ? "warning" : "error";
}

const scoreToneStyles: Record<ScoreTone, string> = {
  success: "text-[color:var(--accent-primary-hover)]",
  warning: "text-[color:var(--state-warning)]",
  error: "text-[color:var(--state-error)]",
};

const scoreCardBorderStyles: Record<ScoreTone, string> = {
  success: "border-[color:var(--accent-primary-hover)]/25",
  warning: "border-[color:var(--state-warning)]/30",
  error: "border-[color:var(--state-error)]/30",
};

const recommendationStyles: Record<
  KycRiskAnalysisRecommendationTone,
  { container: string; text: string }
> = {
  info: {
    container: "border-[color:var(--accent-primary-hover)]/30 bg-[color:var(--accent-primary-soft)]",
    text: "text-[color:var(--accent-primary-hover)]",
  },
  warning: {
    container: "border-[color:var(--state-warning)]/30 bg-[color:var(--state-warning-soft)]",
    text: "text-[color:var(--state-warning)]",
  },
  reject: {
    container: "border-[color:var(--state-warning)]/35 bg-[color:var(--state-warning-soft)]",
    text: "text-[color:var(--state-warning)]",
  },
};

function RiskAnalysisActionButton({ action }: { action: KycRiskAnalysisAction }) {
  return (
    <button
      type="button"
      className={cn(
        "h-11 rounded-lg px-5 text-sm font-medium transition-colors",
        action.variant === "outline" &&
          "border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] text-[color:var(--text-primary)] hover:bg-[color:var(--bg-muted)]",
        action.variant === "outline-danger" &&
          "border border-[color:var(--state-error)] bg-[color:var(--bg-surface)] text-[color:var(--state-error)] hover:bg-[color:var(--state-error-soft)]",
        action.variant === "primary" &&
          "bg-[color:var(--accent-primary-hover)] text-white hover:bg-[color:var(--accent-primary)]",
      )}
    >
      {action.label}
    </button>
  );
}

export function KycRiskAnalysisPanel({ riskScore, riskAnalysis }: KycRiskAnalysisPanelProps) {
  const scoreTone = getScoreTone(riskScore);
  const failIconTone = getFailIconTone(riskScore);
  const scoreLabel = riskAnalysis.scoreLevel || getRiskAnalysisScoreLabel(riskScore);
  const isCleared = riskAnalysis.clearanceStatus.toLowerCase() === "cleared";
  const recommendationTone = riskAnalysis.recommendationTone ?? "info";
  const recommendationStyle = recommendationStyles[recommendationTone];

  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[color:var(--border-default)] px-6 py-5">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            Risk Score
          </h2>
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">
            Risk score analysis and possible recommendation
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-sm font-medium",
            isCleared
              ? "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]"
              : "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
          )}
        >
          {riskAnalysis.clearanceStatus}
        </span>
      </div>

      <div className="flex flex-col gap-6 p-6">
        <div
          className={cn(
            "w-full max-w-[280px] rounded-xl border bg-[color:var(--bg-surface)] p-5",
            scoreCardBorderStyles[scoreTone],
          )}
        >
          <p className="text-sm font-medium text-[color:var(--text-primary)]">Risk Score Analysis</p>
          <p className={cn("mt-6 text-5xl font-semibold leading-none", scoreToneStyles[scoreTone])}>
            {riskScore}
          </p>
          <p className={cn("mt-2 text-sm font-medium", scoreToneStyles[scoreTone])}>{scoreLabel}</p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
            Analysis
          </h3>
          <div className="mt-3 rounded-xl bg-[color:var(--bg-muted)] px-5 py-1">
            {riskAnalysis.analysisItems.map((item) => (
              <AnalysisItemRow key={item.id} item={item} failTone={failIconTone} />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[color:var(--border-default)] px-6 py-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
            Recommendation
          </h3>
          {riskAnalysis.recommendationHeading ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--state-warning)]">
              {riskAnalysis.recommendationHeading}
            </p>
          ) : null}
        </div>
        <div className={cn("mt-4 rounded-lg border px-5 py-4", recommendationStyle.container)}>
          <p className={cn("text-sm leading-6", recommendationStyle.text)}>
            {riskAnalysis.recommendation}
          </p>
        </div>

        {riskAnalysis.actions && riskAnalysis.actions.length > 0 ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
            {riskAnalysis.actions.map((action) => (
              <RiskAnalysisActionButton key={action.id} action={action} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
