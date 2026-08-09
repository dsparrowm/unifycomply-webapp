"use client";

import {
  amlCreateCaseDatabaseOptions,
  amlCreateCaseRelevanceOptions,
  amlCreateCaseSearchEntityTypeOptions,
} from "@/lib/data/aml-create-case";

type AmlCreateCaseSearchByRailProps = {
  relevance: string[];
  entityTypes: string[];
  databases: string[];
  onRelevanceChange: (ids: string[]) => void;
  onEntityTypesChange: (ids: string[]) => void;
  onDatabasesChange: (ids: string[]) => void;
};

function toggleId(ids: string[], id: string) {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[color:var(--text-primary)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-[color:var(--border-default)] accent-[color:var(--accent-primary-hover)]"
      />
      {label}
    </label>
  );
}

export function AmlCreateCaseSearchByRail({
  relevance,
  entityTypes,
  databases,
  onRelevanceChange,
  onEntityTypesChange,
  onDatabasesChange,
}: AmlCreateCaseSearchByRailProps) {
  const allDatabaseIds = amlCreateCaseDatabaseOptions.map((option) => option.id);
  const allDatabasesSelected = allDatabaseIds.every((id) => databases.includes(id));

  return (
    <aside className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">
        Search By <span className="text-[color:var(--state-error)]">*</span>
      </h2>

      <div className="mt-5 space-y-6">
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
            Relevance
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5">
            {amlCreateCaseRelevanceOptions.map((option) => (
              <CheckboxRow
                key={option.id}
                label={option.label}
                checked={relevance.includes(option.id)}
                onChange={() => onRelevanceChange(toggleId(relevance, option.id))}
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
            Entity Type
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5">
            {amlCreateCaseSearchEntityTypeOptions.map((option) => (
              <CheckboxRow
                key={option.id}
                label={option.label}
                checked={entityTypes.includes(option.id)}
                onChange={() => onEntityTypesChange(toggleId(entityTypes, option.id))}
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
            Database
          </h3>
          <div className="mt-3 space-y-2.5">
            <CheckboxRow
              label="Select All"
              checked={allDatabasesSelected}
              onChange={() =>
                onDatabasesChange(allDatabasesSelected ? [] : [...allDatabaseIds])
              }
            />
            {amlCreateCaseDatabaseOptions.map((option) => (
              <CheckboxRow
                key={option.id}
                label={option.label}
                checked={databases.includes(option.id)}
                onChange={() => onDatabasesChange(toggleId(databases, option.id))}
              />
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
