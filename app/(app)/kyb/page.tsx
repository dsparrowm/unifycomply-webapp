"use client";

import { QueryGate } from "@/components/feedback/QueryGate";
import { KybListPanel } from "@/components/kyb/KybListPanel";
import { kybListDataEmpty } from "@/lib/data/kyb";
import { useKybList } from "@/lib/hooks/use-compliance";

export default function KybPage() {
  const query = useKybList();

  return (
    <QueryGate
      isLoading={query.isLoading}
      isError={query.isError}
      error={query.error}
      title="Could not load KYB customers"
      onRetry={() => void query.refetch()}
    >
      <KybListPanel data={query.data ?? kybListDataEmpty} />
    </QueryGate>
  );
}
