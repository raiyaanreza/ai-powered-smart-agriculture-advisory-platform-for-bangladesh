"use client";
import { Navbar, Footer } from "@/features/landing/components/Layout";
import { Zap, Map, CloudSun, TrendingUp, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function PremiumServicesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="bg-[#052E16] text-white pt-24 pb-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest border border-amber-500/30 mb-6">
              <Zap className="h-3 w-3" /> Enterprise Grade
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
              AgriVision <span className="text-amber-400">Pro</span>
            </h1>
            <p className="text-green-100/60 text-lg md:text-xl font-medium max-w-2xl mx-auto">
              Unlock satellite-powered precision agriculture, hyper-local weather forecasting, and market intelligence API access.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-16 relative z-20 pb-24">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { title: "Satellite NDVI Layers", desc: "Weekly 10m resolution vegetation index maps to spot stress before it's visible.", icon: Map },
              { title: "Micro-Climate Intel", desc: "Farm-specific temperature and humidity forecasts powered by AI.", icon: CloudSun },
              { title: "Yield Prediction Models", desc: "Machine learning forecasting to optimize your harvest timeline.", icon: TrendingUp },
            ].map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center flex flex-col items-center"
              >
                <div className="h-16 w-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-6">
                  <feat.icon className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-3">{feat.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">{feat.desc}</p>
                
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300">
                  <Lock className="h-3 w-3" /> Coming Q3 2026
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-4">Want early access?</h2>
            <p className="text-slate-500 mb-8">We are currently testing these features with a select group of commercial farms.</p>
            <button className="px-8 py-4 rounded-xl bg-[#052E16] text-white font-black text-[12px] uppercase tracking-widest hover:bg-[#1A321A] transition-all shadow-xl shadow-green-950/20 active:scale-95">
              Join the Waitlist
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
