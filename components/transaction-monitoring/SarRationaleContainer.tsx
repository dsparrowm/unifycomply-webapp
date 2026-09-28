"use client";

import { PageErrorState } from "@/components/feedback/PageErrorState";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { SarRationaleWizardPanel } from "@/components/transaction-monitoring/SarRationaleWizardPanel";
import { getErrorMessage } from "@/lib/api/errors";
import { buildSarRationalePayload } from "@/lib/api/transaction-monitoring";
import { useTransactionActions } from "@/lib/hooks/use-transaction-monitoring";
import { useTransactionDetail } from "@/lib/hooks/use-transactions";

export function SarRationaleContainer({ transactionId }: { transactionId: string }) {
  const detail = useTransactionDetail(transactionId);
  const actions = useTransactionActions(transactionId);

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
      onSubmit={(state) => void actions.sarRationale.mutateAsync(buildSarRationalePayload(state))}
    />
  );
}