"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Sparkles, AlertCircle, History, ArrowLeft, Leaf, TrendingUp, Map as MapIcon, Users, CheckCircle2 } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { ResultDisplay } from "./ResultDisplay";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDiagnosisStats, useDiagnoseImage } from "../hooks/useDiagnosis";

const OutbreakMap = dynamic(
  () => import("./OutbreakMap").then((mod) => ({ default: mod.OutbreakMap })),
  { ssr: false, loading: () => <div className="h-96 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse" /> }
);

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
    <div className="min-h-screen relative overflow-hidden bg-background bg-[radial-gradient(rgba(203,213,225,0.2)_0.8px,transparent_0.8px)] dark:bg-[radial-gradient(rgba(30,46,37,0.4)_0.8px,transparent_0.8px)] [background-size:32px_32px] transition-colors duration-200">

      {/* Subtle top gradient */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#F0FDF4] dark:from-emerald-950/15 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10 pt-16 pb-20">

        {/* Page Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-xs border border-primary/20 bg-card text-primary"
          >
            <Sparkles className="h-3 w-3" />
            AI-Powered Precision Agriculture
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 leading-tight"
          >
            Instant Crop Diagnosis
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <p className="text-xl font-bold text-primary font-bn tracking-wide">
              কৃষকের জন্য রিয়েল-টাইম এআই রোগ শনাক্তকরণ
            </p>
            <p className="text-slate-550 dark:text-slate-400 max-w-xl mx-auto text-[13px] leading-relaxed font-medium">
              Empowering farmers across Bangladesh with real-time AI disease detection.
              Upload a photo to receive expert-verified treatment plans.
              আক্রান্ত ফসলের একটি ছবি আপলোড করুন এবং পরামর্শ পান।
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
                  className="h-full min-h-[420px] rounded-[2.5rem] bg-[#052E16] dark:bg-[#07130b] border border-emerald-950 dark:border-emerald-900/20 shadow-2xl flex flex-col items-center justify-center p-12 text-center relative overflow-hidden"
                >
                  {/* Futuristic Laser Scanning Line */}
                  <motion.div 
                    animate={{ y: ["0%", "360px"] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#EAB308] to-transparent shadow-[0_0_20px_#EAB308,0_0_35px_#EAB308] z-20 pointer-events-none"
                  />
                  
                  {/* Subtle Grid overlay inside scanner */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:20px_20px]" />
                  
                  {/* Deep glowing radial gradients in backend */}
                  <div className="absolute inset-0 bg-radial-gradient(circle_at_center, rgba(234,179,8,0.12) 0%, transparent 65%) pointer-events-none" />

                  <div className="relative h-24 w-24 mb-8">
                    {/* Ring circles pulsing */}
                    <motion.div 
                      animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.45, 0.15] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-full border border-emerald-400/20" 
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.18, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-2 rounded-full border-2 border-emerald-400/30" 
                    />
                    <motion.div 
                      className="absolute inset-4 rounded-full border-2 border-t-[#EAB308] border-r-transparent border-l-transparent border-b-transparent" 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} 
                    />
                    <div className="absolute inset-4 flex items-center justify-center">
                      <Leaf className="h-9 w-9 text-[#EAB308] animate-pulse" />
                    </div>
                  </div>

                  <h3 className="text-3xl font-black text-white mb-3 tracking-tight font-bn">বিশ্লেষণ করা হচ্ছে...</h3>
                  <p className="text-emerald-300/80 text-sm font-bold tracking-widest uppercase mb-1">Gemini 3.5 Flash is scanning</p>
                  <p className="text-emerald-100/40 text-xs font-semibold max-w-xs mx-auto">Extracting pathological patterns and mapping regional outbreak models.</p>
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
                className="rounded-3xl p-6 bg-card border border-border shadow-xs group cursor-default"
                whileHover={{ y: -3, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <TrendingUp className="h-5 w-5 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{diagnosesToday.toLocaleString()}</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">Diagnoses Today</div>
              </motion.div>

              <motion.div
                className="rounded-3xl p-6 text-white border border-transparent dark:border-emerald-800/30 bg-earth-900 dark:bg-emerald-950/40 shadow-xs group cursor-default"
                whileHover={{ y: -3, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-black tracking-tighter text-white">{modelPrecision}</div>
                <div className="text-[9px] font-black uppercase tracking-widest opacity-60 mt-1 text-white/80">Model Precision</div>
              </motion.div>
            </div>

            <motion.div
              className="rounded-[2rem] p-8 bg-card border border-border shadow-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100">Recent Global Diagnoses</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-50 dark:bg-red-950/20">
                  <div className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[8px] font-black uppercase text-red-600 dark:text-red-400">Live</span>
                </div>
              </div>

              <div className="space-y-5">
                {recentDiagnoses.length > 0 ? recentDiagnoses.map((item: any, i: number) => {
                  const isHealthy = item.disease_detected?.toLowerCase().includes("healthy");
                  const iconComp = isHealthy ? Leaf : Sparkles;
                  const color = isHealthy ? "text-emerald-600 dark:text-emerald-450" : "text-amber-500 dark:text-amber-400";
                  const bg = isHealthy ? "bg-emerald-50 dark:bg-emerald-950/20" : "bg-amber-50 dark:bg-amber-955/20";
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
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${bg} ${color}`}>
                        <NameIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[12px] font-black text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">{item.crop_detected} {isHealthy ? 'Healthy' : 'Issue Detected'}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{item.district || "Bangladesh"} · {timeAgo}</div>
                      </div>
                    </div>
                  )
                }) : (
                  <div className="text-xs text-slate-400 dark:text-slate-550 text-center py-4">Waiting for incoming data...</div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Outbreak Map Section */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">National Disease Surveillance</h2>
              <p className="text-sm font-bold text-primary font-bn">পোস্টজিআইএস (PostGIS) প্রযুক্তিতে দেশব্যাপী রোগের প্রাদুর্ভাব পর্যবেক্ষণ</p>
            </div>
            <div className="hidden md:flex items-center gap-4 px-6 py-3 rounded-2xl bg-card border border-border shadow-xs">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Live Data Sync</span>
            </div>
          </div>
          <OutbreakMap />
        </div>

        {/* Look For Cards */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">What to Look For</h2>
          <p className="text-xs text-slate-400 dark:text-slate-550">Early detection is key for healthy harvests. সনাক্তকরণ বৃদ্ধির লক্ষণসমূহ।</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { Icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-955/15", title: "Leaf Spotting", desc: "Small brown or yellow circles." },
            { Icon: TrendingUp, color: "text-red-500 dark:text-red-400", bg: "bg-red-50 dark:bg-red-955/15", title: "Stunted Growth", desc: "Plants significantly shorter." },
            { Icon: Leaf, color: "text-emerald-500 dark:text-emerald-450", bg: "bg-emerald-50 dark:bg-emerald-955/15", title: "Wilting", desc: "Drooping leaves with water." },
            { Icon: Sparkles, color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-955/15", title: "Discolored Grains", desc: "White, black, or grey harvest." },
          ].map((item, i) => (
            <div key={i} className="rounded-3xl p-6 bg-card border border-border text-center hover:shadow-lg dark:hover:shadow-black/50 hover:-translate-y-1 hover:border-primary/20 transition-all cursor-pointer">
              <div className={`h-12 w-12 rounded-2xl mx-auto mb-4 flex items-center justify-center ${item.bg}`}>
                <item.Icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <h4 className="text-[11px] font-black text-slate-900 dark:text-slate-100 mb-1">{item.title}</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
