"use client";

import type { ReactNode } from "react";
import { PageErrorState } from "@/components/feedback/PageErrorState";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { getErrorMessage } from "@/lib/api/errors";

type SettingsQueryGateProps = {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry?: () => void;
  children: ReactNode;
};

export function SettingsQueryGate({
  isLoading,
  isError,
  error,
  onRetry,
  children,
}: SettingsQueryGateProps) {
  // Only block on the initial fetch — cached revisits keep the panel painted.
  if (isLoading) {
    return <PageLoadingSkeleton variant="generic" />;
  }

  if (isError) {
    return (
      <PageErrorState
        title="Could not load settings"
        description={getErrorMessage(error, "Please try again.")}
        onRetry={onRetry}
      />
    );
  }

  return children;
}
