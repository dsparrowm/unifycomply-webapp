"use client";

import { KybListPanel } from "@/components/kyb/KybListPanel";
import { PageErrorState } from "@/components/feedback/PageErrorState";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { getErrorMessage } from "@/lib/api/errors";
import { useAssignableOfficers, useAssignVerification } from "@/lib/hooks/use-assignment";
import { useKybList } from "@/lib/hooks/use-customers";
import { toastError, toastSuccess } from "@/lib/toast";
import type { KybListFilters } from "@/types/kyb";

type KybListContainerProps = {
  initialSearchMode?: KybListFilters["searchMode"];
};

export function KybListContainer({ initialSearchMode }: KybListContainerProps) {
  const query = useKybList();
  const officers = useAssignableOfficers();
  const assign = useAssignVerification();

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

  return (
    <KybListPanel
      data={query.data}
      initialSearchMode={initialSearchMode}
      assignees={officers.data ?? [{ value: "", label: "Unassigned" }]}
      assigningWorkflowId={assign.isPending ? assign.variables?.workflowId : null}
      onAssign={(workflowId, userId) => {
        void assign
          .mutateAsync({ workflowId, userId })
          .then(() => toastSuccess(userId ? "Reviewer assigned" : "Reviewer cleared"))
          .catch((error: unknown) => toastError(error, "Could not assign this case"));
      }}
    />
  );
}
