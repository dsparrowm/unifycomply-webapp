"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthField } from "@/components/auth/AuthField";
import { AuthSplitLayout } from "@/components/auth/AuthLayout";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid work email"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = () => {
    router.push("/reset-password");
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

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <AuthField
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <AuthButton type="submit" disabled={isSubmitting}>
            Send reset link
          </AuthButton>
        </form>

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
