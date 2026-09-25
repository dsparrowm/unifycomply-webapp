import { Suspense } from "react";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { TmQueueContainer } from "@/components/transaction-monitoring/TmQueueContainer";

export default function StopPaymentPage() {
  return <Suspense fallback={<PageLoadingSkeleton variant="dashboard" />}><TmQueueContainer queueId="stop-payment" /></Suspense>;
}
