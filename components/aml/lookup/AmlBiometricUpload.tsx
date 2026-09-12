"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type AmlBiometricUploadProps = {
  label?: string;
  hint?: string;
  accept: string;
  acceptedLabel: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
};

function isAcceptedFile(file: File, accept: string) {
  const allowed = accept.split(",").map((value) => value.trim().toLowerCase());

  return allowed.some((token) => {
    if (token.startsWith(".")) {
      return file.name.toLowerCase().endsWith(token);
    }

    return file.type.toLowerCase() === token;
  });
}

export function AmlBiometricUpload({
  label = "Biometric Screening",
  hint,
  accept,
  acceptedLabel,
  file,
  onFileChange,
  error,
}: AmlBiometricUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (selectedFile: File | null) => {
    if (!selectedFile) {
      onFileChange(null);
      return;
    }

    if (!isAcceptedFile(selectedFile, accept)) {
      return;
    }

    onFileChange(selectedFile);
  };

  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-[color:var(--text-primary)]">{label}</p>
      {hint ? <p className="text-sm text-[color:var(--text-muted)]">{hint}</p> : null}

      <div
        className={cn(
          "rounded-xl bg-[color:var(--bg-muted)] px-6 py-10 text-center transition-colors",
          error
            ? "ring-1 ring-[color:var(--state-error)]"
            : isDragging
              ? "ring-1 ring-[color:var(--accent-primary-hover)]"
              : "",
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
          accept={accept}
          className="hidden"
          onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
        />

        <Upload className="mx-auto h-6 w-6 text-[color:var(--text-light)]" aria-hidden />

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
          <p className="text-sm text-[color:var(--text-light)]">Accepted format: {acceptedLabel}</p>
          {file ? (
            <p className="text-sm font-medium text-[color:var(--text-primary)]">{file.name}</p>
          ) : null}
        </div>
      </div>

      {error ? <p className="text-xs text-[color:var(--state-error)]">{error}</p> : null}
    </div>
  );
}
