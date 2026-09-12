"use client";

import { KycListPanel } from "@/components/kyc/KycListPanel";
import { PageErrorState } from "@/components/feedback/PageErrorState";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { getErrorMessage } from "@/lib/api/errors";
import { useKycList } from "@/lib/hooks/use-customers";

export function KycListContainer() {
  const query = useKycList();

  if (query.isLoading) {
    return <PageLoadingSkeleton variant="dashboard" />;
  }

  if (query.isError || !query.data) {
    return (
      <PageErrorState
        title="Could not load KYC customers"
        description={getErrorMessage(query.error, "Please try again.")}
        onRetry={() => {
          void query.refetch();
        }}
      />
    );
  }

  return <KycListPanel data={query.data} />;
}
