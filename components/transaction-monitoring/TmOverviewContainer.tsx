"use client";

import { PageErrorState } from "@/components/feedback/PageErrorState";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { TmOverviewPanel } from "@/components/transaction-monitoring/TmOverviewPanel";
import { getErrorMessage } from "@/lib/api/errors";
import { useTransactionMonitoringOverview } from "@/lib/hooks/use-transaction-monitoring";

export function TmOverviewContainer() {
  const query = useTransactionMonitoringOverview();

  if (query.isLoading) return <PageLoadingSkeleton variant="dashboard" />;
  if (query.isError || !query.data) {
    return (
      <PageErrorState
        title="Could not load transaction monitoring"
        description={getErrorMessage(query.error, "The monitoring overview could not be loaded.")}
        onRetry={() => void query.refetch()}
      />
    );
  }

  return <TmOverviewPanel data={query.data} />;
}