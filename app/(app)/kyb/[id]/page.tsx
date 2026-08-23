"use client";

import { useParams } from "next/navigation";
import { QueryGate } from "@/components/feedback/QueryGate";
import { PageErrorState } from "@/components/feedback/PageErrorState";
import { KybDetailPanel } from "@/components/kyb/detail/KybDetailPanel";
import { useKybDetail } from "@/lib/hooks/use-compliance";

export default function KybDetailPage() {
  const params = useParams<{ id: string }>();
  const customerId = params.id;
  const query = useKybDetail(customerId);

  return (
    <QueryGate
      isLoading={query.isLoading}
      isError={query.isError}
      error={query.error}
      title="Could not load this business"
      onRetry={() => void query.refetch()}
    >
      {query.data ? (
        <KybDetailPanel detail={query.data} />
      ) : (
        <PageErrorState
          title="Business not found"
          description="This KYB record is not in the current workspace."
        />
      )}
    </QueryGate>
  );
}
