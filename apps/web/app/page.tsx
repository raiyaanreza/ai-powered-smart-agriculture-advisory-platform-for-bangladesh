import { Metadata } from "next";
import { AnimatedBanner } from "../features/landing/components/AnimatedBanner";
import { Navbar, Footer } from "../features/landing/components/Layout";
import { Hero } from "../features/landing/components/Hero";
import { TrustedBy } from "../features/landing/components/TrustedBy";
import { Features } from "../features/landing/components/Features";
import dynamic from "next/dynamic";
import { CTA } from "../features/landing/components/CTA";

const PipelineAnimation = dynamic(
  () => import("../features/landing/components/PipelineAnimation").then((mod) => ({ default: mod.PipelineAnimation })),
  { loading: () => <div className="h-96 bg-slate-50 animate-pulse rounded-3xl" /> }
);

const Impact = dynamic(
  () => import("../features/landing/components/Impact").then((mod) => ({ default: mod.Impact })),
  { loading: () => <div className="h-64 bg-slate-50 animate-pulse rounded-3xl" /> }
);

export const metadata: Metadata = {
  title: "AgriVision | National AI Platform for Smart Farming",
  description:
    "Protect your crops with instant AI diagnosis. Free for all Bangladeshi farmers — powered by government-grade AI.",
  robots: "index, follow",
  openGraph: {
    title: "AgriVision | AI-Powered Smart Farming for Bangladesh",
    description:
      "Protect your crops with instant AI diagnosis. Trusted by 50,000+ farmers across 64 districts.",
    type: "website",
    locale: "bn_BD",
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <AnimatedBanner />
      <Navbar />

      <main id="main-content" role="main">
        <Hero />
        <TrustedBy />
        <Features />
        <PipelineAnimation />
        <Impact />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}