"use client";

import type { ReactNode } from "react";
import { PageErrorState } from "@/components/feedback/PageErrorState";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { getErrorMessage } from "@/lib/api/errors";

type QueryGateProps = {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  title?: string;
  onRetry?: () => void;
  children: ReactNode;
};

export function QueryGate({
  isLoading,
  isError,
  error,
  title = "Could not load this page",
  onRetry,
  children,
}: QueryGateProps) {
  if (isLoading) {
    return <PageLoadingSkeleton variant="generic" />;
  }

  if (isError) {
    return (
      <PageErrorState
        title={title}
        description={getErrorMessage(error, "Please try again.")}
        onRetry={onRetry}
      />
    );
  }

  return children;
}
