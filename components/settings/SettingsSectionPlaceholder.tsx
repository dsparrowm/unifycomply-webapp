type SettingsSectionPlaceholderProps = {
  title: string;
  description?: string;
};

export function SettingsSectionPlaceholder({
  title,
  description,
}: SettingsSectionPlaceholderProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
        {title}
      </h2>
      <div className="rounded-lg border border-dashed border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-6 py-10 text-center">
        <p className="text-sm text-[color:var(--text-muted)]">
          {description ?? `${title} is not available yet.`}
        </p>
      </div>
    </div>
  );
}
