import { Suspense } from "react";
import { SarRationaleContainer } from "@/components/transaction-monitoring/SarRationaleContainer";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";

type SarRationalePageProps = {
  params: Promise<{ id: string }>;
};

export default async function SarRationalePage({ params }: SarRationalePageProps) {
  const { id } = await params;
  return <Suspense fallback={<PageLoadingSkeleton variant="dashboard" />}><SarRationaleContainer transactionId={id} /></Suspense>;
}
