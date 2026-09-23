"use client";

import { KybListPanel } from "@/components/kyb/KybListPanel";
import { PageErrorState } from "@/components/feedback/PageErrorState";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { getErrorMessage } from "@/lib/api/errors";
import { useKybList } from "@/lib/hooks/use-customers";
import type { KybListFilters } from "@/types/kyb";

type KybListContainerProps = {
  initialSearchMode?: KybListFilters["searchMode"];
};

export function KybListContainer({ initialSearchMode }: KybListContainerProps) {
  const query = useKybList();

  if (query.isLoading) {
    return <PageLoadingSkeleton variant="dashboard" />;
  }

  if (query.isError || !query.data) {
    return (
      <PageErrorState
        title="Could not load KYB queue"
        description={getErrorMessage(query.error, "Please try again.")}
        onRetry={() => {
          void query.refetch();
        }}
      />
    );
  }

  return <KybListPanel data={query.data} initialSearchMode={initialSearchMode} />;
}
