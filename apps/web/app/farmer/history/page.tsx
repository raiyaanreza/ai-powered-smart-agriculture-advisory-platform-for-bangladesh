import { Metadata } from "next";
import { HistoryList } from "@/features/farmer/components/HistoryList";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Diagnosis History | AgriVision",
  description: "View your past crop diagnoses and treatment plans.",
};

export default function FarmerHistoryPage() {
  return (
    <main className="flex-1 max-w-4xl w-full mx-auto p-8 lg:p-16">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-[10px] font-black uppercase tracking-widest text-[#052E16] mb-4">
          <Sparkles className="h-3 w-3" />
          Personal Archive
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">My Diagnoses</h1>
        <p className="text-slate-500 font-medium">আপনার আগের সব শস্য রোগ নির্ণয়ের ইতিহাস এখানে সংরক্ষিত আছে।</p>
      </div>

      <HistoryList />
    </main>
  );
}
