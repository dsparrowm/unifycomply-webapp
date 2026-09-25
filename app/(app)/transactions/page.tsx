import { Suspense } from "react";
import { TransactionsListContainer } from "@/components/transaction-monitoring/TransactionsListContainer";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";

export default function TransactionsPage() {
  return (
    <Suspense fallback={<PageLoadingSkeleton variant="dashboard" />}>
      <TransactionsListContainer />
    </Suspense>
  );
}
