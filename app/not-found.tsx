import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[color:var(--bg-base)] px-4 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary)]">
        <FileQuestion className="h-7 w-7" />
      </span>
      <h1 className="mt-4 text-xl font-semibold text-[color:var(--text-primary)]">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-[color:var(--text-muted)]">
        The page you are looking for does not exist or you do not have access to it.
      </p>
      <Link
        href="/overview"
        className="mt-6 rounded-lg bg-[color:var(--accent-primary-hover)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
      >
        Go to overview
      </Link>
    </div>
  );
}
