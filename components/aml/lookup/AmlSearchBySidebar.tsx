"use client";

import { AmlCheckbox } from "@/components/aml/lookup/AmlCheckbox";
import {
  amlAllDatabaseKeys,
  amlDatabaseOptions,
  amlRelevanceOptions,
  amlSearchEntityTypeOptions,
} from "@/lib/data/aml-create-case";
import type { AmlDatabaseKey, AmlRelevanceKey, AmlSearchEntityType } from "@/types/aml";

type AmlSearchBySidebarProps = {
  relevance: AmlRelevanceKey[];
  searchEntityTypes: AmlSearchEntityType[];
  databases: AmlDatabaseKey[];
  onRelevanceChange: (value: AmlRelevanceKey[]) => void;
  onSearchEntityTypesChange: (value: AmlSearchEntityType[]) => void;
  onDatabasesChange: (value: AmlDatabaseKey[]) => void;
};

function toggleValue<T extends string>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function AmlSearchBySidebar({
  relevance,
  searchEntityTypes,
  databases,
  onRelevanceChange,
  onSearchEntityTypesChange,
  onDatabasesChange,
}: AmlSearchBySidebarProps) {
  const allDatabasesSelected = amlAllDatabaseKeys.every((key) => databases.includes(key));

  return (
    <aside className="w-full shrink-0 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 lg:w-[280px]">
      <h2 className="text-base font-semibold text-[color:var(--text-primary)]">
        Search By <span className="text-[color:var(--state-error)]">*</span>
      </h2>

      <section className="mt-6 space-y-3">
        <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">Relevance</h3>
        <div className="grid grid-cols-2 gap-x-3 gap-y-3">
          {amlRelevanceOptions.map((option) => (
            <AmlCheckbox
              key={option.value}
              id={`aml-relevance-${option.value}`}
              label={option.label}
              checked={relevance.includes(option.value)}
              onChange={() => onRelevanceChange(toggleValue(relevance, option.value))}
            />
          ))}
        </div>
      </section>

      <section className="mt-7 space-y-3">
        <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">Entity Type</h3>
        <div className="space-y-3">
          {amlSearchEntityTypeOptions.map((option) => (
            <AmlCheckbox
              key={option.value}
              id={`aml-search-entity-${option.value}`}
              label={option.label}
              checked={searchEntityTypes.includes(option.value)}
              onChange={() =>
                onSearchEntityTypesChange(toggleValue(searchEntityTypes, option.value))
              }
            />
          ))}
        </div>
      </section>

      <section className="mt-7 space-y-3">
        <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">Database</h3>
        <div className="space-y-3">
          <AmlCheckbox
            id="aml-database-select-all"
            label="Select All"
            checked={allDatabasesSelected}
            onChange={(checked) => onDatabasesChange(checked ? [...amlAllDatabaseKeys] : [])}
          />
          {amlDatabaseOptions.map((option) => (
            <AmlCheckbox
              key={option.value}
              id={`aml-database-${option.value}`}
              label={option.label}
              checked={databases.includes(option.value)}
              onChange={(checked) => {
                if (checked) {
                  onDatabasesChange([...new Set([...databases, option.value])]);
                  return;
                }

                onDatabasesChange(databases.filter((item) => item !== option.value));
              }}
            />
          ))}
        </div>
      </section>
    </aside>
  );
}
