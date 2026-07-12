"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

const documentViews = ["ID Front", "ID Back", "Selfie"] as const;

type DocumentView = (typeof documentViews)[number];

const documentImages: Record<DocumentView, string> = {
  "ID Front": "/assets/kyc/nigeria-passport-front.svg",
  "ID Back": "/assets/kyc/nigeria-passport-front.svg",
  Selfie: "/assets/kyc/selfie-placeholder.svg",
};

const compareImages = {
  passport: "/assets/kyc/nigeria-passport-front.svg",
  selfie: "/assets/kyc/selfie-placeholder.svg",
};

type KycDocumentViewerProps = {
  matchScore?: number;
};

export function KycDocumentViewer({ matchScore = 94 }: KycDocumentViewerProps) {
  const [activeView, setActiveView] = useState<DocumentView>("ID Front");
  const [compareMode, setCompareMode] = useState(false);
  const [zoom, setZoom] = useState(1);

  const activeIndex = documentViews.indexOf(activeView);

  function goToPrevious() {
    const nextIndex = activeIndex === 0 ? documentViews.length - 1 : activeIndex - 1;
    setActiveView(documentViews[nextIndex]);
    setZoom(1);
  }

  function goToNext() {
    const nextIndex = activeIndex === documentViews.length - 1 ? 0 : activeIndex + 1;
    setActiveView(documentViews[nextIndex]);
    setZoom(1);
  }

  function selectView(view: DocumentView) {
    setActiveView(view);
    setCompareMode(false);
    setZoom(1);
  }

  function toggleCompareMode() {
    setCompareMode((value) => !value);
    setZoom(1);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--border-default)] px-6 py-4">
        <div className="inline-flex gap-1 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] p-1">
          {documentViews.map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => selectView(view)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                activeView === view && !compareMode
                  ? "bg-[color:var(--bg-surface)] text-[color:var(--accent-primary-hover)] shadow-sm"
                  : "text-[color:var(--text-muted)]",
              )}
            >
              {view}
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
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <div className="overflow-hidden rounded-lg shadow-md">
                <Image
                  src={compareImages.passport}
                  alt="Nigerian international passport"
                  width={316}
                  height={210}
                  className="h-auto w-full max-w-[280px] object-contain sm:max-w-[316px]"
                  priority
                />
              </div>

              <ArrowRight className="h-8 w-8 shrink-0 text-[color:var(--accent-primary-hover)]" />

              <div className="overflow-hidden rounded-lg shadow-md">
                <Image
                  src={compareImages.selfie}
                  alt="Selfie placeholder"
                  width={200}
                  height={200}
                  className="h-auto w-full max-w-[180px] object-contain sm:max-w-[200px]"
                  priority
                />
              </div>
            </div>

            <p className="text-2xl font-semibold text-[color:var(--accent-primary-hover)] sm:text-3xl">
              {matchScore}% Biometric Match Score
            </p>
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
            <Image
              src={documentImages[activeView]}
              alt={`${activeView} document`}
              width={316}
              height={activeView === "Selfie" ? 200 : 210}
              className="h-auto w-full max-w-[340px] object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
              priority
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
