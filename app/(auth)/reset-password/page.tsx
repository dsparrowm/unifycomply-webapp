"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthField } from "@/components/auth/AuthField";
import { AuthSplitLayout } from "@/components/auth/AuthLayout";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = () => {
    router.push("/sign-in");
  };

  return (
    <AuthSplitLayout>
      <div className="w-full max-w-[461px]">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-semibold text-[color:var(--text-primary)]">
            Create a new password
          </h1>
          <p className="text-sm text-[color:var(--text-muted)]">
            Choose a strong password you haven&apos;t used before on this account.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <AuthField
            label="New password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter new password"
            error={errors.password?.message}
            {...register("password")}
          />
          <AuthField
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter new password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <AuthButton type="submit" disabled={isSubmitting}>
            Update password
          </AuthButton>
        </form>

        <p className="mt-8 text-center text-sm text-[color:var(--text-muted)]">
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
