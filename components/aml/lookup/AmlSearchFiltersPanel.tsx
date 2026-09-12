"use client";

import { AmlCheckbox } from "@/components/aml/lookup/AmlCheckbox";
import {
  amlDatabaseOptions,
  amlRelevanceOptions,
  amlSearchEntityTypeOptions,
} from "@/lib/data/aml-create-case";
import type { AmlDatabaseKey, AmlRelevanceKey, AmlSearchEntityType } from "@/types/aml";

export type AmlSearchResultFilters = {
  relevance: AmlRelevanceKey[];
  entityTypes: AmlSearchEntityType[];
  databases: AmlDatabaseKey[];
};

type AmlSearchFiltersPanelProps = {
  draft: AmlSearchResultFilters;
  onDraftChange: (draft: AmlSearchResultFilters) => void;
  onClear: () => void;
  onApply: () => void;
};

function toggleValue<T extends string>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function AmlSearchFiltersPanel({
  draft,
  onDraftChange,
  onClear,
  onApply,
}: AmlSearchFiltersPanelProps) {
  const allDatabasesSelected = amlDatabaseOptions.every((option) =>
    draft.databases.includes(option.value),
  );

  return (
    <div className="flex flex-col gap-6 p-5">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">Relevance</h3>
        <div className="grid grid-cols-2 gap-3">
          {amlRelevanceOptions.map((option) => (
            <AmlCheckbox
              key={option.value}
              id={`aml-result-relevance-${option.value}`}
              label={option.label}
              checked={draft.relevance.includes(option.value)}
              onChange={() =>
                onDraftChange({
                  ...draft,
                  relevance: toggleValue(draft.relevance, option.value),
                })
              }
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">Entity Type</h3>
        <div className="space-y-3">
          {amlSearchEntityTypeOptions.map((option) => (
            <AmlCheckbox
              key={option.value}
              id={`aml-result-entity-${option.value}`}
              label={option.label}
              checked={draft.entityTypes.includes(option.value)}
              onChange={() =>
                onDraftChange({
                  ...draft,
                  entityTypes: toggleValue(draft.entityTypes, option.value),
                })
              }
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">Database</h3>
        <div className="space-y-3">
          <AmlCheckbox
            id="aml-result-database-all"
            label="Select All"
            checked={allDatabasesSelected}
            onChange={(checked) =>
              onDraftChange({
                ...draft,
                databases: checked ? amlDatabaseOptions.map((option) => option.value) : [],
              })
            }
          />
          {amlDatabaseOptions.map((option) => (
            <AmlCheckbox
              key={option.value}
              id={`aml-result-database-${option.value}`}
              label={option.label}
              checked={draft.databases.includes(option.value)}
              onChange={(checked) =>
                onDraftChange({
                  ...draft,
                  databases: checked
                    ? [...new Set([...draft.databases, option.value])]
                    : draft.databases.filter((item) => item !== option.value),
                })
              }
            />
          ))}
        </div>
      </section>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClear}
          className="h-10 min-w-[88px] rounded-lg bg-[color:var(--border-subtle)] px-4 text-sm font-medium text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--border-default)]"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onApply}
          className="h-10 min-w-[88px] rounded-lg bg-[color:var(--accent-primary)] px-4 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary-hover)]"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
