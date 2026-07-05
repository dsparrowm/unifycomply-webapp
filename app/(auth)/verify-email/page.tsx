"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthCardLayout } from "@/components/auth/AuthLayout";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { useAuthStore } from "@/store/auth.store";

export default function VerifyEmailPage() {
  const router = useRouter();
  const verifyEmail = useAuthStore((state) => state.verifyEmail);

  return (
    <AuthCardLayout>
      <div className="rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-8 text-center shadow-sm">
        <div className="mb-8">
          <AuthBrandPanel compact />
        </div>

        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary)]">
          <Mail className="h-6 w-6" />
        </div>

        <h1 className="text-2xl font-semibold text-[color:var(--text-primary)]">
          Check your inbox
        </h1>
        <p className="mt-2 text-sm text-[color:var(--text-muted)]">
          We sent a verification link to your work email. Open it to activate your account.
        </p>

        <div className="mt-8 space-y-3">
          <AuthButton
            type="button"
            onClick={() => {
              verifyEmail();
              router.push("/mfa");
            }}
          >
            I&apos;ve verified my email
          </AuthButton>
          <button
            type="button"
            className="text-sm font-medium text-[color:var(--accent-primary-hover)] hover:underline"
          >
            Resend verification email
          </button>
        </div>

        <p className="mt-8 text-sm text-[color:var(--text-muted)]">
          <Link href="/sign-in" className="font-medium text-[color:var(--accent-primary-hover)] hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthCardLayout>
  );
}
