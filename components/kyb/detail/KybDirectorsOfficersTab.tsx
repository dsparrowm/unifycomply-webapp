import { KybDetailSectionHeader } from "@/components/kyb/detail/KybDetailSectionHeader";
import { KybDirectorCard } from "@/components/kyb/detail/KybDirectorCard";
import type { KybDirectorsData } from "@/types/kyb";

type KybDirectorsOfficersTabProps = {
  directors: KybDirectorsData;
};

export function KybDirectorsOfficersTab({ directors }: KybDirectorsOfficersTabProps) {
  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
      <KybDetailSectionHeader
        title="Directors and Key Officers"
        status={directors.sectionStatus}
      />

      <div className="space-y-6 p-6">
        {directors.directors.map((director) => (
          <KybDirectorCard key={director.id} director={director} />
        ))}
      </div>
    </div>
  );
}
