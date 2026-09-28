import { Suspense } from "react";
import { AccountStatementContainer } from "@/components/transaction-monitoring/AccountStatementContainer";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";

type AccountStatementPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AccountStatementPage({
  params,
}: AccountStatementPageProps) {
  const { id } = await params;
  return <Suspense fallback={<PageLoadingSkeleton variant="dashboard" />}><AccountStatementContainer transactionId={id} /></Suspense>;
}
