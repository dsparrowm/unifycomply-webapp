import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";

export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg-base)] p-6">
      <div className="w-full max-w-md">
        <PageLoadingSkeleton variant="generic" />
      </div>
    </div>
  );
}
