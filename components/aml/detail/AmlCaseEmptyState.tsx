import { Archive, Check } from "lucide-react";

type AmlCaseEmptyStateProps = {
  icon: "check" | "archive";
  title: string;
  description: string;
};

export function AmlCaseEmptyState({ icon, title, description }: AmlCaseEmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-24 text-center">
      {icon === "check" ? (
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--accent-primary-hover)] text-white">
          <Check className="h-7 w-7" strokeWidth={2} aria-hidden />
        </span>
      ) : (
        <Archive
          className="h-14 w-14 fill-[color:var(--accent-primary-hover)] text-[color:var(--accent-primary-hover)]"
          strokeWidth={1.5}
          aria-hidden
        />
      )}
      <h3 className="mt-8 text-base font-semibold text-[color:var(--text-primary)]">{title}</h3>
      <p className="mt-3 max-w-xs text-xs leading-5 text-[color:var(--text-light)]">
        {description}
      </p>
    </div>
  );
}
