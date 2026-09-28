"use client";

import { TransactionDetailPanel } from "@/components/transaction-monitoring/TransactionDetailPanel";
import { PageErrorState } from "@/components/feedback/PageErrorState";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { getErrorMessage } from "@/lib/api/errors";
import { useTransactionDetail } from "@/lib/hooks/use-transactions";

type TransactionDetailContainerProps = {
  id: string;
};

export function TransactionDetailContainer({ id }: TransactionDetailContainerProps) {
  const query = useTransactionDetail(id);

  if (query.isLoading) {
    return <PageLoadingSkeleton variant="generic" />;
  }

  if (query.isError || !query.data) {
    return (
      <PageErrorState
        title="Could not load transaction"
        description={getErrorMessage(query.error, "This transaction could not be found.")}
        onRetry={() => {
          void query.refetch();
        }}
      />
    );
  }

  return <TransactionDetailPanel detail={query.data} />;
}
