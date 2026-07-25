"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthSplitLayout } from "@/components/auth/AuthLayout";
import { getErrorMessage } from "@/lib/api/errors";
import { useAuthStore } from "@/store/auth.store";
import { useUiStore } from "@/store/ui.store";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const completeGoogleSignIn = useAuthStore((state) => state.completeGoogleSignIn);
  const setEnvironment = useUiStore((state) => state.setEnvironment);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const intent =
      searchParams.get("intent")?.trim() ||
      searchParams.get("token")?.trim() ||
      "";

    if (!intent) {
      setError("Google sign-in did not return a session intent. Try again from sign in.");
      return;
    }

    const run = async () => {
      try {
        const next = await completeGoogleSignIn(intent);
        setEnvironment(useAuthStore.getState().domain);
        if (next === "mfa") {
          router.replace("/mfa");
          return;
        }
        if (next === "tenant") {
          router.replace("/tenant-selection");
          return;
        }
        router.replace("/overview");
      } catch (err) {
        setError(getErrorMessage(err, "Google sign-in failed"));
      }
    };

    void run();
  }, [completeGoogleSignIn, router, searchParams, setEnvironment]);

  return (
    <div className="w-full max-w-[461px] space-y-4">
      <h1 className="text-3xl font-semibold text-[color:var(--text-primary)]">
        {error ? "Google sign-in failed" : "Signing you in…"}
      </h1>
      {error ? (
        <>
          <p className="text-sm text-[color:var(--state-error)]" role="alert">
            {error}
          </p>
          <Link
            href="/sign-in"
            className="inline-flex text-sm font-medium text-[color:var(--accent-primary-hover)] hover:underline"
          >
            Back to sign in
          </Link>
        </>
      ) : (
        <p className="text-sm text-[color:var(--text-muted)]">
          Finishing Google authentication. This only takes a moment.
        </p>
      )}
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <AuthSplitLayout>
      <Suspense
        fallback={
          <div className="w-full max-w-[461px]">
            <p className="text-sm text-[color:var(--text-muted)]">Loading…</p>
          </div>
        }
      >
        <GoogleCallbackContent />
      </Suspense>
    </AuthSplitLayout>
  );
}
