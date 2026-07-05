import type { ReactNode } from "react";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { AuthDotPattern } from "@/components/auth/AuthDotPattern";

type AuthSplitLayoutProps = {
  children: ReactNode;
};

export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      <div className="hidden min-h-screen bg-white p-6 lg:flex">
        <AuthBrandPanel />
      </div>
      <div className="flex min-h-screen items-center justify-start bg-white px-6 py-10 lg:px-[129px] lg:py-16">
        {children}
      </div>
    </div>
  );
}

type AuthCardLayoutProps = {
  children: ReactNode;
};

export function AuthCardLayout({ children }: AuthCardLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white px-6 py-10">
      <AuthDotPattern />
      <div className="relative z-10 w-full max-w-[461px]">{children}</div>
    </div>
  );
}
