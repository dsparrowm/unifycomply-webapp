type KycLookupPlaceholderTabProps = {
  title: string;
  description: string;
};

export function KycLookupPlaceholderTab({ title, description }: KycLookupPlaceholderTabProps) {
  return (
    <div className="rounded-xl border border-dashed border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-6 py-16 text-center">
      <h2 className="text-base font-semibold text-[color:var(--text-primary)]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-[color:var(--text-muted)]">{description}</p>
    </div>
  );
}
