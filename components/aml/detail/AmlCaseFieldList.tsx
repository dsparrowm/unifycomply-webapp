import { cn } from "@/lib/utils";
import type { AmlCaseField } from "@/types/aml";

type AmlCaseFieldListProps = {
  fields: AmlCaseField[];
};

export function AmlCaseFieldList({ fields }: AmlCaseFieldListProps) {
  return (
    <dl>
      {fields.map((field) => {
        const values = field.values ?? [field.value];

        return (
          <div
            key={field.label}
            className="border-b border-[color:var(--border-subtle)] py-4 last:border-b-0"
          >
            <dt className="text-sm text-[color:var(--text-muted)]">{field.label}</dt>
            <dd className="mt-1.5 space-y-1">
              {values.map((value) => (
                <p key={value} className="text-sm text-[color:var(--text-primary)]">
                  {field.tone === "warning" ? (
                    <span
                      className={cn(
                        "font-medium text-[color:var(--state-warning)]",
                        value.length <= 16 &&
                          "inline-flex rounded-md bg-[color:var(--state-warning-soft)] px-2 py-0.5 text-xs",
                      )}
                    >
                      {value}
                    </span>
                  ) : (
                    value
                  )}
                </p>
              ))}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
