"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { motion } from "framer-motion";
import { Calendar, Tag, ChevronRight, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";

export function HistoryList() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHistory([]);
      setLoading(false);
      return;
    }

    fetchHistory(user.id);
  }, [user]);

  const fetchHistory = async (userId: string) => {
    const { data, error } = await supabase
      .from("diagnoses")
      .select("*")
      .eq("farmer_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setHistory(data);
    } else {
      setHistory([]);
    }
    setLoading(false);
  };

  if (loading) return <div className="p-12 text-center text-slate-400 font-bold">লোড হচ্ছে...</div>;

  if (!user) {
    return (
      <div className="p-12 text-center bg-white border border-slate-200 rounded-[2rem] shadow-sm">
        <AlertCircle className="h-12 w-12 text-slate-200 mx-auto mb-4" />
        <div className="text-lg font-black text-slate-900">ইতিহাস দেখতে সাইন ইন করুন</div>
        <p className="text-slate-400 text-sm mt-2 mb-6">আপনার ব্যক্তিগত diagnosis history শুধু লগইন করা ব্যবহারকারীর জন্য সংরক্ষিত।</p>
        <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-xl bg-[#052E16] px-5 text-[11px] font-black uppercase tracking-widest text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black active:scale-95">
          Sign In
        </Link>
      </div>
    );
  }

  if (history.length === 0) return (
    <div className="p-12 text-center bg-white border border-dashed border-slate-200 rounded-[2rem]">
      <AlertCircle className="h-12 w-12 text-slate-200 mx-auto mb-4" />
      <div className="text-lg font-black text-slate-900">কোন ইতিহাস পাওয়া যায়নি</div>
      <p className="text-slate-400 text-sm mt-2">আপনার প্রথম শস্য রোগ নির্ণয় শুরু করুন।</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {history.map((item, i) => (
        <motion.div 
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="group p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
              {(item.crop_detected || item.crop) === "Rice" ? "🌾" : (item.crop_detected || item.crop) === "Tomato" ? "🍅" : (item.crop_detected || item.crop) === "Potato" ? "🥔" : "🌿"}
            </div>
            <div>
              <div className="text-lg font-black text-slate-900 tracking-tight">{item.disease_detected || item.disease}</div>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Calendar className="h-3 w-3" /> {new Date(item.created_at).toLocaleDateString()}
                </span>
                <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${
                  item.severity === "High" ? "text-red-500" : item.severity === "Medium" ? "text-amber-500" : "text-green-500"
                }`}>
                  <Tag className="h-3 w-3" /> {item.severity} Risk
                </span>
                {typeof item.confidence_score === "number" && (
                  <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <FileText className="h-3 w-3" /> {Math.round(item.confidence_score * 100)}% confidence
                  </span>
                )}
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-[#052E16] group-hover:translate-x-1 transition-all duration-300" />
        </motion.div>
      ))}
    </div>
  );
}
