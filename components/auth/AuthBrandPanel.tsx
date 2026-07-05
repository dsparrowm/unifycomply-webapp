import Image from "next/image";
import { AuthBrandPattern } from "@/components/auth/AuthBrandPattern";
import { UnifycomplyLogo } from "@/components/brand/UnifycomplyLogo";

const AVATAR_SRC = "/images/testimonial-avatar.jpg";

type AuthBrandPanelProps = {
  compact?: boolean;
};

export function AuthBrandPanel({ compact = false }: AuthBrandPanelProps) {
  if (compact) {
    return (
      <div className="flex justify-center">
        <UnifycomplyLogo variant="dark" />
      </div>
    );
  }

  return (
    <div className="auth-brand-panel relative flex min-h-[calc(100vh-3rem)] flex-1 flex-col overflow-hidden rounded-[20px] bg-[color:var(--auth-panel-bg)] px-[60px] pt-[60px] pb-[30px] text-white">
      <AuthBrandPattern />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 flex shrink-0 flex-col">
        <UnifycomplyLogo variant="light" />

        <div className="mt-[74px] w-full max-w-[562px]">
          <h1 className="text-[56px] font-semibold leading-[1.29] tracking-[-0.02em] text-white">
            Next-Generation Compliance for Modern Finance
          </h1>
          <p className="mt-8 max-w-[445px] text-[17px] font-normal leading-[26px] text-[color:var(--auth-panel-subtext)]">
            Automated KYC/KYB verification, intelligent AML screening, and network fraud
            detection that scales with your growth
          </p>
        </div>
      </div>

      <div className="relative z-10 min-h-[120px] flex-1" aria-hidden />

      <div className="relative z-10 mt-auto w-full max-w-[717px] shrink-0 rounded-[16px] bg-[color:var(--auth-testimonial-bg)] p-6">
        <p className="max-w-[669px] text-sm font-normal leading-[1.6] text-white/95">
          The intelligent alert prioritization and explainable risk scoring eliminated our
          false positive overwhelm, while the visual relationship mapping caught fraud
          patterns we never would have spotted manually.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <Image
            src={AVATAR_SRC}
            alt="Ariana Grande"
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold leading-[18px] text-white">Ariana Grande</p>
            <p className="mt-1 text-[13px] leading-[15px] text-[color:var(--auth-testimonial-role)]">
              Software Developer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
