"use client";

import { useState } from "react";
import { AmlAdditionalInformationPanel } from "@/components/aml-screening/detail/AmlAdditionalInformationPanel";
import { AmlActiveMonitoringToggle } from "@/components/aml-screening/detail/AmlActiveMonitoringToggle";
import { AmlCreateCaseModal } from "@/components/aml-screening/detail/AmlCreateCaseModal";
import { AmlDecisionHistoryPanel } from "@/components/aml-screening/detail/AmlDecisionHistoryPanel";
import { AmlDetailActions } from "@/components/aml-screening/detail/AmlDetailActions";
import { AmlDetailHeader } from "@/components/aml-screening/detail/AmlDetailHeader";
import {
  AmlDetailPrimaryTabs,
  AmlDetailSummaryTabs,
} from "@/components/aml-screening/detail/AmlDetailTabs";
import { AmlEscalateModal } from "@/components/aml-screening/detail/AmlEscalateModal";
import { AmlKeySummaryPanel } from "@/components/aml-screening/detail/AmlKeySummaryPanel";
import { AmlLinkedEntitiesPanel } from "@/components/aml-screening/detail/AmlLinkedEntitiesPanel";
import { AmlSearchInformationRail } from "@/components/aml-screening/detail/AmlSearchInformationRail";
import { AmlVerificationsPanel } from "@/components/aml-screening/detail/AmlVerificationsPanel";
import type {
  AmlCreateCaseInput,
  AmlDecisionHistoryEntry,
  AmlDetailTab,
  AmlScreeningDetail,
  AmlScreeningStatus,
  AmlSummaryTab,
} from "@/types/aml-screening";

type AmlScreeningDetailPanelProps = {
  detail: AmlScreeningDetail;
};

function createHistoryEntry(
  type: AmlDecisionHistoryEntry["type"],
  title: string,
  description: string,
): AmlDecisionHistoryEntry {
  return {
    id: `${type}-${Date.now()}`,
    type,
    title,
    description,
    actor: "Current Compliance Officer",
    timestamp: "Just now",
  };
}

function PlaceholderPanel({ title, description }: { title: string; description: string }) {
  return (
    <section className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-8 shadow-sm">
      <h2 className="font-semibold text-[color:var(--text-primary)]">{title}</h2>
      <p className="mt-2 text-sm text-[color:var(--text-muted)]">{description}</p>
    </section>
  );
}

export function AmlScreeningDetailPanel({ detail }: AmlScreeningDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<AmlDetailTab>("data-summary");
  const [summaryTab, setSummaryTab] = useState<AmlSummaryTab>("key-summary");
  const [status, setStatus] = useState<AmlScreeningStatus>(detail.status);
  const [activeMonitoring, setActiveMonitoring] = useState(detail.activeMonitoring);
  const [history, setHistory] = useState(detail.decisionHistory);
  const [activeModal, setActiveModal] = useState<"case" | "escalate" | null>(null);
  const [feedback, setFeedback] = useState("");

  const addDecision = (
    nextStatus: AmlScreeningStatus,
    entry: AmlDecisionHistoryEntry,
    message: string,
  ) => {
    setStatus(nextStatus);
    setHistory((current) => [entry, ...current]);
    setFeedback(message);
    setActiveModal(null);
    setActiveTab("decision-history");
  };

  const handleCreateCase = (input: AmlCreateCaseInput) => {
    addDecision(
      "case-created",
      createHistoryEntry(
        "case-created",
        "Compliance case created",
        `${input.title} assigned to ${input.assignee} with ${input.priority} priority.`,
      ),
      "Compliance case created successfully.",
    );
  };

  const showSearchRail =
    activeTab === "data-summary" ||
    activeTab === "verifications" ||
    activeTab === "sources" ||
    activeTab === "warning-regulatory" ||
    activeTab === "risk-analysis";

  return (
    <div className="mx-auto flex max-w-[1327px] flex-col gap-6 pb-6">
      <AmlDetailHeader entityName={detail.entityName} />
      <AmlDetailPrimaryTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {feedback ? (
        <div
          role="status"
          className="rounded-lg border border-[color:var(--state-success)]/30 bg-[color:var(--state-success-soft)] px-4 py-3 text-sm text-[color:var(--state-success)]"
        >
          {feedback}
        </div>
      ) : null}

      <div
        className={
          showSearchRail
            ? "grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]"
            : undefined
        }
      >
        <div className="min-w-0 space-y-6">
          {activeTab === "data-summary" ? (
            <section className="overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
              <div className="flex flex-col gap-4 border-b border-[color:var(--border-default)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <AmlDetailSummaryTabs activeTab={summaryTab} onTabChange={setSummaryTab} />
                <AmlActiveMonitoringToggle
                  checked={activeMonitoring}
                  onChange={setActiveMonitoring}
                />
              </div>
              <div className="p-5">
                {summaryTab === "key-summary" ? (
                  <AmlKeySummaryPanel fields={detail.keySummary} />
                ) : null}
                {summaryTab === "linked-entities" ? (
                  <AmlLinkedEntitiesPanel entities={detail.linkedEntities} />
                ) : null}
                {summaryTab === "additional-information" ? (
                  <AmlAdditionalInformationPanel links={detail.additionalInformation} />
                ) : null}
              </div>
            </section>
          ) : null}

          {activeTab === "verifications" ? (
            <AmlVerificationsPanel
              sections={detail.verificationSections}
              activeMonitoring={activeMonitoring}
              onActiveMonitoringChange={setActiveMonitoring}
            />
          ) : null}

          {activeTab === "sources" ? (
            <PlaceholderPanel
              title="Sources"
              description="Source coverage and list provenance will be aligned to Figma Sources frames next."
            />
          ) : null}

          {activeTab === "warning-regulatory" ? (
            <PlaceholderPanel
              title="Warning and regulatory enforcement"
              description="Warning and enforcement detail content will be expanded in the next parity pass."
            />
          ) : null}

          {activeTab === "risk-analysis" ? (
            <PlaceholderPanel
              title="Risk Analysis"
              description={`Current risk score ${detail.riskScore}/4. Full risk analysis layout will follow Figma Risk Analysis frames.`}
            />
          ) : null}

          {activeTab === "decision-history" ? (
            <AmlDecisionHistoryPanel entries={history} />
          ) : null}
        </div>

        {showSearchRail ? (
          <AmlSearchInformationRail information={detail.searchInformation} />
        ) : null}
      </div>

      <AmlDetailActions
        status={status}
        onClear={() =>
          addDecision(
            "clear",
            createHistoryEntry(
              "cleared",
              "Screening cleared",
              "Potential matches were reviewed and marked as false positives.",
            ),
            "Screening marked as clear.",
          )
        }
        onCreateCase={() => setActiveModal("case")}
        onEscalate={() => setActiveModal("escalate")}
      />

      <AmlCreateCaseModal
        open={activeModal === "case"}
        detail={detail}
        onClose={() => setActiveModal(null)}
        onConfirm={handleCreateCase}
      />
      <AmlEscalateModal
        open={activeModal === "escalate"}
        detail={detail}
        onClose={() => setActiveModal(null)}
        onConfirm={(notes) =>
          addDecision(
            "escalated",
            createHistoryEntry("escalated", "Escalated to Senior Officer", notes),
            "Screening escalated to the Senior Officer queue.",
          )
        }
      />
    </div>
  );
}
