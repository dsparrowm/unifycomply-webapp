import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function AuthButton({
  children,
  className,
  variant = "primary",
  ...props
}: AuthButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex w-full items-center justify-center rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "h-11 bg-[color:var(--accent-primary)] text-sm font-semibold text-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[color:var(--accent-primary-hover)]",
        variant === "secondary" &&
          "h-auto border-[1.5px] border-[color:var(--auth-input-border)] bg-white px-4 py-3.5 text-base font-semibold text-[color:var(--auth-label)] hover:bg-[color:var(--bg-muted)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function AuthDivider({ label = "Or" }: { label?: string }) {
  return (
    <div className="relative h-7 w-full">
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[color:var(--border-subtle)]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
        <span className="text-sm leading-[1.45] text-[color:var(--text-light)]">{label}</span>
      </div>
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function GoogleSignInButton({
  onClick,
  label = "Sign In with Google",
}: {
  onClick?: () => void;
  label?: string;
}) {
  return (
    <AuthButton variant="secondary" onClick={onClick}>
      <span className="inline-flex items-center gap-4">
        <GoogleLogo />
        {label}
      </span>
    </AuthButton>
  );
}
