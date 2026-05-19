import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bangla",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin Command Center | AgriVision",
  description: "Advanced agricultural monitoring and outbreak intelligence platform.",
};

import { Toaster } from "sonner";
import { SkipToContent } from "@agri-packages/ui";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${hindSiliguri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-inter), var(--font-bangla), system-ui, sans-serif" }} suppressHydrationWarning>
        <SkipToContent />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
