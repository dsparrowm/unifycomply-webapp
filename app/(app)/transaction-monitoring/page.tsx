import { Suspense } from "react";
import { TmOverviewContainer } from "@/components/transaction-monitoring/TmOverviewContainer";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";

/** Default empty state matches Figma `1532:157044`. */
export default function TransactionMonitoringPage() {
  return (
    <Suspense fallback={<PageLoadingSkeleton variant="dashboard" />}>
      <TmOverviewContainer />
    </Suspense>
  );
}
