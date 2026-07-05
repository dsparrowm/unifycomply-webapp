import { Calendar, ChevronDown, Filter, Search } from "lucide-react";

const filters = ["Date", "Status", "Priorities", "Single entity"];

export function KycFilters() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3 py-2 text-sm text-[color:var(--text-muted)]"
          >
            {filter === "Date" ? <Calendar className="h-4 w-4" /> : null}
            {filter}
            <ChevronDown className="h-4 w-4" />
          </button>
        ))}

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border-default)] px-3 py-2 text-sm text-[color:var(--text-muted)]"
        >
          <Filter className="h-4 w-4" />
          More filters
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-[220px] items-center gap-2 rounded-lg border border-[color:var(--border-default)] px-3 py-2">
          <Search className="h-4 w-4 text-[color:var(--text-light)]" />
          <input
            type="search"
            placeholder="Search"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--text-light)]"
          />
        </div>

        <button
          type="button"
          className="rounded-lg bg-[color:var(--accent-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[color:var(--accent-primary-hover)]"
        >
          Export Report
        </button>
      </div>
    </div>
  );
}
