"use client";

import { useRef, useState } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthSplitLayout } from "@/components/auth/AuthLayout";
import { getErrorMessage } from "@/lib/api/errors";
import { useAuthStore } from "@/store/auth.store";
import { useUiStore } from "@/store/ui.store";

export default function MfaPage() {
  const router = useRouter();
  const completeMfa = useAuthStore((state) => state.completeMfa);
  const setEnvironment = useUiStore((state) => state.setEnvironment);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const code = digits.join("");
  const isComplete = code.length === 6;

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 5) {
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
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = Array.from({ length: 6 }, (_, i) => pasted[i] ?? "");
    setDigits(next);
    const focusIndex = Math.min(pasted.length, 5);
    inputsRef.current[focusIndex]?.focus();
  };

  const handleSubmit = async () => {
    setFormError(null);
    setIsSubmitting(true);
    try {
      const next = await completeMfa(code);
      const domain = useAuthStore.getState().domain;
      setEnvironment(domain);
      router.push(next === "tenant" ? "/tenant-selection" : "/overview");
    } catch (error) {
      setFormError(getErrorMessage(error, "Invalid verification code"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthSplitLayout>
      <div className="w-full max-w-[461px]">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-semibold text-[color:var(--text-primary)]">
            Verify your identity
          </h1>
          <p className="text-sm text-[color:var(--text-muted)]">
            Enter the 6-digit code from your authenticator app.
          </p>
        </div>

        <div className="mb-6 flex justify-between gap-2">
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
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event: KeyboardEvent<HTMLInputElement>) =>
                handleKeyDown(index, event.key)
              }
              onPaste={handlePaste}
              className="h-12 w-12 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] text-center text-lg font-medium outline-none focus:border-[color:var(--accent-primary)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]"
            />
          ))}
        </div>

        {formError ? (
          <p className="mb-4 text-sm text-[color:var(--state-error)]" role="alert">
            {formError}
          </p>
        ) : null}

        <AuthButton type="button" disabled={!isComplete || isSubmitting} onClick={handleSubmit}>
          {isSubmitting ? "Verifying…" : "Verify code"}
        </AuthButton>

        <p className="mt-8 text-center text-sm text-[color:var(--text-muted)]">
          Open your authenticator app to view the current code.
        </p>
      </div>
    </AuthSplitLayout>
  );
}
