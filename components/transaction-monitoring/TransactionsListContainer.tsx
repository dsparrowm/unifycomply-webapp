"use client";

import { TransactionsListPanel } from "@/components/transaction-monitoring/TransactionsListPanel";
import { PageErrorState } from "@/components/feedback/PageErrorState";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { getErrorMessage } from "@/lib/api/errors";
import { useTransactionsList } from "@/lib/hooks/use-transactions";

export function TransactionsListContainer() {
  const query = useTransactionsList();

  if (query.isLoading) {
    return <PageLoadingSkeleton variant="dashboard" />;
  }

  if (query.isError || !query.data) {
    return (
      <PageErrorState
        title="Could not load transactions"
        description={getErrorMessage(query.error, "Please try again.")}
        onRetry={() => {
          void query.refetch();
        }}
      />
    );
  }

  return <TransactionsListPanel data={query.data} />;
}
