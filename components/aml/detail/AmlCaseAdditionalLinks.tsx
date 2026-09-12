import { ExternalLink } from "lucide-react";

type AmlCaseAdditionalLinksProps = {
  links: { label: string; value: string; href: string }[];
};

export function AmlCaseAdditionalLinks({ links }: AmlCaseAdditionalLinksProps) {
  return (
    <dl>
      {links.map((link) => (
        <div
          key={link.label}
          className="border-b border-[color:var(--border-subtle)] py-4 last:border-b-0"
        >
          <dt className="text-sm text-[color:var(--text-muted)]">{link.label}</dt>
          <dd className="mt-1.5">
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-[color:var(--text-primary)] hover:underline"
            >
              {link.value}
              <ExternalLink className="h-3.5 w-3.5 text-[color:var(--text-muted)]" />
            </a>
          </dd>
        </div>
      ))}
    </dl>
  );
}
