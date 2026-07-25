import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";

/**
 * Shown while a top-level (app) segment streams in.
 * Prefer nested `settings/loading.tsx` for settings soft-nav so the settings
 * chrome (header + nav) is not replaced by this full-panel skeleton.
 */
export default function AppLoading() {
  return <PageLoadingSkeleton variant="dashboard" />;
}
