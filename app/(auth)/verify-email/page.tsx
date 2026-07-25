"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Mail } from "lucide-react";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthCardLayout } from "@/components/auth/AuthLayout";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { completeEmailVerify, requestEmailVerify } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/api/errors";
import { useAuthStore } from "@/store/auth.store";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const emailFromLink = searchParams.get("email")?.trim() ?? "";
  const userEmail = useAuthStore((state) => state.user?.email);
  const verifyEmail = useAuthStore((state) => state.verifyEmail);

  const email = emailFromLink || userEmail || "";
  const [formError, setFormError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(Boolean(token));
  const [isResending, setIsResending] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const autoConfirmStarted = useRef(false);

  useEffect(() => {
    if (!token || !email || autoConfirmStarted.current) {
      if (token && !email) {
        setIsConfirming(false);
        setFormError("This verification link is missing an email. Open the link from your inbox, or request a new one.");
      }
      return;
    }

    autoConfirmStarted.current = true;
    let cancelled = false;

    const run = async () => {
      setFormError(null);
      setIsConfirming(true);
      try {
        await completeEmailVerify({ token, email });
        if (cancelled) return;
        verifyEmail();
        setConfirmed(true);
        setStatusMessage("Email verified. Redirecting you to sign in…");
        window.setTimeout(() => {
          router.push("/sign-in");
        }, 1500);
      } catch (error) {
        if (cancelled) return;
        setFormError(getErrorMessage(error, "Could not verify email"));
      } finally {
        if (!cancelled) setIsConfirming(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [email, router, token, verifyEmail]);

  const handleResend = async () => {
    if (!email) {
      setFormError("No email on file. Go back to register and try again.");
      return;
    }
    setFormError(null);
    setStatusMessage(null);
    setIsResending(true);
    try {
      await requestEmailVerify(email);
      setStatusMessage("Verification email sent. Check your inbox.");
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not resend verification email"));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-8 text-center shadow-sm">
      <div className="mb-8">
        <AuthBrandPanel compact />
      </div>

      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary)]">
        <Mail className="h-6 w-6" />
      </div>

      <h1 className="text-2xl font-semibold text-[color:var(--text-primary)]">
        {confirmed ? "Email verified" : "Check your inbox"}
      </h1>
      <p className="mt-2 text-sm text-[color:var(--text-muted)]">
        {token
          ? isConfirming
            ? "Confirming your email…"
            : confirmed
              ? "Your account is ready. Continue to sign in."
              : "We could not confirm this link. Request a new verification email below."
          : email
            ? `We sent a verification link to ${email}. Open it to activate your account.`
            : "We sent a verification link to your work email. Open it to activate your account."}
      </p>

      {statusMessage ? (
        <p className="mt-4 text-sm text-[color:var(--accent-primary-hover)]">{statusMessage}</p>
      ) : null}
      {formError ? (
        <p className="mt-4 text-sm text-[color:var(--state-error)]" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="mt-8 space-y-3">
        {!token && !confirmed ? (
          <>
            <AuthButton type="button" onClick={() => router.push("/sign-in")}>
              Continue to sign in
            </AuthButton>
            <button
              type="button"
              disabled={isResending || !email}
              onClick={() => void handleResend()}
              className="text-sm font-medium text-[color:var(--accent-primary-hover)] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isResending ? "Sending…" : "Resend verification email"}
            </button>
          </>
        ) : null}

        {token && !confirmed && !isConfirming ? (
          <button
            type="button"
            disabled={isResending || !email}
            onClick={() => void handleResend()}
            className="text-sm font-medium text-[color:var(--accent-primary-hover)] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isResending ? "Sending…" : "Resend verification email"}
          </button>
        ) : null}
      </div>

      <p className="mt-8 text-sm text-[color:var(--text-muted)]">
        <Link
          href="/sign-in"
          className="font-medium text-[color:var(--accent-primary-hover)] hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthCardLayout>
      <Suspense
        fallback={
          <div className="rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-8 text-center shadow-sm">
            <p className="text-sm text-[color:var(--text-muted)]">Loading…</p>
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </AuthCardLayout>
  );
}
