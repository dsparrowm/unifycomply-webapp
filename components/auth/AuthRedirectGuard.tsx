"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { useAuthHydrated } from "@/lib/hooks/use-auth-hydrated";
import { useAuthStore } from "@/store/auth.store";

const AUTH_ROUTES: Record<string, Array<ReturnType<typeof useAuthStore.getState>["authStep"]>> = {
  "/sign-in": ["signed_out"],
  "/register": ["signed_out"],
  "/forgot-password": ["signed_out"],
  "/reset-password": ["signed_out"],
  "/verify-email": ["pending_email", "signed_out"],
  "/auth/google/callback": ["signed_out", "pending_mfa", "pending_tenant"],
  "/mfa": ["pending_mfa"],
  "/tenant-selection": ["pending_tenant"],
};

export function AuthRedirectGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useAuthHydrated();
  const authStep = useAuthStore((state) => state.authStep);

  useEffect(() => {
    if (!hydrated) return;

    if (authStep === "authenticated") {
      router.replace("/overview");
      return;
    }

    const allowedSteps = AUTH_ROUTES[pathname];
    if (allowedSteps && !allowedSteps.includes(authStep)) {
      if (authStep === "pending_mfa") router.replace("/mfa");
      else if (authStep === "pending_email") router.replace("/verify-email");
      else if (authStep === "pending_tenant") router.replace("/tenant-selection");
      else router.replace("/sign-in");
    }
  }, [authStep, hydrated, pathname, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg-base)] p-6">
        <div className="w-full max-w-md">
          <PageLoadingSkeleton variant="generic" />
        </div>
      </div>
    );
  }

  if (authStep === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg-base)] p-6">
        <div className="w-full max-w-md">
          <PageLoadingSkeleton variant="generic" />
        </div>
      </div>
    );
  }

  const allowedSteps = AUTH_ROUTES[pathname];
  if (allowedSteps && !allowedSteps.includes(authStep)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg-base)] p-6">
        <div className="w-full max-w-md">
          <PageLoadingSkeleton variant="generic" />
        </div>
      </div>
    );
  }

  return children;
}
