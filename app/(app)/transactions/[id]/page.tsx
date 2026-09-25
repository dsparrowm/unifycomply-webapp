import { Suspense } from "react";
import { TransactionDetailContainer } from "@/components/transaction-monitoring/TransactionDetailContainer";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";

type TransactionDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TransactionDetailPage({
  params,
}: TransactionDetailPageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<PageLoadingSkeleton variant="generic" />}>
      <TransactionDetailContainer id={id} />
    </Suspense>
  );
}
