import { Building2 } from "lucide-react";

type KybTotalBusinessCardProps = {
  total: number;
};

export function KybTotalBusinessCard({ total }: KybTotalBusinessCardProps) {
  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--bg-muted)] text-[color:var(--text-muted)]">
          <Building2 className="h-5 w-5" aria-hidden />
        </div>
        <p className="text-sm text-[color:var(--text-muted)]">Total Business</p>
      </div>
      <p className="mt-4 text-3xl font-semibold text-[color:var(--text-primary)]">{total}</p>
    </div>
  );
}
