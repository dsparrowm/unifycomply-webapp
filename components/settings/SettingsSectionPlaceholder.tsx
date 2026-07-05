type SettingsSectionPlaceholderProps = {
  title: string;
};

export function SettingsSectionPlaceholder({ title }: SettingsSectionPlaceholderProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
        {title}
      </h2>
      <div className="rounded-lg border border-dashed border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-6 py-10 text-center">
        <p className="text-sm text-[color:var(--text-muted)]">
          {title} will be implemented in Milestone 1 Phase 4.
        </p>
      </div>
    </div>
  );
}
