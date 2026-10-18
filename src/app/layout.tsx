import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import type { ReactNode } from "react";
import { ProgressProvider } from "@/components/ProgressProvider";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fridalingo",
  description: "Öva veckans engelska glosor med gåsen!",
  appleWebApp: { title: "Fridalingo", capable: true },
};

export const viewport: Viewport = {
  themeColor: "#58cc02",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sv" className={`${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <ProgressProvider>{children}</ProgressProvider>
      </body>
    </html>
  );
}
