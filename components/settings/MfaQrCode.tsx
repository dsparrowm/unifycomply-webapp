"use client";

import { useMemo } from "react";
import { qrcodegen } from "@/lib/vendor/qrcodegen";

type MfaQrCodeProps = {
  value: string;
  size?: number;
  label?: string;
};

export function MfaQrCode({ value, size = 200, label = "Authenticator QR code" }: MfaQrCodeProps) {
  const modules = useMemo(() => {
    const qr = qrcodegen.QrCode.encodeText(value, qrcodegen.QrCode.Ecc.MEDIUM);
    const cells: boolean[][] = [];
    for (let y = 0; y < qr.size; y += 1) {
      const row: boolean[] = [];
      for (let x = 0; x < qr.size; x += 1) {
        row.push(qr.getModule(x, y));
      }
      cells.push(row);
    }
    return cells;
  }, [value]);

  const dimension = modules.length;
  const paths: string[] = [];
  for (let y = 0; y < dimension; y += 1) {
    for (let x = 0; x < dimension; x += 1) {
      if (modules[y]?.[x]) {
        paths.push(`M${x} ${y}h1v1h-1z`);
      }
    }
  }

  return (
    <svg
      role="img"
      aria-label={label}
      width={size}
      height={size}
      viewBox={`0 0 ${dimension} ${dimension}`}
      className="rounded-md bg-white p-2"
      shapeRendering="crispEdges"
    >
      <rect width={dimension} height={dimension} fill="#ffffff" />
      <path d={paths.join("")} fill="#101928" />
    </svg>
  );
}
