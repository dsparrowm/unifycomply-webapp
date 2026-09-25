import { Suspense } from "react";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { TransactionRulesContainer } from "@/components/transaction-monitoring/TransactionRulesContainer";

export default function RulesPage() {
  return <Suspense fallback={<PageLoadingSkeleton variant="dashboard" />}><TransactionRulesContainer /></Suspense>;
}
