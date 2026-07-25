"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { useAuthHydrated } from "@/lib/hooks/use-auth-hydrated";
import { useAuthStore } from "@/store/auth.store";

export function AppAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const authStep = useAuthStore((state) => state.authStep);

  useEffect(() => {
    if (!hydrated) return;
    if (authStep !== "authenticated") {
      if (authStep === "pending_mfa") router.replace("/mfa");
      else if (authStep === "pending_email") router.replace("/verify-email");
      else if (authStep === "pending_tenant") router.replace("/tenant-selection");
      else router.replace("/sign-in");
    }
  }, [authStep, hydrated, router]);

  if (!hydrated || authStep !== "authenticated") {
    return <PageLoadingSkeleton variant="dashboard" />;
  }

  return children;
}
