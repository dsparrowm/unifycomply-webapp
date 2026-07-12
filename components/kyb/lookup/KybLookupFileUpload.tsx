"use client";

import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type KybLookupFileUploadProps = {
  hint: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
};

export function KybLookupFileUpload({ hint, file, onFileChange, error }: KybLookupFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (selectedFile: File | null) => {
    if (!selectedFile) {
      onFileChange(null);
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".xlsx")) {
      return;
    }

    onFileChange(selectedFile);
  };

  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-[color:var(--text-primary)]">Bulk Upload</p>
      <p className="text-sm text-[color:var(--text-muted)]">{hint}</p>

      <div
        className={cn(
          "rounded-xl border border-dashed bg-[color:var(--bg-surface)] px-6 py-4 text-center transition-colors",
          error
            ? "border-[color:var(--state-error)]"
            : isDragging
              ? "border-[color:var(--accent-primary-hover)] bg-[color:var(--accent-primary-soft)]"
              : "border-[color:var(--border-default)] hover:border-[color:var(--accent-primary-hover)]",
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFile(event.dataTransfer.files?.[0] ?? null);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
        />

        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-muted)] text-[color:var(--text-muted)]">
          <Upload className="h-5 w-5" aria-hidden />
        </div>

        <div className="mt-3 space-y-1">
          <p className="text-sm text-[color:var(--text-primary)]">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="font-medium text-[color:var(--accent-primary-hover)] hover:underline"
            >
              Click to upload
            </button>
            <span className="text-[color:var(--text-muted)]"> or drag and drop</span>
          </p>
          <p className="text-sm text-[color:var(--text-light)]">Accepted format: xlsx</p>
          {file ? (
            <p className="text-sm font-medium text-[color:var(--text-primary)]">{file.name}</p>
          ) : null}
        </div>
      </div>

      {error ? <p className="text-xs text-[color:var(--state-error)]">{error}</p> : null}

      <div className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-muted)] p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Download className="h-6 w-6 text-[color:var(--accent-primary)]" aria-hidden />
            <span className="text-sm font-medium text-[color:var(--text-primary)]">Need a template?</span>
          </div>
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[color:var(--border-default)] bg-white px-3 text-xs font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-surface)]"
          >
            <Download className="h-3.5 w-3.5" aria-hidden />
            Download template
          </button>
        </div>
        <p className="mt-2 text-sm text-[color:var(--text-muted)]">
          Download our CSV template with the correct format
        </p>
      </div>
    </div>
  );
}
