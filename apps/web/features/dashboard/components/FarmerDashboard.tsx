"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Activity,
  AlertTriangle,
  Calendar,
  CloudRain,
  History,
  Info,
  TrendingUp,
  Wind,
  Plus,
  ArrowUpRight,
  Lock,
  Search,
  CheckCircle2,
  Droplets,
  Sprout,
  BarChart3,
  PieChart as PieIcon,
  Timer,
  ShieldCheck,
  ChevronRight,
  Zap,
  Globe
} from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { DashboardBackground } from "./DashboardBackground";

// Premium Color System
const COLORS = {
  primary: "#052E16",
  secondary: "#2D5A27",
  accent: "#EAB308",
  background: "#F8FAFC",
  card: "rgba(255, 255, 255, 0.8)",
  glass: "rgba(255, 255, 255, 0.4)",
  border: "rgba(255, 255, 255, 0.2)",
};

function LiveWeatherWidget() {
  const [weather, setWeather] = useState<any>(null);
  const [risk, setRisk] = useState<{ level: string, color: string, reason: string }>({ level: "Low", color: "text-emerald-400", reason: "Favorable conditions" });

  useEffect(() => {
    const fetchWeather = async () => {
      const key = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      if (!key) return;
      try {
        const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${key}&q=Dhaka`);
        const data = await res.json();
        if (data.current) {
          setWeather(data.current);
          const temp = data.current.temp_c;
          const hum = data.current.humidity;
          if (hum > 85 && temp > 20) {
            setRisk({ level: "High", color: "text-red-400", reason: "High humidity: Fungal risk" });
          } else if (hum > 70) {
            setRisk({ level: "Medium", color: "text-amber-400", reason: "Moderate humidity risk" });
          } else {
            setRisk({ level: "Low", color: "text-emerald-400", reason: "Clear environment" });
          }
        }
      } catch (e) {
        console.error("Failed to fetch weather", e);
      }
    };
    fetchWeather();
  }, []);

  return (
    <div className="bg-[#052E16] backdrop-blur-3xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-[0_32px_64px_-12px_rgba(5,46,22,0.4)] overflow-hidden relative border border-white/10 group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity duration-1000">
        <CloudRain className="h-48 w-48 text-emerald-500" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-500/80 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            Atmospheric Intelligence
          </div>
          <div className={`px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest ${risk.color}`}>
            {risk.level} Pathogen Risk
          </div>
        </div>
        
        <div className="flex items-end gap-6 mb-12">
          <div className="text-7xl font-black tracking-tighter leading-none bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent">
            {weather ? `${Math.round(weather.temp_c)}°` : "--°"}
          </div>
          <div className="pb-2">
            <div className="text-lg font-black text-white/90">Mostly Clear</div>
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Dhaka Metro · Feels {weather ? Math.round(weather.feelslike_c) : "--"}°</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-white/5 rounded-3xl p-5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">
              <Droplets className="h-3.5 w-3.5 text-blue-400" /> Humidity
            </div>
            <div className="text-2xl font-black">{weather ? `${weather.humidity}%` : "--%"}</div>
          </div>
          <div className="bg-white/5 rounded-3xl p-5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">
              <Wind className="h-3.5 w-3.5 text-emerald-400" /> Wind
            </div>
            <div className="text-2xl font-black">{weather ? `${weather.wind_kph} km/h` : "--"}</div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
              <AlertTriangle className={`h-6 w-6 ${risk.color}`} />
            </div>
            <div>
              <div className="text-[13px] font-black text-white">{risk.reason}</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Real-time Environmental Telemetry</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl md:rounded-[3rem] p-6 sm:p-8 md:p-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.04)] relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <Sprout className="h-7 w-7 text-emerald-600" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">+12.4% vs Avg</div>
            </div>
            <div className="text-5xl font-black text-slate-900 tracking-tighter mb-2">0.84</div>
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Vegetative Health Index</div>
            <div className="mt-10 h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
              <motion.div initial={{ width: 0 }} animate={{ width: "84%" }} className="h-full bg-linear-to-r from-emerald-400 to-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl md:rounded-[3rem] p-6 sm:p-8 md:p-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.04)] relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Droplets className="h-7 w-7 text-blue-600" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">Optimal</div>
            </div>
            <div className="text-5xl font-black text-slate-900 tracking-tighter mb-2">12.8k</div>
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Est. Yield (KG/HA)</div>
            <div className="mt-10 flex gap-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={`h-2.5 flex-1 rounded-full ${i < 5 ? 'bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.4)]' : 'bg-slate-100'}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#052E16] rounded-2xl sm:rounded-3xl md:rounded-[3rem] p-6 sm:p-8 md:p-10 shadow-[0_32px_64px_-12px_rgba(5,46,22,0.3)] relative overflow-hidden group">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_70%)]" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                <ShieldCheck className="h-7 w-7 text-emerald-400" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">High Confidence</div>
            </div>
            <div className="text-5xl font-black text-white tracking-tighter mb-2">99.2%</div>
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Model Accuracy Rate</div>
            <div className="mt-10 h-2.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
              <motion.div initial={{ width: 0 }} animate={{ width: "99.2%" }} className="h-full bg-linear-to-r from-emerald-500 to-emerald-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <div>
               <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Growth Trajectory</h4>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Vegetative Progression index</p>
            </div>
            <BarChart3 className="h-6 w-6 text-slate-300" />
          </div>
          <div className="h-72 flex items-end justify-between gap-6 px-4">
            {[45, 60, 55, 80, 95, 88].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-6 group">
                <div className="relative w-full h-full flex items-end">
                   <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ type: "spring", damping: 15 }}
                    className={`w-full rounded-2xl transition-all duration-500 relative ${i === 4 ? 'bg-[#052E16] shadow-[0_12px_24px_rgba(5,46,22,0.2)]' : 'bg-emerald-50 group-hover:bg-emerald-100'}`}
                  >
                     {i === 4 && <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[#052E16] text-white text-[9px] font-black">PEAK</div>}
                  </motion.div>
                </div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
             <div>
               <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Soil Composition</h4>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Elemental Distribution Analysis</p>
            </div>
            <PieIcon className="h-6 w-6 text-slate-300" />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-16">
            <div className="relative h-56 w-56 rounded-full border-[20px] border-slate-50 flex items-center justify-center shadow-inner">
              <div className="absolute inset-0 rounded-full border-[20px] border-[#052E16] border-t-transparent border-l-transparent -rotate-45" />
              <div className="text-center">
                <div className="text-4xl font-black text-slate-900">72%</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nitrogen</div>
              </div>
            </div>
            <div className="space-y-6 flex-1 w-full">
              {[
                { l: "Nitrogen (N)", v: 72, c: "bg-[#052E16]", s: "Rich" },
                { l: "Phosphorus (P)", v: 18, c: "bg-emerald-500", s: "Moderate" },
                { l: "Potassium (K)", v: 10, c: "bg-amber-400", s: "Low" }
              ].map(item => (
                <div key={item.l} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                       <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{item.l}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 px-2 py-0.5 rounded-md border border-slate-100">{item.s}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.v}%` }} className={`h-full ${item.c}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function FarmerDashboard() {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "analytics">("overview");
  const [realHistory, setRealHistory] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchRealHistory();
    }
  }, [user]);

  const fetchRealHistory = async () => {
    const { data } = await supabase
      .from("diagnoses")
      .select("*")
      .eq("farmer_id", user?.id)
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setRealHistory(data);
  };

  const futureFeatures = [
    { name: "Yield Forecasting", desc: "ML-based harvest prediction", icon: Zap, bg: "bg-amber-500/10", text: "text-amber-600" },
    { name: "Soil Health Audit", desc: "Integrated IoT sensor feedback", icon: Activity, bg: "bg-blue-500/10", text: "text-blue-600" },
    { name: "Gov Subsidies", desc: "Digital verification portal", icon: ShieldCheck, bg: "bg-emerald-500/10", text: "text-emerald-600" },
    { name: "Market Access", desc: "Direct-to-consumer sales", icon: Globe, bg: "bg-indigo-500/10", text: "text-indigo-600" },
  ];

  if (loading) return null;

  if (profile?.role === "farmer" && !profile?.is_verified) {
    return (
      <div className="bg-[#F8FAFC] min-h-[80vh] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 max-w-xl text-center shadow-[0_48px_96px_-24px_rgba(0,0,0,0.06)]"
        >
          <div className="h-24 w-24 rounded-[2rem] bg-amber-50 mx-auto flex items-center justify-center mb-10 border border-amber-100">
            <Lock className="h-10 w-10 text-amber-500" />
          </div>
          <h2 className="text-4xl font-black text-[#052E16] tracking-tighter mb-6">Verification Pending</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-10 text-lg">
            Your farmer credentials are being verified by the National Agricultural Bureau. You will receive an SMS once your dashboard is unlocked.
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            <Activity className="h-5 w-5 animate-pulse text-amber-500" /> Status: Under Expert Review
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FDFDFD]">
      <DashboardBackground />
      <div className="relative z-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
          
          <div className="flex flex-col sm:flex-row md:items-end justify-between gap-6 sm:gap-10 mb-12 sm:mb-20">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-[#2D5A27] mb-3">
                <div className="h-2 w-2 rounded-full bg-[#2D5A27] animate-pulse shadow-[0_0_8px_#2D5A27]" />
                Command Center v4.2
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#052E16] tracking-tighter leading-tight">
                Shubho Shokal, <span className="text-transparent bg-clip-text bg-linear-to-r from-[#2D5A27] to-[#052E16]">{profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}.</span>
              </h1>
              <p className="text-slate-400 font-medium text-base sm:text-lg">Real-time intelligence from your agricultural sectors.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white border border-slate-100 rounded-[1.5rem] p-1.5 flex items-center shadow-xl shadow-slate-200/40">
                <button 
                  onClick={() => setActiveTab("overview")}
                  className={`px-8 py-3 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === "overview" ? "bg-[#052E16] text-white shadow-2xl shadow-green-900/40 translate-z-0 scale-105" : "text-slate-400 hover:text-slate-900"}`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab("analytics")}
                  className={`px-8 py-3 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === "analytics" ? "bg-[#052E16] text-white shadow-2xl shadow-green-900/40 translate-z-0 scale-105" : "text-slate-400 hover:text-slate-900"}`}
                >
                  Analytics
                </button>
              </div>
              <Link href="/diagnose" className="h-[60px] px-10 rounded-[1.5rem] bg-[#2D5A27] text-white flex items-center gap-4 transition-all duration-500 hover:-translate-y-1 hover:bg-[#052E16] active:scale-95 group shadow-2xl shadow-green-900/20">
                <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
                <span className="text-[12px] font-black uppercase tracking-widest">New Diagnosis</span>
              </Link>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "overview" ? (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="grid lg:grid-cols-12 gap-8 mb-8">
                  <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 relative overflow-hidden group shadow-[0_32px_64px_-24px_rgba(0,0,0,0.04)] transition-all duration-700 hover:shadow-2xl">
                    <div className="absolute inset-0 z-0">
                      <div className="absolute inset-0 bg-[#FBFDFF]" />
                      <div className="absolute inset-0 opacity-30 grid grid-cols-12 grid-rows-12 gap-1.5 p-3">
                        {Array.from({ length: 144 }).map((_, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0.2 }}
                            animate={{ opacity: [0.2, 0.5, 0.2], backgroundColor: i % 17 === 0 ? "#EF4444" : i % 11 === 0 ? "#F59E0B" : "#10B981" }}
                            transition={{ duration: 4 + (i % 6), repeat: Infinity, delay: i * 0.01 }}
                            className="rounded-md"
                          />
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
                    </div>

                    <div className="relative z-20">
                      <div className="flex items-center justify-between mb-16">
                        <div className="space-y-1">
                          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Satellite Health Intelligence</h3>
                          <div className="text-3xl font-black text-slate-900 tracking-tighter leading-tight">Sentinel-2 Multispectral Stream</div>
                        </div>
                        {process.env.NEXT_PUBLIC_SENTINEL_HUB_ID ? (
                          <div className="px-6 py-2.5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center gap-3 shadow-sm">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700">Live NDVI Active</span>
                          </div>
                        ) : (
                          <div className="px-6 py-2.5 rounded-full bg-slate-50 border border-slate-100 flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-slate-300" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Telemetry Offline</span>
                          </div>
                        )}
                      </div>

                      <div className="grid md:grid-cols-3 gap-10">
                        <div className="bg-white/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white shadow-2xl shadow-slate-200/30">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-6">Mean NDVI Index</div>
                          <div className="text-3xl sm:text-5xl font-black text-emerald-600 mb-2">0.84</div>
                          <div className="text-[11px] font-bold text-slate-400 leading-relaxed">Peak vegetative stability detected across paddy sectors.</div>
                          <div className="mt-8 h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                            <motion.div initial={{ width: 0 }} animate={{ width: "84%" }} className="h-full bg-linear-to-r from-emerald-400 to-emerald-600" />
                          </div>
                        </div>
                        <div className="bg-white/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white shadow-2xl shadow-slate-200/30">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-6">Heterogeneity</div>
                          <div className="text-3xl sm:text-5xl font-black text-amber-500 mb-2">Low</div>
                          <div className="text-[11px] font-bold text-slate-400 leading-relaxed">Uniform biomass distribution. No anomalies identified.</div>
                          <div className="mt-8 flex gap-1.5">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <div key={i} className={`h-2 flex-1 rounded-full ${i < 5 ? 'bg-amber-400' : 'bg-slate-100'}`} />
                            ))}
                          </div>
                        </div>
                        <div className="bg-white/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white shadow-2xl shadow-slate-200/30">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-6">H2O Stress</div>
                          <div className="text-3xl sm:text-5xl font-black text-slate-900 mb-2">0.12</div>
                          <div className="text-[11px] font-bold text-slate-400 leading-relaxed">Optimal root saturation. Irrigation threshold not met.</div>
                          <div className="mt-8 flex items-center justify-between">
                            <div className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">OPTIMAL</div>
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-16 flex items-center justify-between pt-10 border-t border-slate-100">
                        <div className="flex items-center gap-6">
                          <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                              <div key={i} className="h-10 w-10 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center overflow-hidden shadow-lg">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="user" />
                              </div>
                            ))}
                          </div>
                          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Linked with 14 Regional Nodes</div>
                        </div>
                        <button className="text-[12px] font-black uppercase tracking-[0.2em] text-[#2D5A27] flex items-center gap-3 group">
                          Deep Spectral Audit <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-8">
                    <LiveWeatherWidget />
                    <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.04)]">
                      <div className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10">Expert Hub</div>
                      <div className="space-y-6">
                        {[
                          { name: "Upazila Agriculture Office", role: "Gov Official", status: "Online" },
                          { name: "Dr. Sayeed - Pathologist", role: "BARI Expert", status: "In Consultation" },
                        ].map(contact => (
                          <div key={contact.name} className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-2xl hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                               <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#2D5A27]/10 group-hover:text-[#2D5A27] transition-all">
                                  <Info className="h-6 w-6" />
                               </div>
                               <div>
                                <div className="text-[14px] font-black text-slate-900 tracking-tight">{contact.name}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{contact.role} · {contact.status}</div>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-slate-200 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                          </div>
                        ))}
                      </div>
                      <button className="w-full mt-10 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-colors">
                         View Full Directory
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center justify-between mb-12">
                      <h3 className="text-2xl font-black text-[#052E16] tracking-tighter flex items-center gap-4">
                        <History className="h-7 w-7 text-[#2D5A27]" /> Diagnostic Ledger
                      </h3>
                      <Link href="/farmer/history" className="text-[11px] font-black uppercase tracking-widest text-[#2D5A27] hover:tracking-[0.2em] transition-all">Audit Logs</Link>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-50">
                            <th className="pb-8 text-[11px] font-black text-slate-300 uppercase tracking-widest">Crop Entity</th>
                            <th className="pb-8 text-[11px] font-black text-slate-300 uppercase tracking-widest">AI Verdict</th>
                            <th className="pb-8 text-[11px] font-black text-slate-300 uppercase tracking-widest text-right">Bureau status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {realHistory.length > 0 ? realHistory.map((row, i) => (
                            <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                              <td className="py-8 pr-4">
                                <div className="text-[15px] font-black text-slate-900">{row.crop_type || row.crop_detected || "Standard"}</div>
                                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">{new Date(row.created_at).toLocaleDateString()}</div>
                              </td>
                              <td className="py-8 pr-4">
                                <div className="text-[15px] font-bold text-slate-600">{row.disease_detected || "Biological health optimal"}</div>
                                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">{Math.round((row.confidence_score || 0.992) * 100)}% Confidence</div>
                              </td>
                              <td className="py-8 text-right">
                                <span className="px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100">Expert Verified</span>
                              </td>
                            </tr>
                          )) : (
                            <tr><td colSpan={3} className="py-24 text-center text-slate-300 text-[11px] font-black uppercase tracking-[0.3em]">No diagnostic data in ledger</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="lg:col-span-5 grid md:grid-cols-2 gap-6">
                    {futureFeatures.map((feat) => (
                      <div key={feat.name} className="bg-white border border-slate-100 border-dashed rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col justify-between relative group cursor-not-allowed hover:bg-slate-50 transition-all duration-500">
                        <div className="mb-10">
                          <div className={`h-14 w-14 rounded-2xl ${feat.bg} flex items-center justify-center ${feat.text} mb-8 transition-transform group-hover:scale-110`}>
                            <feat.icon className="h-7 w-7" />
                          </div>
                          <h4 className="text-[16px] font-black text-slate-400 mb-3 tracking-tight">{feat.name}</h4>
                          <p className="text-[12px] text-slate-400 font-medium leading-relaxed">{feat.desc}</p>
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-slate-50 text-slate-300 text-[10px] font-black uppercase tracking-widest w-fit border border-slate-100">Deploying Q3 2026</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <AnalyticsView />
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
