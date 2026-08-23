"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function HomePage() {
  const router = useRouter();
  const authStep = useAuthStore((state) => state.authStep);

  useEffect(() => {
    if (authStep === "authenticated") {
      router.replace("/overview");
      return;
    }
    if (authStep === "pending_mfa") {
      router.replace("/mfa");
      return;
    }
    if (authStep === "pending_email") {
      router.replace("/verify-email");
      return;
    }
    if (authStep === "pending_tenant") {
      router.replace("/tenant-selection");
      return;
    }
    router.replace("/sign-in");
  }, [authStep, router]);

  return null;
}
