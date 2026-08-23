"use client";

import { useParams } from "next/navigation";
import { QueryGate } from "@/components/feedback/QueryGate";
import { PageErrorState } from "@/components/feedback/PageErrorState";
import { KycDetailPanel } from "@/components/kyc/KycDetailPanel";
import { KycLookupResultPanel } from "@/components/kyc/lookup/KycLookupResultPanel";
import { useKycDetail } from "@/lib/hooks/use-compliance";

export default function KycDetailPage() {
  const params = useParams<{ id: string }>();
  const customerId = params.id;
  const query = useKycDetail(customerId);

  return (
    <QueryGate
      isLoading={query.isLoading}
      isError={query.isError}
      error={query.error}
      title="Could not load this customer"
      onRetry={() => void query.refetch()}
    >
      {query.data?.lookupView ? (
        <KycLookupResultPanel
          view={query.data.lookupView}
          backHref="/kyc"
          breadcrumb={`KYC / ${query.data.detail.customerName}`}
        />
      ) : query.data?.detail ? (
        <KycDetailPanel detail={query.data.detail} />
      ) : (
        <PageErrorState title="Customer not found" description="This KYC record is not in the current workspace." />
      )}
    </QueryGate>
  );
}
