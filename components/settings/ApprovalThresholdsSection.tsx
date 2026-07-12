"use client";

import { AlertTriangle, Shield } from "lucide-react";
import type { SettingsApprovalThresholds } from "@/types/settings";
import { cn } from "@/lib/utils";

const riskScale = [
  { label: "0 - No Risk", className: "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]" },
  {
    label: "1 - Low Risk",
    className: "bg-[color:var(--sandbox-bg)] text-[color:var(--sandbox-text)]",
  },
  {
    label: "2 - Moderate Risk",
    className: "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  },
  {
    label: "3 - High Risk",
    className: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
  },
  {
    label: "4 - Very High",
    className: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)] opacity-90",
  },
];

type ThresholdSliderProps = {
  value: number;
  max: number;
  onChange: (value: number) => void;
  fillClassName: string;
  id: string;
};

function ThresholdSlider({ value, max, onChange, fillClassName, id }: ThresholdSliderProps) {
  const percentage = (value / max) * 100;

  return (
    <div className="space-y-2">
      <div className="relative h-2 rounded-full bg-[color:var(--border-subtle)]">
        <div
          className={cn("absolute inset-y-0 left-0 rounded-full", fillClassName)}
          style={{ width: `${percentage}%` }}
        />
        <input
          id={id}
          type="range"
          min={0}
          max={max}
          step={1}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="threshold-slider absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={value}
        />
      </div>
      <div className="flex items-center justify-between text-sm text-[color:var(--text-primary)]">
        <span>0%</span>
        <span>
          {value}/{max}
        </span>
      </div>
    </div>
  );
}

type ApprovalThresholdsSectionProps = {
  thresholds: SettingsApprovalThresholds;
  onWarningChange: (value: number) => void;
  onBlockChange: (value: number) => void;
};

export function ApprovalThresholdsSection({
  thresholds,
  onWarningChange,
  onBlockChange,
}: ApprovalThresholdsSectionProps) {
  const { warningThreshold, approvalBlockThreshold, maxScore } = thresholds;

  return (
    <section className="overflow-hidden rounded-lg border border-[color:var(--border-default)]">
      <div className="flex items-start gap-3 border-b border-[color:var(--border-default)] px-4 py-5">
        <div
          className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]"
          aria-hidden
        >
          <Shield className="h-[18px] w-[18px]" />
        </div>
        <div>
          <h3 className="text-base font-medium text-[color:var(--text-primary)]">
            Risk Score Thresholds
          </h3>
          <p className="mt-0.5 text-xs text-[color:var(--text-light)]">
            Configure when the system should block approvals or show warnings based on risk scores
            (0-4 scale).
          </p>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <div className="space-y-4 rounded-lg bg-[color:var(--state-warning-soft)]/60 p-6">
          <div>
            <p className="text-sm font-medium text-[color:var(--state-warning)]">
              Warning Threshold
            </p>
            <p className="mt-1 text-xs text-[color:var(--text-light)]">
              Name similarity or known association with politically exposed persons
            </p>
          </div>
          <ThresholdSlider
            id="warning-threshold"
            value={warningThreshold}
            max={maxScore}
            onChange={onWarningChange}
            fillClassName="bg-[color:var(--state-warning)]"
          />
        </div>

        <div className="space-y-4 rounded-lg bg-[color:var(--state-error-soft)]/70 p-6">
          <div>
            <p className="text-sm font-medium text-[color:var(--state-error)]">
              Approval Block Threshold
            </p>
            <p className="mt-1 text-xs text-[color:var(--text-light)]">
              Verifications with risk scores at or above this level cannot be approved
            </p>
          </div>
          <ThresholdSlider
            id="approval-block-threshold"
            value={approvalBlockThreshold}
            max={maxScore}
            onChange={onBlockChange}
            fillClassName="bg-[color:var(--state-error)]"
          />
          <div className="rounded-lg border border-[color:var(--state-error-soft)] bg-[color:var(--bg-surface)] px-4 py-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--state-warning)]" />
              <p className="text-xs text-[color:var(--text-light)]">
                <span className="font-medium text-[color:var(--text-primary)]">Condition:</span>{" "}
                Currently set to {approvalBlockThreshold}. Any verification with a risk score of{" "}
                {approvalBlockThreshold} or {maxScore} will have the approval button disabled.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium text-[color:var(--text-primary)]">Visual Risk Scale</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {riskScale.map((segment) => (
              <div
                key={segment.label}
                className={cn(
                  "flex min-h-[67px] items-center justify-center rounded-lg px-3 py-4 text-center text-xs font-medium",
                  segment.className,
                )}
              >
                {segment.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
