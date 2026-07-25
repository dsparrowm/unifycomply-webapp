import { Building2, Landmark, UserRound } from "lucide-react";
import { BankAnalysisDateRangeMenu } from "@/components/bank-analysis/detail/BankAnalysisDateRangeMenu";
import { cn } from "@/lib/utils";
import type { BankAnalysisNetworkGraph } from "@/types/bank-analysis";

type BankAnalysisNetworkPanelProps = {
  graph: BankAnalysisNetworkGraph;
};

export function BankAnalysisNetworkPanel({
  graph,
}: BankAnalysisNetworkPanelProps) {
  const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));

  return (
    <section className="overflow-hidden rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)]">
      <div className="flex flex-col gap-4 border-b border-[color:var(--border-default)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          Network Intelligence
        </h2>
        <BankAnalysisDateRangeMenu />
      </div>

      <div className="p-4 sm:p-6">
        <div className="relative aspect-[4/5] min-h-[520px] overflow-hidden rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)]">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {graph.edges.map((edge) => {
              const from = nodeById.get(edge.from);
              const to = nodeById.get(edge.to);

              if (!from || !to) {
                return null;
              }

              return (
                <line
                  key={`${edge.from}-${edge.to}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  className={
                    edge.dashed
                      ? "stroke-[color:var(--network-secondary)]"
                      : "stroke-[color:var(--border-default)]"
                  }
                  strokeWidth="1"
                  strokeDasharray={edge.dashed ? "3 3" : undefined}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          <div role="list" aria-label="Customer account relationship network">
            {graph.nodes.map((node) => (
              <div
                key={node.id}
                role="listitem"
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div
                  className={cn(
                    "flex h-14 w-14 flex-col items-center justify-center rounded-full border-2 border-[color:var(--bg-surface)] px-1 text-center text-white shadow-sm sm:h-[72px] sm:w-[72px]",
                    node.kind === "business"
                      ? "bg-[color:var(--network-secondary)]"
                      : "bg-[color:var(--accent-primary-hover)]",
                    node.kind === "customer"
                      ? "sm:h-24 sm:w-24"
                      : "sm:h-[88px] sm:w-[88px]",
                  )}
                >
                  {node.kind === "customer" ? (
                    <UserRound className="mb-1 h-4 w-4" aria-hidden="true" />
                  ) : node.kind === "business" ? (
                    <Building2 className="mb-1 h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Landmark className="mb-1 h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="max-w-full truncate text-[8px] leading-tight font-medium">
                    {node.label}
                  </span>
                  {node.subtitle ? (
                    <span className="max-w-full truncate text-[7px] leading-tight opacity-90">
                      {node.subtitle}
                    </span>
                  ) : null}
                </div>
                {node.kind === "customer" ? (
                  <p className="mt-2 text-center text-[9px] font-medium text-[color:var(--state-success)]">
                    Low risk
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <div className="h-72 xl:h-80" aria-hidden="true" />
      </div>
    </section>
  );
}
