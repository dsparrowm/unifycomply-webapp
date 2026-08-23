"use client";

import { QueryGate } from "@/components/feedback/QueryGate";
import { KycListPanel } from "@/components/kyc/KycListPanel";
import { kycListDataEmpty } from "@/lib/data/kyc";
import { useKycList } from "@/lib/hooks/use-compliance";

export default function KycPage() {
  const query = useKycList();

  return (
    <QueryGate
      isLoading={query.isLoading}
      isError={query.isError}
      error={query.error}
      title="Could not load KYC customers"
      onRetry={() => void query.refetch()}
    >
      <KycListPanel data={query.data ?? kycListDataEmpty} />
    </QueryGate>
  );
}
