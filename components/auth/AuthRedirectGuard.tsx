"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

const AUTH_ROUTES: Record<string, Array<ReturnType<typeof useAuthStore.getState>["authStep"]>> = {
  "/sign-in": ["signed_out"],
  "/register": ["signed_out"],
  "/forgot-password": ["signed_out"],
  "/reset-password": ["signed_out"],
  "/verify-email": ["pending_email"],
  "/mfa": ["pending_mfa"],
  "/tenant-selection": ["pending_tenant"],
};

export function AuthRedirectGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const authStep = useAuthStore((state) => state.authStep);

  useEffect(() => {
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
  }, [authStep, pathname, router]);

  if (authStep === "authenticated") {
    return null;
  }

  const allowedSteps = AUTH_ROUTES[pathname];
  if (allowedSteps && !allowedSteps.includes(authStep)) {
    return null;
  }

  return children;
}
