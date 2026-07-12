"use client";

import { usePathname } from "next/navigation";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";

export default function AppLoading() {
  const pathname = usePathname();
  const variant = pathname.startsWith("/settings") ? "settings" : "dashboard";

  return <PageLoadingSkeleton variant={variant} />;
}
