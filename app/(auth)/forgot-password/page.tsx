"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthField } from "@/components/auth/AuthField";
import { AuthSplitLayout } from "@/components/auth/AuthLayout";
import { requestForgotPassword } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/api/errors";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid work email"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setFormError(null);
    try {
      await requestForgotPassword(values.email);
      setSuccess(true);
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not send reset link"));
    }
  };

  return (
    <AuthSplitLayout>
      <div className="w-full max-w-[461px]">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-semibold text-[color:var(--text-primary)]">
            Reset your password
          </h1>
          <p className="text-sm text-[color:var(--text-muted)]">
            Enter the email associated with your account and we&apos;ll send reset instructions.
          </p>
        </div>

        {success ? (
          <p className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] p-4 text-sm text-[color:var(--text-primary)]">
            If an account exists for that email, reset instructions have been sent.
          </p>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <AuthField
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              error={errors.email?.message}
              {...register("email")}
            />
            {formError ? (
              <p className="text-sm text-[color:var(--state-error)]" role="alert">
                {formError}
              </p>
            ) : null}
            <AuthButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send reset link"}
            </AuthButton>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-[color:var(--text-muted)]">
          Remember your password?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-[color:var(--accent-primary-hover)] hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}
