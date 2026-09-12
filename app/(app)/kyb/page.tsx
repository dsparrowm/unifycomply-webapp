import { KybListContainer } from "@/components/kyb/KybListContainer";

type KybPageProps = {
  searchParams: Promise<{ mode?: string }>;
};

export default async function KybPage({ searchParams }: KybPageProps) {
  const { mode } = await searchParams;

  return (
    <KybListContainer initialSearchMode={mode === "bulk" ? "bulk-search" : undefined} />
  );
}
