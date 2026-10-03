"use client";

import { PageErrorState } from "@/components/feedback/PageErrorState";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { SarRationaleWizardPanel } from "@/components/transaction-monitoring/SarRationaleWizardPanel";
import { getErrorMessage } from "@/lib/api/errors";
import { buildSarRationalePayload } from "@/lib/api/transaction-monitoring";
import { resolveOptionValue } from "@/lib/investigation/option-values";
import { useInvestigationOptions } from "@/lib/hooks/use-investigation-options";
import { useTransactionActions } from "@/lib/hooks/use-transaction-monitoring";
import { useTransactionDetail } from "@/lib/hooks/use-transactions";
import { runAction } from "@/lib/toast";

export function SarRationaleContainer({ transactionId }: { transactionId: string }) {
  const detail = useTransactionDetail(transactionId);
  const actions = useTransactionActions(transactionId);
  const investigationOptions = useInvestigationOptions();

  if (detail.isLoading) return <PageLoadingSkeleton variant="dashboard" />;
  if (detail.isError || !detail.data) {
    return (
      <PageErrorState
        title="Could not load SAR rationale"
        description={getErrorMessage(detail.error, "The transaction could not be loaded.")}
        onRetry={() => void detail.refetch()}
      />
    );
  }

  return (
    <SarRationaleWizardPanel
      detail={detail.data}
      onSubmit={async (state) => {
        const payload = buildSarRationalePayload(state);
        const optionSets = investigationOptions.data;
        await runAction(
          () =>
            actions.sarRationale.mutateAsync({
              ...payload,
              entityType: resolveOptionValue(
                optionSets?.["investigation-entity-types"],
                state.basic.entityType === "Organization" ? "Business" : "Individual",
                payload.entityType,
              ) as typeof payload.entityType,
              riskLevel: resolveOptionValue(
                optionSets?.["investigation-risk-levels"],
                state.basic.riskLevel,
                payload.riskLevel,
              ) as typeof payload.riskLevel,
            }),
          { success: "SAR rationale filed", error: "Could not file this SAR rationale" },
        );
      }}
    />
  );
}