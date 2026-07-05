import type { ReactNode } from "react";
import { AuthRedirectGuard } from "@/components/auth/AuthRedirectGuard";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthRedirectGuard>{children}</AuthRedirectGuard>;
}
