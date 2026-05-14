import { Metadata } from "next";
import { AnimatedBanner } from "@/features/landing/components/AnimatedBanner";
import { Navbar, Footer } from "@/features/landing/components/Layout";
import { DiagnosisContainer } from "@/features/diagnosis/components/DiagnosisContainer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "AI Crop Diagnosis | AgriVision",
  description: "Upload a photo of your affected crop and get an instant AI-powered diagnosis and treatment plan in Bangla.",
};

export default function DiagnosisPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA" }}>
      <AnimatedBanner />
      <Navbar />
      
      <main>
        <DiagnosisContainer />
      </main>

      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}
