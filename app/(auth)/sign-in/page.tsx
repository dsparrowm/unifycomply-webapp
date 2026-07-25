"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthButton, AuthDivider, GoogleSignInButton } from "@/components/auth/AuthButton";
import { AuthField, AuthPasswordField } from "@/components/auth/AuthField";
import { AuthSplitLayout } from "@/components/auth/AuthLayout";
import { getErrorMessage } from "@/lib/api/errors";
import { useAuthStore } from "@/store/auth.store";
import { useUiStore } from "@/store/ui.store";

const signInSchema = z.object({
  email: z.string().email("Enter a valid work email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const signInWithPassword = useAuthStore((state) => state.signInWithPassword);
  const setEnvironment = useUiStore((state) => state.setEnvironment);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: SignInValues) => {
    setFormError(null);
    try {
      const next = await signInWithPassword(values.email, values.password);
      setEnvironment(useAuthStore.getState().domain);
      if (next === "mfa") {
        router.push("/mfa");
        return;
      }
      if (next === "tenant") {
        router.push("/tenant-selection");
        return;
      }
      router.push("/overview");
    } catch (error) {
      setFormError(getErrorMessage(error, "Sign in failed"));
    }
  };

  return (
    <AuthSplitLayout>
      <div className="w-full max-w-[461px]">
        <div className="flex flex-col gap-1">
          <h1 className="text-[40px] font-semibold leading-[60px] tracking-[-0.02em] text-[color:var(--auth-heading)]">
            Welcome Back!
          </h1>
          <div className="flex flex-wrap items-center gap-1">
            <p className="text-base leading-6 text-[color:var(--auth-subtitle)]">
              Don&apos;t have an account?
            </p>
            <Link
              href="/register"
              className="text-base font-semibold leading-6 text-[color:var(--accent-primary-hover)] hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <form className="mt-[35px]" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <AuthField
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="olivia@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <AuthPasswordField
              placeholder="Password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          {formError ? (
            <p className="mt-4 text-sm text-[color:var(--state-error)]" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="mt-10">
            <AuthButton
              type="submit"
              disabled={isSubmitting}
              className="bg-[color:var(--accent-primary-hover)] hover:bg-[color:var(--accent-primary)]"
            >
              {isSubmitting ? "Signing in…" : "Sign In"}
            </AuthButton>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-center gap-1">
          <p className="text-sm leading-5 text-[color:var(--auth-subtitle)]">Forgot Password?</p>
          <Link
            href="/forgot-password"
            className="text-sm font-semibold leading-5 text-[color:var(--accent-primary-hover)] hover:underline"
          >
            Recover
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-6">
          <AuthDivider />
          <GoogleSignInButton
            onClick={() => {
              window.location.href = "/api/auth/google";
            }}
          />
        </div>
      </div>
    </AuthSplitLayout>
  );
}
