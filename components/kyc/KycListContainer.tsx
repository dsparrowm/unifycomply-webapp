"use client";

import { KycListPanel } from "@/components/kyc/KycListPanel";
import { PageErrorState } from "@/components/feedback/PageErrorState";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { getErrorMessage } from "@/lib/api/errors";
import { useAssignableOfficers, useAssignVerification } from "@/lib/hooks/use-assignment";
import { useKycList } from "@/lib/hooks/use-customers";
import { toastError, toastSuccess } from "@/lib/toast";

export function KycListContainer() {
  const query = useKycList();
  const officers = useAssignableOfficers();
  const assign = useAssignVerification();

  if (query.isLoading) {
    return <PageLoadingSkeleton variant="dashboard" />;
  }

  if (query.isError || !query.data) {
    return (
      <PageErrorState
        title="Could not load KYC queue"
        description={getErrorMessage(query.error, "Please try again.")}
        onRetry={() => {
          void query.refetch();
        }}
      />
    );
  }

  return (
    <KycListPanel
      data={query.data}
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
