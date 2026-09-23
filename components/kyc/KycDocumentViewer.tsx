"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KycDocumentView } from "@/types/kyc";

const defaultViews: KycDocumentView[] = [
  { id: "id-front", label: "ID Front", src: "/assets/kyc/nigeria-passport-front.svg" },
  { id: "id-back", label: "ID Back", src: "/assets/kyc/nigeria-passport-front.svg" },
  { id: "selfie", label: "Selfie", src: "/assets/kyc/selfie-placeholder.svg" },
];

type KycDocumentViewerProps = {
  matchScore?: number;
  /** Failed biometric compare — Figma 119: Request Resubmission + {n}% Match Score. */
  failedMatch?: boolean;
  /** Live signed document previews when available. */
  views?: KycDocumentView[];
};

function DocumentImage({
  src,
  alt,
  width,
  height,
  className,
  style,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const isRemote = src.startsWith("http://") || src.startsWith("https://");
  if (isRemote) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- signed S3 URLs vary by host
      <img src={src} alt={alt} width={width} height={height} className={className} style={style} />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      priority
    />
  );
}

export function KycDocumentViewer({
  matchScore = 94,
  failedMatch = false,
  views,
}: KycDocumentViewerProps) {
  const documentViews = views && views.length > 0 ? views : defaultViews;
  const [activeId, setActiveId] = useState(documentViews[0]?.id ?? "id-front");
  const [compareMode, setCompareMode] = useState(false);
  const [zoom, setZoom] = useState(1);

  const activeView = useMemo(
    () => documentViews.find((view) => view.id === activeId) ?? documentViews[0],
    [activeId, documentViews],
  );
  const activeIndex = documentViews.findIndex((view) => view.id === activeView?.id);
  const frontSrc =
    documentViews.find((view) => view.label === "ID Front")?.src ??
    documentViews[0]?.src ??
    defaultViews[0].src;
  const selfieSrc =
    documentViews.find((view) => view.label === "Selfie")?.src ??
    documentViews.find((view) => /selfie/i.test(view.label))?.src ??
    defaultViews[2].src;

  function goToPrevious() {
    const nextIndex = activeIndex <= 0 ? documentViews.length - 1 : activeIndex - 1;
    setActiveId(documentViews[nextIndex].id);
    setZoom(1);
  }

  function goToNext() {
    const nextIndex = activeIndex >= documentViews.length - 1 ? 0 : activeIndex + 1;
    setActiveId(documentViews[nextIndex].id);
    setZoom(1);
  }

  function selectView(id: string) {
    setActiveId(id);
    setCompareMode(false);
    setZoom(1);
  }

  function toggleCompareMode() {
    setCompareMode((value) => !value);
    setZoom(1);
  }

  if (!activeView) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--border-default)] px-6 py-4">
        <div className="inline-flex gap-1 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] p-1">
          {documentViews.map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => selectView(view.id)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                activeView.id === view.id && !compareMode
                  ? "bg-[color:var(--bg-surface)] text-[color:var(--accent-primary-hover)] shadow-sm"
                  : "text-[color:var(--text-muted)]",
              )}
            >
              {view.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={toggleCompareMode}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            compareMode
              ? "bg-[color:var(--accent-primary)] text-white"
              : "bg-[color:var(--accent-primary-hover)] text-white hover:bg-[color:var(--accent-primary)]",
          )}
        >
          Compare with Selfie
        </button>
      </div>

      {compareMode ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center bg-[color:var(--bg-muted)] px-6 py-8">
          <div
            className="flex flex-col items-center gap-6 transition-transform duration-200"
            style={{ transform: `scale(${zoom})` }}
          >
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <div className="overflow-hidden rounded-lg shadow-md">
                <DocumentImage
                  src={frontSrc}
                  alt="Identity document"
                  width={316}
                  height={210}
                  className="h-auto w-full max-w-[280px] object-contain sm:max-w-[316px]"
                />
              </div>

              <ArrowRight className="h-8 w-8 shrink-0 text-[color:var(--accent-primary-hover)]" />

              <div className="overflow-hidden rounded-lg shadow-md">
                <DocumentImage
                  src={selfieSrc}
                  alt="Selfie"
                  width={200}
                  height={200}
                  className="h-auto w-full max-w-[180px] object-contain sm:max-w-[200px]"
                />
              </div>
            </div>

            <div
              className={cn(
                "text-center text-2xl font-semibold sm:text-3xl",
                failedMatch
                  ? "text-[color:var(--state-warning)]"
                  : "text-[color:var(--accent-primary-hover)]",
              )}
            >
              {failedMatch ? (
                <p className="text-xl font-semibold sm:text-2xl">Request Resubmission</p>
              ) : null}
              <p className={failedMatch ? "mt-1" : undefined}>{matchScore}% Match Score</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex min-h-[360px] items-center justify-center bg-[color:var(--bg-muted)] px-14 py-8">
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Previous document"
            className="absolute left-4 flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] text-[color:var(--text-muted)] shadow-sm hover:text-[color:var(--text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="overflow-hidden rounded-lg shadow-md">
            <DocumentImage
              src={activeView.src}
              alt={`${activeView.label} document`}
              width={316}
              height={activeView.label === "Selfie" ? 200 : 210}
              className="h-auto w-full max-w-[340px] object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            />
          </div>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Next document"
            className="absolute right-4 flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] text-[color:var(--text-muted)] shadow-sm hover:text-[color:var(--text-primary)]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-center gap-6 border-t border-[color:var(--border-default)] px-6 py-4">
        <button
          type="button"
          onClick={() => setZoom((value) => Math.min(value + 0.25, 2))}
          className="inline-flex items-center gap-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)]">
            <ZoomIn className="h-4 w-4" />
          </span>
          Zoom In
        </button>
        <button
          type="button"
          onClick={() => setZoom((value) => Math.max(value - 0.25, 1))}
          className="inline-flex items-center gap-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)]">
            <ZoomOut className="h-4 w-4" />
          </span>
          Zoom Out
        </button>
      </div>
    </div>
  );
}
