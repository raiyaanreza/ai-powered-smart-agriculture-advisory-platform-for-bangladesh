import { Metadata } from "next";
import { Navbar } from "@/features/landing/components/Layout";
import { AdvisorySidebar } from "@/features/advisory/components/AdvisorySidebar";
import { ChatInterface } from "@/features/advisory/components/AdvisoryContent";

export const metadata: Metadata = {
  title: "Expert Advisory | AgriAdvisor AI",
  description: "Get personalized agricultural advice from our AI experts powered by Gemini 3.1 Flash Lite.",
};

export default function AdvisoryPage() {
  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA] overflow-hidden">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AdvisorySidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <main className="flex-1 overflow-hidden">
            <ChatInterface />
          </main>
        </div>
      </div>
    </div>
  );
}
