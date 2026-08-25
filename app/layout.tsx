import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const onest = localFont({
  src: [
    { path: "../fonts/onest/onest-400.ttf", weight: "400", style: "normal" },
    { path: "../fonts/onest/onest-500.ttf", weight: "500", style: "normal" },
    { path: "../fonts/onest/onest-600.ttf", weight: "600", style: "normal" },
    { path: "../fonts/onest/onest-700.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-onest",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Unifycomply",
  description: "Compliance management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${onest.variable} font-sans`} suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
