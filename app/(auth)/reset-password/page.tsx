"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthField, AuthPasswordField } from "@/components/auth/AuthField";
import { AuthSplitLayout } from "@/components/auth/AuthLayout";
import { completeForgotPassword } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/api/errors";

const resetPasswordSchema = z
  .object({
    email: z.string().email("Enter a valid work email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const emailFromLink = searchParams.get("email")?.trim() ?? "";
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const hasToken = Boolean(token);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromLink,
      password: "",
      confirmPassword: "",
    },
  });

  const missingTokenMessage = useMemo(
    () =>
      "This reset link is missing a token. Open the link from your email, or request a new reset.",
    [],
  );

  const onSubmit = async (values: ResetPasswordValues) => {
    setFormError(null);
    if (!token) {
      setFormError(missingTokenMessage);
      return;
    }

    try {
      await completeForgotPassword({
        token,
        email: values.email,
        password: values.password,
      });
      setSuccess(true);
      window.setTimeout(() => {
        router.push("/sign-in");
      }, 1500);
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not update password"));
    }
  };

  return (
    <div className="w-full max-w-[461px]">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold text-[color:var(--text-primary)]">
          Create a new password
        </h1>
        <p className="text-sm text-[color:var(--text-muted)]">
          Choose a strong password you haven&apos;t used before on this account.
        </p>
      </div>

      {!hasToken ? (
        <div className="space-y-5">
          <p className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] p-4 text-sm text-[color:var(--text-primary)]">
            {missingTokenMessage}
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex text-sm font-medium text-[color:var(--accent-primary-hover)] hover:underline"
          >
            Request a new reset link
          </Link>
        </div>
      ) : success ? (
        <p className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] p-4 text-sm text-[color:var(--text-primary)]">
          Password updated. Redirecting you to sign in…
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
          <AuthPasswordField
            label="New password"
            autoComplete="new-password"
            placeholder="Enter new password"
            error={errors.password?.message}
            {...register("password")}
          />
          <AuthPasswordField
            label="Confirm password"
            autoComplete="new-password"
            placeholder="Re-enter new password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          {formError ? (
            <p className="text-sm text-[color:var(--state-error)]" role="alert">
              {formError}
            </p>
          ) : null}
          <AuthButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating…" : "Update password"}
          </AuthButton>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-[color:var(--text-muted)]">
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

export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout>
      <Suspense
        fallback={
          <div className="w-full max-w-[461px]">
            <p className="text-sm text-[color:var(--text-muted)]">Loading…</p>
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
