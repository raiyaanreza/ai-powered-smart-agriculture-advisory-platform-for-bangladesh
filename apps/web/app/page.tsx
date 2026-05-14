import { Metadata } from "next";
import { AnimatedBanner } from "../features/landing/components/AnimatedBanner";
import { Navbar, Footer } from "../features/landing/components/Layout";
import { Hero } from "../features/landing/components/Hero";
import { TrustedBy } from "../features/landing/components/TrustedBy";
import { Features } from "../features/landing/components/Features";
import { HowItWorks } from "../features/landing/components/HowItWorks";
import { Testimonials } from "../features/landing/components/Testimonials";
import { Impact } from "../features/landing/components/Impact";
import { CTA } from "../features/landing/components/CTA";

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

      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Impact />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}