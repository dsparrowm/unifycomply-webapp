"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthButton, AuthDivider, GoogleSignInButton } from "@/components/auth/AuthButton";
import { AuthField } from "@/components/auth/AuthField";
import { AuthCardLayout } from "@/components/auth/AuthLayout";
import { UnifycomplyLogo } from "@/components/brand/UnifycomplyLogo";
import { useAuthStore } from "@/store/auth.store";

const registerSchema = z.object({
  email: z.string().email("Enter a valid work email"),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const registerUser = useAuthStore((state) => state.register);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: RegisterValues) => {
    registerUser(values.email);
    router.push("/verify-email");
  };

  return (
    <AuthCardLayout>
      <div className="flex flex-col items-center gap-[30px]">
        <UnifycomplyLogo variant="dark" />

        <div className="flex w-full flex-col gap-6">
          <div className="w-full rounded-xl border border-[color:var(--border-subtle)] bg-white px-6 py-8 shadow-[0px_1px_1.5px_rgba(0,0,0,0.05)]">
            <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="whitespace-nowrap text-[30px] font-semibold leading-[38px] text-[color:var(--auth-heading)]">
                    Sign up with your work email
                  </h1>
                  <p className="text-base leading-6 text-[color:var(--auth-subtitle)]">
                    Use your work email to sign in to your team workspace
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  <GoogleSignInButton
                    label="Sign Up with Google"
                    onClick={() => router.push("/verify-email")}
                  />
                  <AuthDivider />
                </div>

                <AuthField
                  label="Work email"
                  type="email"
                  autoComplete="email"
                  placeholder="olivia@example.com"
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>

              <div className="flex flex-col gap-3">
                <AuthButton
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[color:var(--accent-primary-hover)] hover:bg-[color:var(--accent-primary)]"
                >
                  Sign Up
                </AuthButton>

                <p className="text-center text-xs leading-[18px] text-[color:var(--text-light)]">
                  By clicking get started you agree to our{" "}
                  <span className="underline text-[color:var(--auth-label)]">terms</span> and{" "}
                  <span className="underline text-[color:var(--auth-label)]">
                    privacy policies
                  </span>
                </p>
              </div>
            </form>
          </div>

          <div className="flex items-center justify-center gap-1 rounded-lg bg-[color:var(--bg-muted)] px-4 py-3">
            <p className="text-sm leading-5 text-[color:var(--auth-footer-text)]">
              Already have an account?
            </p>
            <Link
              href="/sign-in"
              className="text-sm font-semibold leading-5 text-[color:var(--accent-primary-hover)] hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </AuthCardLayout>
  );
}
