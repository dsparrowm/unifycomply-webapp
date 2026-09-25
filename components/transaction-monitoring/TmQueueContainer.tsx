"use client";

import { PageErrorState } from "@/components/feedback/PageErrorState";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { TmQueueListPanel } from "@/components/transaction-monitoring/TmQueueListPanel";
import { getErrorMessage } from "@/lib/api/errors";
import { useTransactionMonitoringQueue } from "@/lib/hooks/use-transaction-monitoring";
import type { TmQueueId } from "@/types/transaction-monitoring";

export function TmQueueContainer({ queueId }: { queueId: TmQueueId }) {
  const query = useTransactionMonitoringQueue(queueId);

  if (query.isLoading) return <PageLoadingSkeleton variant="dashboard" />;
  if (query.isError || !query.data) {
    return (
      <PageErrorState
        title="Could not load transaction queue"
        description={getErrorMessage(query.error, "The transaction queue could not be loaded.")}
        onRetry={() => void query.refetch()}
      />
    );
  }

  return <TmQueueListPanel data={query.data} />;
}