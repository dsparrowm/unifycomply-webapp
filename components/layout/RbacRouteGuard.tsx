"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { useRbac } from "@/lib/hooks/use-rbac";

export function RbacRouteGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, canAccessPath, getDefaultSettingsPath } = useRbac();

  const allowed = Boolean(role) && canAccessPath(pathname);

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

  if (!allowed) {
    return (
      <PageLoadingSkeleton
        variant={pathname.startsWith("/settings") ? "settings" : "dashboard"}
      />
    );
  }

  return children;
}
