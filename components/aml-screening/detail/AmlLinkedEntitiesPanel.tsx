import type { AmlLinkedEntity } from "@/types/aml-screening";

type AmlLinkedEntitiesPanelProps = {
  entities: AmlLinkedEntity[];
};

export function AmlLinkedEntitiesPanel({ entities }: AmlLinkedEntitiesPanelProps) {
  if (entities.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-[color:var(--text-muted)]">
        No linked entities were returned for this screening.
      </p>
    );
  }

  return (
    <div className="divide-y divide-[color:var(--border-subtle)]">
      {entities.map((entity) => (
        <div key={entity.id} className="py-4 first:pt-0 last:pb-0">
          <p className="text-sm text-[color:var(--text-muted)]">{entity.relationship}</p>
          <p className="mt-1 text-sm font-semibold text-[color:var(--text-primary)]">
            {entity.name}
          </p>
        </div>
      ))}
    </div>
  );
}
