import { Metadata } from "next";
import { Navbar } from "@/features/landing/components/Layout";
import { AdvisoryDashboard } from "@/features/advisory/components/AdvisoryDashboard";

export const metadata: Metadata = {
  title: "Expert Advisory | AgriAdvisor AI",
  description: "Get personalized agricultural advice from our AI experts powered by Gemini 3.1 Flash Lite.",
};

export default function AdvisoryPage() {
  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA] overflow-hidden">
      <Navbar />
      <AdvisoryDashboard />
    </div>
  );
}

