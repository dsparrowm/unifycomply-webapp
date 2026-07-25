import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";

/** Content-only — settings layout (header + nav) stays mounted during soft nav. */
export default function SettingsLoading() {
  return <PageLoadingSkeleton variant="generic" />;
}
