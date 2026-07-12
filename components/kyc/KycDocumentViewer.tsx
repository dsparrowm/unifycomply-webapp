"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

const documentViews = ["ID Front", "ID Back", "Selfie"] as const;

type DocumentView = (typeof documentViews)[number];

const documentImages: Record<DocumentView, string> = {
  "ID Front": "/assets/kyc/nin-id-front.jpg",
  "ID Back": "/assets/kyc/nin-id-front.jpg",
  Selfie: "/assets/kyc/nin-id-front.jpg",
};

export function KycDocumentViewer() {
  const [activeView, setActiveView] = useState<DocumentView>("ID Front");
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

  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--border-default)] px-6 py-4">
        <div className="inline-flex gap-1 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] p-1">
          {documentViews.map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => {
                setActiveView(view);
                setZoom(1);
              }}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                activeView === view
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
          className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3 py-1.5 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]"
        >
          Compare with Selfie
        </button>
      </div>

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
            height={158}
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
