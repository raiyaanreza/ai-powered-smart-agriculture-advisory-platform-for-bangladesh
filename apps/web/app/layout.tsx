import type { Metadata } from "next";
import { Inter, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bangla",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgriVision | National AI Platform for Smart Farming",
  description: "Protect your crops with instant AI diagnosis. Free for all Bangladeshi farmers — powered by government-grade AI.",
};

import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { SkipToContent } from "@agri-packages/ui";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${hindSiliguri.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col" style={{ color: "#1E293B" }} suppressHydrationWarning>
        <SkipToContent />
        <QueryProvider>
          {children}
          <Toaster position="top-center" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
