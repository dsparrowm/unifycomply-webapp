"use client";

import { AccountStatementPanel } from "@/components/transaction-monitoring/AccountStatementPanel";
import { PageErrorState } from "@/components/feedback/PageErrorState";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { getErrorMessage } from "@/lib/api/errors";
import { useCustomerStatement } from "@/lib/hooks/use-customer-statement";
import { useTransactionDetail } from "@/lib/hooks/use-transactions";

export function AccountStatementContainer({ transactionId }: { transactionId: string }) {
  const detail = useTransactionDetail(transactionId);
  const customerId = detail.data?.customerId;
  const statement = useCustomerStatement(customerId);

  if (detail.isLoading || statement.isLoading) return <PageLoadingSkeleton variant="dashboard" />;
  if (detail.isError || statement.isError || !statement.data) {
    return (
      <PageErrorState
        title="Could not load account statement"
        description={getErrorMessage(detail.error ?? statement.error, "The account statement could not be loaded.")}
        onRetry={() => {
          void detail.refetch();
          void statement.refetch();
        }}
      />
    );
  }

  return (
    <AccountStatementPanel
      transactionId={transactionId}
      data={{ ...statement.data, customerName: detail.data.customerName }}
    />
  );
}