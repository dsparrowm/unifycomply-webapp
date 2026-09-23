"use client";

import { KybDetailPanel } from "@/components/kyb/detail/KybDetailPanel";
import { PageErrorState } from "@/components/feedback/PageErrorState";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { getErrorMessage } from "@/lib/api/errors";
import { useKybDetail } from "@/lib/hooks/use-customers";

type KybDetailContainerProps = {
  routeId: string;
  workflowId?: string;
};

export function KybDetailContainer({ routeId, workflowId }: KybDetailContainerProps) {
  const query = useKybDetail(routeId, workflowId);

  if (query.isLoading) {
    return <PageLoadingSkeleton variant="generic" />;
  }

  if (query.isError || !query.data) {
    return (
      <PageErrorState
        title="Could not load KYB business"
        description={getErrorMessage(query.error, "This business could not be found.")}
        onRetry={() => {
          void query.refetch();
        }}
      />
    );
  }

  return <KybDetailPanel detail={query.data} />;
}
