"use client";

import { useEffect } from "react";
import { PageErrorState } from "@/components/feedback/PageErrorState";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: AppErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <PageErrorState onRetry={reset} />;
}
