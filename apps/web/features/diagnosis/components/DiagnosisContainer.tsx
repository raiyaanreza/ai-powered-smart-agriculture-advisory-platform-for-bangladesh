"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Sparkles, AlertCircle, History, ArrowLeft, Leaf, TrendingUp, Map as MapIcon, Users, CheckCircle2 } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { ResultDisplay } from "./ResultDisplay";
import { OutbreakMap } from "./OutbreakMap";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDiagnosisStats, useDiagnoseImage } from "../hooks/useDiagnosis";

export function DiagnosisContainer() {
  const { user, profile } = useAuth();
  const [step, setStep] = useState<"upload" | "processing" | "result">("upload");
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [usageCount, setUsageCount] = useState(0);

  const { data: stats } = useDiagnosisStats();
  const diagnoseMutation = useDiagnoseImage();

  const diagnosesToday = stats?.diagnosesToday || 0;
  const modelPrecision = stats?.modelPrecision || "99.1%";
  const recentDiagnoses = stats?.recentDiagnoses || [];

  useEffect(() => {
    const count = parseInt(localStorage.getItem("agri_usage_count") || "0");
    setUsageCount(count);
  }, []);

  const handleUpload = async (base64: string) => {
    if (usageCount >= 3) {
      toast.error("সীমা অতিক্রম করেছেন!");
      return;
    }
    setImage(base64);
    setStep("processing");
    try {
      const data = await diagnoseMutation.mutateAsync({
        image: base64,
        userId: profile?.id || user?.id
      });
      
      if (data.error) throw new Error(data.error);
      setResult(data);
      setUsageCount(prev => prev + 1);
      localStorage.setItem("agri_usage_count", (usageCount + 1).toString());
      setStep("result");
    } catch (err) {
      toast.error("বিশ্লেষণ ব্যর্থ হয়েছে।");
      setStep("upload");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden"
      style={{
        background: "#FFFFFF",
        backgroundImage: "radial-gradient(#CBD5E1 0.8px, transparent 0.8px)",
        backgroundSize: "32px 32px"
      }}>

      {/* Subtle top gradient */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#F0FDF4] to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10 pt-16 pb-20">

        {/* Page Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm border border-[#2D7A3E]/10"
            style={{ background: "#FFFFFF", color: "#2D7A3E" }}
          >
            <Sparkles className="h-3 w-3" />
            AI-Powered Precision Agriculture
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-[#1A321A] tracking-tighter mb-4 leading-tight"
          >
            Instant Crop Diagnosis
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <p className="text-xl font-bold text-[#2D5A27] font-bn tracking-wide">
              কৃষকের জন্য রিয়েল-টাইম এআই রোগ শনাক্তকরণ
            </p>
            <p className="text-slate-500 max-w-xl mx-auto text-[13px] leading-relaxed font-medium">
              Empowering farmers across Bangladesh with real-time AI disease detection.
              Upload a photo to receive expert-verified treatment plans.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-16">
          {/* Left Area */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {step === "upload" && (
                <motion.div
                  key="uploader"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <ImageUploader onUpload={handleUpload} />
                </motion.div>
              )}

              {step === "processing" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[400px] rounded-[2rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col items-center justify-center p-12 text-center"
                >
                  <div className="relative h-20 w-20 mb-6">
                    <motion.div className="absolute inset-0 rounded-full border-4 border-slate-50" />
                    <motion.div className="absolute inset-0 rounded-full border-4 border-t-[#2D7A3E]" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Leaf className="h-8 w-8 text-[#2D7A3E] animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">বিশ্লেষণ করা হচ্ছে...</h3>
                  <p className="text-sm text-slate-400">Gemini 3.1 Flash Lite is analyzing your photo</p>
                </motion.div>
              )}

              {step === "result" && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ResultDisplay result={result} image={image} onReset={() => setStep("upload")} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Area */}
          <div className="lg:col-span-5 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="rounded-3xl p-6 bg-white border border-slate-100 shadow-xl shadow-slate-200/20 group cursor-default"
                whileHover={{ y: -3, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <TrendingUp className="h-5 w-5 text-[#2D7A3E] mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-black text-slate-900 tracking-tighter">{diagnosesToday.toLocaleString()}</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Diagnoses Today</div>
              </motion.div>

              <motion.div
                className="rounded-3xl p-6 text-white shadow-xl shadow-green-950/30 group cursor-default"
                style={{ background: "#1A321A" }}
                whileHover={{ y: -3, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <CheckCircle2 className="h-5 w-5 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-black tracking-tighter">{modelPrecision}</div>
                <div className="text-[9px] font-black uppercase tracking-widest opacity-60 mt-1">Model Precision</div>
              </motion.div>
            </div>

            <motion.div
              className="rounded-[2rem] p-8 bg-white border border-slate-100 shadow-xl shadow-slate-200/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-[#2D7A3E]" />
                  <span className="text-xs font-black text-slate-800">Recent Global Diagnoses</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-50">
                  <div className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[8px] font-black uppercase text-red-600">Live</span>
                </div>
              </div>

              <div className="space-y-5">
                {recentDiagnoses.length > 0 ? recentDiagnoses.map((item: any, i: number) => {
                  const isHealthy = item.disease_detected?.toLowerCase().includes("healthy");
                  const iconComp = isHealthy ? Leaf : Sparkles;
                  const color = isHealthy ? "text-green-500" : "text-amber-500";
                  const bg = isHealthy ? "bg-green-50" : "bg-amber-50";
                  const NameIcon = iconComp;

                  let timeAgo = "Just now";
                  try {
                    const diff = Date.now() - new Date(item.created_at).getTime();
                    const mins = Math.floor(diff / 60000);
                    const hours = Math.floor(mins / 60);
                    const days = Math.floor(hours / 24);
                    if (days > 0) timeAgo = `${days}d ago`;
                    else if (hours > 0) timeAgo = `${hours}h ago`;
                    else if (mins > 0) timeAgo = `${mins}min ago`;
                    else timeAgo = "Just now";
                  } catch (e) { }

                  return (
                    <div key={i} className="flex items-center gap-4 group cursor-pointer transition-all hover:translate-x-1">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center `}>
                        <NameIcon className={`h-5 w-5 `} />
                      </div>
                      <div className="flex-1">
                        <div className="text-[12px] font-black text-slate-900 group-hover:text-[#2D5A27] transition-colors">{item.crop_detected} {isHealthy ? 'Healthy' : 'Issue Detected'}</div>
                        <div className="text-[10px] text-slate-400 font-bold">{item.district || "Bangladesh"} � {timeAgo}</div>
                      </div>
                    </div>
                  )
                }) : (
                  <div className="text-xs text-slate-400 text-center py-4">Waiting for incoming data...</div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Outbreak Map Section */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-[#1A321A] tracking-tighter mb-2">National Disease Surveillance</h2>
              <p className="text-sm font-bold text-[#2D5A27] font-bn">পোস্টজিআইএস (PostGIS) প্রযুক্তিতে দেশব্যাপী রোগের প্রাদুর্ভাব পর্যবেক্ষণ</p>
            </div>
            <div className="hidden md:flex items-center gap-4 px-6 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Data Sync</span>
            </div>
          </div>
          <OutbreakMap />
        </div>

        {/* Look For Cards */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-slate-900 mb-2">What to Look For</h2>
          <p className="text-xs text-slate-400">Early detection is key for healthy harvests.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { Icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50", title: "Leaf Spotting", desc: "Small brown or yellow circles." },
            { Icon: TrendingUp, color: "text-red-500", bg: "bg-red-50", title: "Stunted Growth", desc: "Plants significantly shorter." },
            { Icon: Leaf, color: "text-emerald-500", bg: "bg-emerald-50", title: "Wilting", desc: "Drooping leaves with water." },
            { Icon: Sparkles, color: "text-blue-500", bg: "bg-blue-50", title: "Discolored Grains", desc: "White, black, or grey harvest." },
          ].map((item, i) => (
            <div key={i} className="rounded-3xl p-6 bg-white border border-slate-100 text-center hover:shadow-lg hover:-translate-y-1 hover:border-[#2D7A3E]/20 transition-all cursor-pointer">
              <div className={`h-12 w-12 rounded-2xl mx-auto mb-4 flex items-center justify-center ${item.bg}`}>
                <item.Icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <h4 className="text-[11px] font-black text-slate-900 mb-1">{item.title}</h4>
              <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

