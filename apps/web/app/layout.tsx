import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgriVision | National AI Platform for Smart Farming",
  description: "Protect your crops with instant AI diagnosis. Free for all Bangladeshi farmers — powered by government-grade AI.",
};

import { Toaster } from "sonner";

import { QueryProvider } from "@/components/providers/QueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full scroll-smooth`}>
      {/* Force light background at the root to prevent flash */}
      <body className="min-h-full flex flex-col" style={{ color: "#1E293B" }}>
        <QueryProvider>
          {children}
          <Toaster position="top-center" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
