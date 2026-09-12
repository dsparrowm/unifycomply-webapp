import type { AmlCaseVerificationGroup } from "@/types/aml";

const sanctionMarks: Record<string, string> = {
  OFAC: "O",
  UN: "UN",
  EU: "EU",
  "UK HMT": "UK",
};

function NoMatchBadge() {
  return (
    <span className="shrink-0 rounded-full bg-[color:var(--state-success-soft)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--state-success)]">
      No Match
    </span>
  );
}

type AmlCaseVerificationsProps = {
  groups: AmlCaseVerificationGroup[];
};

export function AmlCaseVerifications({ groups }: AmlCaseVerificationsProps) {
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.title}>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
            {group.title}
          </h3>
          <div className="mt-3 divide-y divide-[color:var(--border-subtle)] rounded-xl bg-[color:var(--bg-muted)] px-5">
            {group.items.map((item) => {
              const mark = sanctionMarks[item.title];

              return (
                <div key={item.title} className="flex items-start justify-between gap-4 py-3">
                  <div className="flex items-start gap-3">
                    {mark ? (
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-primary-hover)] text-[10px] font-semibold text-white">
                        {mark}
                      </span>
                    ) : null}
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                        {item.title}
                      </p>
                      {item.description && !mark ? (
                        <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <NoMatchBadge />
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
