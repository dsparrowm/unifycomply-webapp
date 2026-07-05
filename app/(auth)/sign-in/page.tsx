"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthButton, AuthDivider, GoogleSignInButton } from "@/components/auth/AuthButton";
import { AuthField, AuthPasswordField } from "@/components/auth/AuthField";
import { AuthSplitLayout } from "@/components/auth/AuthLayout";
import { useAuthStore } from "@/store/auth.store";

const signInSchema = z.object({
  email: z.string().email("Enter a valid work email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: SignInValues) => {
    signIn(values.email);
    router.push("/mfa");
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

          <div className="mt-10">
            <AuthButton
              type="submit"
              disabled={isSubmitting}
              className="bg-[color:var(--accent-primary-hover)] hover:bg-[color:var(--accent-primary)]"
            >
              Sign In
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
          <GoogleSignInButton onClick={() => router.push("/mfa")} />
        </div>
      </div>
    </AuthSplitLayout>
  );
}
