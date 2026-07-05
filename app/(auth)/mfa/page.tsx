"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthSplitLayout } from "@/components/auth/AuthLayout";
import { mockTenants, useAuthStore } from "@/store/auth.store";

export default function MfaPage() {
  const router = useRouter();
  const completeMfa = useAuthStore((state) => state.completeMfa);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
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

  const handleSubmit = () => {
    completeMfa();
    router.push(mockTenants.length > 1 ? "/tenant-selection" : "/overview");
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
              maxLength={1}
              value={digit}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event.key)}
              className="h-12 w-12 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] text-center text-lg font-medium outline-none focus:border-[color:var(--accent-primary)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]"
            />
          ))}
        </div>

        <AuthButton type="button" disabled={!isComplete} onClick={handleSubmit}>
          Verify code
        </AuthButton>

        <p className="mt-8 text-center text-sm text-[color:var(--text-muted)]">
          Didn&apos;t receive a code?{" "}
          <button
            type="button"
            className="font-medium text-[color:var(--accent-primary-hover)] hover:underline"
          >
            Resend
          </button>
        </p>
      </div>
    </AuthSplitLayout>
  );
}
