import { SquareArrowOutUpRight } from "lucide-react";
import type { AmlAdditionalInfoLink } from "@/types/aml-screening";

type AmlAdditionalInformationPanelProps = {
  links: AmlAdditionalInfoLink[];
};

export function AmlAdditionalInformationPanel({ links }: AmlAdditionalInformationPanelProps) {
  if (links.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-[color:var(--text-muted)]">
        No additional information was returned for this screening.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {links.map((link) => (
        <div key={link.id}>
          <p className="text-sm font-semibold text-[color:var(--text-primary)]">{link.source}</p>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--accent-primary-hover)] hover:underline"
          >
            {link.label}
            <SquareArrowOutUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      ))}
    </div>
  );
}
