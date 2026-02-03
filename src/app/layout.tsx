import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Spend & ROI OS",
  description: "AI tool consolidation & ROI control",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
