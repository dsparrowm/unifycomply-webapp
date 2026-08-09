import type { AmlSearchInformation } from "@/types/aml-screening";

type AmlSearchInformationRailProps = {
  information: AmlSearchInformation;
};

export function AmlSearchInformationRail({ information }: AmlSearchInformationRailProps) {
  return (
    <aside className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
        Search Information
      </h2>

      <div className="relative mt-5 overflow-hidden rounded-lg bg-[color:var(--bg-muted)]">
        <div className="flex h-44 items-center justify-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--accent-primary-soft)] text-2xl font-semibold text-[color:var(--accent-primary-hover)]">
            {information.avatarInitials}
          </span>
        </div>
        <span
          className={
            information.matchSuccessful
              ? "absolute right-3 top-3 rounded-md bg-[color:var(--accent-primary-hover)] px-2.5 py-1 text-xs font-medium text-white"
              : "absolute right-3 top-3 rounded-md bg-[color:var(--state-success)] px-2.5 py-1 text-xs font-medium text-white"
          }
        >
          {information.matchSuccessful ? "Match Successful" : "Clear"}
        </span>
      </div>

      <dl className="mt-5 space-y-4">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
            Search Item
          </dt>
          <dd className="mt-1 text-sm font-medium text-[color:var(--text-primary)]">
            {information.searchItem}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
            Entity Type
          </dt>
          <dd className="mt-1 text-sm font-medium text-[color:var(--text-primary)]">
            {information.entityTypeLabel}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
            Match Score
          </dt>
          <dd className="mt-1 text-sm font-medium text-[color:var(--accent-primary-hover)]">
            {information.matchScore}%
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
            Databases
          </dt>
          <dd className="mt-2 space-y-1.5">
            {information.databases.map((database) => (
              <p key={database} className="text-sm text-[color:var(--text-primary)]">
                {database}
              </p>
            ))}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
            Country
          </dt>
          <dd className="mt-1 text-sm font-medium text-[color:var(--text-primary)]">
            {information.country}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
            Risk Engine
          </dt>
          <dd className="mt-1 text-sm font-medium text-[color:var(--text-primary)]">
            {information.riskEngine}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
