"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useRbac } from "@/lib/hooks/use-rbac";

export function RbacRouteGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, canAccessPath, getDefaultSettingsPath } = useRbac();

  useEffect(() => {
    if (!role) {
      router.replace("/tenant-selection");
      return;
    }

    if (canAccessPath(pathname)) {
      return;
    }

    if (pathname.startsWith("/settings")) {
      const fallbackPath = getDefaultSettingsPath();
      router.replace(fallbackPath ?? "/overview");
      return;
    }

    router.replace("/overview");
  }, [canAccessPath, getDefaultSettingsPath, pathname, role, router]);

  if (!role) {
    return null;
  }

  if (!canAccessPath(pathname)) {
    return null;
  }

  return children;
}
