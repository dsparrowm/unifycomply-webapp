"use client";

import { KycDetailPanel } from "@/components/kyc/KycDetailPanel";
import { PageErrorState } from "@/components/feedback/PageErrorState";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { getErrorMessage } from "@/lib/api/errors";
import { useKycDetail } from "@/lib/hooks/use-customers";

type KycDetailContainerProps = {
  routeId: string;
  workflowId?: string;
};

export function KycDetailContainer({ routeId, workflowId }: KycDetailContainerProps) {
  const query = useKycDetail(routeId, workflowId);

  if (query.isLoading) {
    return <PageLoadingSkeleton variant="generic" />;
  }

  if (query.isError || !query.data) {
    return (
      <PageErrorState
        title="Could not load KYC customer"
        description={getErrorMessage(query.error, "This customer could not be found.")}
        onRetry={() => {
          void query.refetch();
        }}
      />
    );
  }

  return <KycDetailPanel detail={query.data} />;
}
