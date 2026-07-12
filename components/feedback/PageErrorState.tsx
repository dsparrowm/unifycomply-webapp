import { AlertTriangle } from "lucide-react";
import Link from "next/link";

type PageErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  showHomeLink?: boolean;
};

export function PageErrorState({
  title = "Something went wrong",
  description = "We could not load this page. Try again or return to the overview.",
  onRetry,
  showHomeLink = true,
}: PageErrorStateProps) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center px-4 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]">
        <AlertTriangle className="h-7 w-7" />
      </span>
      <h1 className="mt-4 text-xl font-semibold text-[color:var(--text-primary)]">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-[color:var(--text-muted)]">{description}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-[color:var(--accent-primary-hover)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
          >
            Try again
          </button>
        ) : null}
        {showHomeLink ? (
          <Link
            href="/overview"
            className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-4 py-2.5 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)]"
          >
            Go to overview
          </Link>
        ) : null}
      </div>
    </div>
  );
}
