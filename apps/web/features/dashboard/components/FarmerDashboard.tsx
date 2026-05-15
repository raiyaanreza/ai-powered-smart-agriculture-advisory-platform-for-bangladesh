"use client";
import { motion } from "framer-motion";
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
  Search
} from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { DashboardBackground } from "./DashboardBackground";

export function FarmerDashboard() {
  const { user, profile, loading } = useAuth();
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
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false })
      .limit(3);
    
    if (data) setRealHistory(data);
  };
  
  const futureFeatures = [
    { name: "Satellite Monitoring", desc: "Daily NDVI vegetation index maps", icon: Lock },
    { name: "Yield Forecasting", desc: "ML-based harvest prediction", icon: Lock },
    { name: "Soil Health Audit", desc: "Integrated IoT sensor feedback", icon: Lock },
    { name: "Gov Subsidies", desc: "Digital verification portal", icon: Lock },
  ];

  if (loading) return null;

  if (profile?.role === "farmer" && !profile?.is_verified) {
    return (
      <div className="bg-[#F8FAFC] min-h-[80vh] flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 max-w-xl text-center shadow-2xl shadow-slate-200/50">
          <div className="h-20 w-20 rounded-full bg-amber-50 mx-auto flex items-center justify-center mb-6">
            <Lock className="h-8 w-8 text-amber-500" />
          </div>
          <h2 className="text-3xl font-black text-[#1A2E1A] tracking-tighter mb-4">Pending Verification</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-8">
            Your farmer application has been submitted and is currently under review by our administrative team. You will be notified once your account is activated.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Activity className="h-4 w-4 animate-pulse" /> Review in progress
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <DashboardBackground />
      <div className="relative z-10">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-[#2D5A27] mb-2">
               <div className="h-1.5 w-1.5 rounded-full bg-[#2D5A27] animate-pulse" />
               Operational Dashboard
            </div>
            <h1 className="text-5xl font-black text-[#1A2E1A] tracking-tighter">Welcome, {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}.</h1>
            <p className="text-slate-500 font-medium">Monitoring activity across your agricultural sectors.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl p-1 flex items-center shadow-2xl">
                <button className="px-5 py-2.5 rounded-xl bg-[#052E16] text-white text-[12px] font-black uppercase tracking-widest shadow-lg shadow-green-900/10">
                   Overview
                </button>
                <button className="px-5 py-2.5 rounded-xl text-slate-400 text-[12px] font-black uppercase tracking-widest hover:text-slate-900 transition-colors">
                   Analytics
                </button>
             </div>
             <Link href="/diagnose" className="h-[52px] px-8 rounded-2xl bg-[#2D5A27] text-white flex items-center gap-3 hover:bg-[#1A321A] transition-all group shadow-xl shadow-green-900/10">
                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                <span className="text-[11px] font-black uppercase tracking-widest">New Diagnosis</span>
             </Link>
          </div>
        </div>

        {/* Operational Bento Grid */}
        <div className="grid lg:grid-cols-12 gap-6 mb-8">
          
          {/* Primary Health Metric */}
          <div className="lg:col-span-8 bg-white/70 backdrop-blur-lg border border-white/30 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-xl hover:shadow-2xl hover:shadow-white/20 transition-all duration-500">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
               <Activity className="h-48 w-48 text-slate-900" />
            </div>
            
            <div className="relative z-10">
               <div className="flex items-center justify-between mb-12">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Live Crop Health</h3>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-[#2D5A27] text-[10px] font-black border border-green-100 uppercase tracking-widest">
                     <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                     Stable Condition
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-16">
                  <div>
                     <div className="text-7xl font-black text-[#1A2E1A] tracking-tighter mb-4">94%</div>
                     <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">Average vegetation health index across all active paddy and tomato sectors.</p>
                     
                     <div className="space-y-4">
                        {[
                          { label: "Chlorophyll Saturation", val: 88 },
                          { label: "Stem Stability", val: 92 },
                        ].map(item => (
                          <div key={item.label} className="space-y-2">
                             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>{item.label}</span>
                                <span>{item.val}%</span>
                             </div>
                             <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.val}%` }}
                                  className="h-full bg-[#2D5A27]"
                                />
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                        <div className="text-2xl font-black text-slate-900 mb-1">12.4k</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estimated Yield (kg)</div>
                     </div>
                     <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                        <div className="text-2xl font-black text-slate-900 mb-1">0.42</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pest Probability</div>
                     </div>
                     <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                        <div className="text-2xl font-black text-slate-900 mb-1">84%</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Soil Moisture</div>
                     </div>
                     <div className="p-6 rounded-3xl bg-[#052E16] text-white">
                        <ArrowUpRight className="h-5 w-5 mb-4 text-green-400" />
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Full Report</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Regional Risk & Weather */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-10 text-white shadow-2xl overflow-hidden relative border border-white/10">
               <div className="absolute top-0 right-0 p-8 opacity-20">
                  <CloudRain className="h-20 w-20" />
               </div>
               <div className="relative z-10">
                  <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Environment</div>
                  <div className="text-5xl font-black mb-2 tracking-tighter">32°C</div>
                  <div className="flex items-center gap-4 text-slate-400 text-sm font-medium mb-10">
                     <span className="flex items-center gap-1"><CloudRain className="h-4 w-4" /> 12%</span>
                     <span className="flex items-center gap-1"><Wind className="h-4 w-4" /> 8km/h</span>
                  </div>
                  
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                     <div className="flex items-center gap-3 text-red-400 text-[11px] font-black uppercase tracking-widest mb-3">
                        <AlertTriangle className="h-4 w-4" /> Heavy Rain Expected
                     </div>
                     <p className="text-xs text-slate-400 leading-relaxed">Consider delaying fertilizer application for the next 48 hours to prevent runoff.</p>
                  </div>
               </div>
            </div>

            <div className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-[2.5rem] p-10 shadow-xl">
               <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Quick Contacts</div>
               <div className="space-y-4">
                  {[
                    { name: "Upazila Agriculture Office", role: "Government Official" },
                    { name: "Dr. Ahmed - Senior Pathologist", role: "Primary Expert" },
                  ].map(contact => (
                    <div key={contact.name} className="flex items-center justify-between group cursor-pointer">
                       <div>
                          <div className="text-[13px] font-black text-slate-900 group-hover:text-[#2D5A27] transition-colors">{contact.name}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{contact.role}</div>
                       </div>
                       <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-slate-900 transition-colors" />
                    </div>
                  ))}
               </div>
            </div>
          </div>

        </div>

        {/* History & Future Features */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* History Section */}
          <div className="lg:col-span-7 bg-white/70 backdrop-blur-lg border border-white/30 rounded-[2.5rem] p-10 shadow-xl overflow-hidden">
             <div className="flex items-center justify-between mb-10">
                <h3 className="text-lg font-black text-[#1A2E1A] tracking-tight flex items-center gap-3">
                   <History className="h-5 w-5 text-[#2D5A27]" /> Diagnostic History
                </h3>
                <Link href="/farmer/history" className="text-[10px] font-black uppercase tracking-widest text-[#2D5A27] hover:underline">View Ledger</Link>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-50">
                       <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Crop Unit</th>
                       <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Finding</th>
                       <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                       <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Expert Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {realHistory.length > 0 ? realHistory.map((row, i) => (
                      <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-6 pr-4">
                           <div className="text-[13px] font-black text-slate-900">{row.crop}</div>
                        </td>
                        <td className="py-6 pr-4">
                           <div className="text-[13px] font-bold text-slate-500">{row.disease}</div>
                        </td>
                        <td className="py-6 pr-4">
                           <div className="text-[12px] font-medium text-slate-400 flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5" /> {new Date(row.created_at).toLocaleDateString()}
                           </div>
                        </td>
                        <td className="py-6 text-right">
                           <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${row.confidence > 0.9 ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'}`}>
                              {row.confidence > 0.9 ? 'Verified' : 'Reviewing'}
                           </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No recent diagnoses found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>

          {/* Future Options - Coming Soon */}
          <div className="lg:col-span-5 grid md:grid-cols-2 gap-6">
            {futureFeatures.map((feat) => (
              <div 
                key={feat.name}
                className="bg-white/40 border border-slate-200 border-dashed rounded-[2rem] p-8 flex flex-col justify-between relative group cursor-not-allowed hover:bg-white transition-all duration-300"
              >
                <div className="mb-8">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-6 group-hover:bg-[#2D5A27]/5 transition-colors">
                    <feat.icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-[14px] font-black text-slate-400 mb-2">{feat.name}</h4>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{feat.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                   <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest border border-slate-200">
                      Coming Soon
                   </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        </div>
        </div>
      </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
