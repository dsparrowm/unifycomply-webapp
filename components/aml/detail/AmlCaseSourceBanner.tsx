import { ExternalLink } from "lucide-react";
import type { AmlCaseSource } from "@/types/aml";

type AmlCaseSourceBannerProps = {
  source: AmlCaseSource;
};

export function AmlCaseSourceBanner({ source }: AmlCaseSourceBannerProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-[color:var(--bg-muted)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-[color:var(--text-primary)]">{source.title}</p>
        {source.listedOn ? (
          <p className="mt-1 text-xs text-[color:var(--text-light)]">
            Listed On: {source.listedOn}
          </p>
        ) : null}
        {source.description ? (
          <p className="mt-1 text-xs text-[color:var(--text-light)]">{source.description}</p>
        ) : null}
      </div>
      <a
        href={source.href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-[color:var(--accent-primary-hover)] hover:underline"
      >
        Read more
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
