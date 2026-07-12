import type { ReactNode } from "react";
import { AppAuthGuard } from "@/components/layout/AppAuthGuard";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { RbacRouteGuard } from "@/components/layout/RbacRouteGuard";
import { SandboxBanner } from "@/components/layout/SandboxBanner";
import { WalletTopUpModals } from "@/components/layout/WalletTopUpModals";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppAuthGuard>
      <RbacRouteGuard>
        <div className="flex min-h-screen bg-[color:var(--bg-surface)]">
          <AppSidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <SandboxBanner />
          <AppHeader />
          <main className="flex-1 overflow-auto bg-[color:var(--bg-base)] p-4 sm:p-6">{children}</main>
        </div>
        <MobileSidebar />
        </div>
        <WalletTopUpModals />
      </RbacRouteGuard>
    </AppAuthGuard>
  );
}
