import { Metadata } from "next";
import { AnimatedBanner } from "../features/landing/components/AnimatedBanner";
import { Navbar, Footer } from "../features/landing/components/Layout";
import { Hero } from "../features/landing/components/Hero";
import { TrustedBy } from "../features/landing/components/TrustedBy";
import { Features } from "../features/landing/components/Features";
import { Impact } from "../features/landing/components/Impact";
import { CTA } from "../features/landing/components/CTA";
import { PipelineAnimation } from "../features/landing/components/PipelineAnimation";

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
    <div style={{ minHeight: "100vh", background: "#FAFAFA", color: "#1E293B" }}>
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