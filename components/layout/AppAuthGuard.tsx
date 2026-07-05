"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export function AppAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const authStep = useAuthStore((state) => state.authStep);

  useEffect(() => {
    if (authStep !== "authenticated") {
      if (authStep === "pending_mfa") router.replace("/mfa");
      else if (authStep === "pending_email") router.replace("/verify-email");
      else if (authStep === "pending_tenant") router.replace("/tenant-selection");
      else router.replace("/sign-in");
    }
  }, [authStep, router]);

  if (authStep !== "authenticated") {
    return null;
  }

  return children;
}
