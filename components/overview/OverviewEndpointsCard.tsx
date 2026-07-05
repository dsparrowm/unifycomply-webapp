import { Code2 } from "lucide-react";
import type { OverviewEndpointUsage } from "@/types/overview";
import { OverviewSectionHeader } from "@/components/overview/OverviewSectionHeader";

type OverviewEndpointsCardProps = {
  endpoints: OverviewEndpointUsage[];
};

export function OverviewEndpointsCard({ endpoints }: OverviewEndpointsCardProps) {
  return (
    <section className="flex min-h-[394px] flex-col rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <OverviewSectionHeader
        icon={Code2}
        iconTone="neutral"
        title="Most Used Endpoint"
        action={
          <span className="text-xs font-medium text-[color:var(--text-light)]">Most Used</span>
        }
      />

      <div className="mt-2">
        <p className="text-sm font-medium text-[color:var(--text-primary)]">
          Your Most Used Endpoint
        </p>
        <p className="mt-1 text-xs text-[color:var(--text-muted)]">
          Here are some of your most used endpoint
        </p>
      </div>

      {endpoints.length > 0 ? (
        <div className="mt-8 space-y-6">
          {endpoints.map((endpoint) => (
            <div key={endpoint.id}>
              <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                <span className="text-[color:var(--text-primary)]">{endpoint.name}</span>
                <span className="shrink-0 text-[color:var(--text-muted)]">
                  {endpoint.calls} Calls · {endpoint.percentage}%
                </span>
              </div>
              <div className="h-5 overflow-hidden rounded-full bg-[color:var(--bg-muted)]">
                <div
                  className="h-full rounded-full bg-[color:var(--accent-primary-hover)]"
                  style={{ width: `${endpoint.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
