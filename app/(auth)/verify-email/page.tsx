"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";
import { Mail } from "lucide-react";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthCardLayout } from "@/components/auth/AuthLayout";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { completeEmailVerify, requestEmailVerify } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/api/errors";
import { useAuthStore } from "@/store/auth.store";

const EMAIL_OTP_LENGTH = 4;
const inFlightVerifyKeys = new Set<string>();
const completedVerifyKeys = new Set<string>();

function verifyKey(email: string, token: string) {
  return `${email.toLowerCase()}:${token}`;
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromLink = searchParams.get("token")?.trim() ?? "";
  const emailFromLink = searchParams.get("email")?.trim() ?? "";
  const userEmail = useAuthStore((state) => state.user?.email);
  const verifyEmail = useAuthStore((state) => state.verifyEmail);

  const email = emailFromLink || userEmail || "";
  const [digits, setDigits] = useState(Array.from({ length: EMAIL_OTP_LENGTH }, () => ""));
  const [formError, setFormError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(Boolean(tokenFromLink));
  const [isResending, setIsResending] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const otp = digits.join("");
  const otpComplete = otp.length === EMAIL_OTP_LENGTH;
  const autoConfirming = Boolean(tokenFromLink) && isConfirming && !confirmed && !formError;

  const markVerified = (redirect: boolean) => {
    verifyEmail();
    setConfirmed(true);
    setIsConfirming(false);
    setStatusMessage("Email verified. You can continue to sign in.");
    if (redirect) {
      window.setTimeout(() => {
        router.push("/sign-in");
      }, 1200);
    }
  };

  const confirmToken = async (token: string, redirect: boolean) => {
    if (!token || !email) {
      setIsConfirming(false);
      if (token && !email) {
        setFormError(
          "This verification request is missing an email. Open the message from your inbox, or go back to register.",
        );
      }
      return;
    }

    const key = verifyKey(email, token);
    if (completedVerifyKeys.has(key)) {
      markVerified(false);
      return;
    }
    if (inFlightVerifyKeys.has(key)) {
      return;
    }

    inFlightVerifyKeys.add(key);
    setFormError(null);
    setIsConfirming(true);

    try {
      await completeEmailVerify({ token, email });
      completedVerifyKeys.add(key);
      markVerified(redirect);
    } catch (error) {
      inFlightVerifyKeys.delete(key);
      setFormError(getErrorMessage(error, "Could not verify email"));
      setIsConfirming(false);
    }
  };

  useEffect(() => {
    if (!tokenFromLink) {
      setIsConfirming(false);
      return;
    }
    void confirmToken(tokenFromLink, true);
    // Link tokens auto-submit once; confirmToken guards duplicate requests.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- inbound link token only
  }, [tokenFromLink, email]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < EMAIL_OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, EMAIL_OTP_LENGTH);
    if (!pasted) return;
    const next = Array.from({ length: EMAIL_OTP_LENGTH }, (_, i) => pasted[i] ?? "");
    setDigits(next);
    const focusIndex = Math.min(pasted.length, EMAIL_OTP_LENGTH - 1);
    inputsRef.current[focusIndex]?.focus();
  };

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
      setStatusMessage("Verification code sent. Check your inbox.");
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
        {autoConfirming
          ? "Confirming your email…"
          : confirmed
            ? "Your account is ready. Continue to sign in."
            : email
              ? `We sent a ${EMAIL_OTP_LENGTH}-digit verification code to ${email}. Enter it below to activate your account.`
              : `We sent a ${EMAIL_OTP_LENGTH}-digit verification code to your work email. Enter it below to activate your account.`}
      </p>

      {!confirmed && !autoConfirming ? (
        <div className="mt-6 flex justify-center gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputsRef.current[index] = element;
              }}
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              aria-label={`Digit ${index + 1} of verification code`}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event: KeyboardEvent<HTMLInputElement>) =>
                handleKeyDown(index, event.key)
              }
              onPaste={handlePaste}
              className="h-12 w-12 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] text-center text-lg font-medium outline-none focus:border-[color:var(--accent-primary)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]"
            />
          ))}
        </div>
      ) : null}

      {statusMessage ? (
        <p className="mt-4 text-sm text-[color:var(--accent-primary-hover)]">{statusMessage}</p>
      ) : null}
      {formError ? (
        <p className="mt-4 text-sm text-[color:var(--state-error)]" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="mt-8 space-y-3">
        {!confirmed && !autoConfirming ? (
          <>
            <AuthButton
              type="button"
              disabled={!otpComplete || isConfirming || !email}
              onClick={() => void confirmToken(otp, true)}
            >
              {isConfirming ? "Confirming…" : "Verify email"}
            </AuthButton>
            <button
              type="button"
              disabled={isResending || !email}
              onClick={() => void handleResend()}
              className="text-sm font-medium text-[color:var(--accent-primary-hover)] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isResending ? "Sending…" : "Resend verification code"}
            </button>
          </>
        ) : null}

        {confirmed ? (
          <AuthButton type="button" onClick={() => router.push("/sign-in")}>
            Continue to sign in
          </AuthButton>
        ) : null}
      </div>

      {confirmed ? (
        <p className="mt-8 text-sm text-[color:var(--text-muted)]">
          <Link
            href="/sign-in"
            className="font-medium text-[color:var(--accent-primary-hover)] hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      ) : null}
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
