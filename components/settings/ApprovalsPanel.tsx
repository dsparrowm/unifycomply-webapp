"use client";

import { useState } from "react";
import { ApprovalThresholdsSection } from "@/components/settings/ApprovalThresholdsSection";
import { RiskFactorRow } from "@/components/settings/RiskFactorRow";
import type { SettingsApprovals, SettingsRiskFactor, SettingsRiskFactorImpact, SettingsApprovalThresholds } from "@/types/settings";
import { cn } from "@/lib/utils";

type ApprovalsTab = "risk-factors" | "approval-thresholds";

type ApprovalsPanelProps = {
  approvals: SettingsApprovals;
};

export function ApprovalsPanel({ approvals }: ApprovalsPanelProps) {
  const [activeTab, setActiveTab] = useState<ApprovalsTab>("risk-factors");
  const [riskFactors, setRiskFactors] = useState<SettingsRiskFactor[]>(approvals.riskFactors);
  const [thresholds, setThresholds] = useState<SettingsApprovalThresholds>(approvals.thresholds);
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImpactChange = (factorId: string, impact: SettingsRiskFactorImpact) => {
    setRiskFactors((current) =>
      current.map((factor) => (factor.id === factorId ? { ...factor, impact } : factor)),
    );
    setIsDirty(true);
  };

  const handleWarningThresholdChange = (value: number) => {
    setThresholds((current) => ({ ...current, warningThreshold: value }));
    setIsDirty(true);
  };

  const handleBlockThresholdChange = (value: number) => {
    setThresholds((current) => ({ ...current, approvalBlockThreshold: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsSubmitting(false);
    setIsDirty(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            Approval Configuration
          </h2>
          <p className="mt-0.5 text-xs text-[color:var(--text-light)]">
            Configure risk factors, approval thresholds, and role-based approval workflows
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty || isSubmitting}
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-lg px-4 py-2.5 text-xs font-medium transition-colors",
            isDirty
              ? "bg-[color:var(--accent-primary-hover)] text-white hover:bg-[color:var(--accent-primary)]"
              : "cursor-not-allowed bg-[color:var(--border-subtle)] text-[color:var(--text-light)]",
          )}
        >
          Save Changes
        </button>
      </div>

      <div className="inline-flex w-fit rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] p-0.5">
        <button
          type="button"
          onClick={() => setActiveTab("risk-factors")}
          className={cn(
            "rounded-md px-6 py-1.5 text-xs font-medium transition-colors",
            activeTab === "risk-factors"
              ? "bg-[color:var(--bg-surface)] text-[color:var(--text-primary)] shadow-sm"
              : "text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]",
          )}
        >
          Risk Factors
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("approval-thresholds")}
          className={cn(
            "rounded-md px-6 py-1.5 text-xs font-medium transition-colors",
            activeTab === "approval-thresholds"
              ? "bg-[color:var(--bg-surface)] text-[color:var(--text-primary)] shadow-sm"
              : "text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]",
          )}
        >
          Approval Thresholds
        </button>
      </div>

      {activeTab === "risk-factors" ? (
        <section className="overflow-hidden rounded-lg border border-[color:var(--border-default)]">
          <div className="flex items-center gap-3 border-b border-[color:var(--border-default)] px-4 py-5">
            <div
              className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary)]"
              aria-hidden
            >
              <span className="text-sm font-semibold">RF</span>
            </div>
            <div>
              <h3 className="text-base font-medium text-[color:var(--text-primary)]">
                Risk Factor Configuration
              </h3>
              <p className="mt-0.5 text-xs text-[color:var(--text-light)]">
                Enable or disable risk factors and adjust their weights
              </p>
            </div>
          </div>

          <div className="space-y-4 p-6">
            {riskFactors.map((factor) => (
              <RiskFactorRow
                key={factor.id}
                factor={factor}
                onImpactChange={(impact) => handleImpactChange(factor.id, impact)}
              />
            ))}
          </div>
        </section>
      ) : (
        <ApprovalThresholdsSection
          thresholds={thresholds}
          onWarningChange={handleWarningThresholdChange}
          onBlockChange={handleBlockThresholdChange}
        />
      )}
    </div>
  );
}
