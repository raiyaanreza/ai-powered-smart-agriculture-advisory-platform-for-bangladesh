"use client";
import { Search, X, Check, ArrowRight, Calendar, Users, AlertTriangle, CloudRain, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface LibraryHeroProps {
  onSearch: (q: string) => void;
}

export function LibraryHero({ onSearch }: LibraryHeroProps) {
  return (
    <div className="relative overflow-hidden pt-36 pb-24 px-4 bg-[#052E16]">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop" 
          className="w-full h-full object-cover"
          alt="Fields"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#052E16]/60 to-[#052E16]" />
      </div>

      <motion.div
        aria-hidden="true"
        className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-gold-500/10 blur-3xl"
        animate={{ y: [0, 18, 0], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-5xl mx-auto relative z-10 text-center border-b border-white/5 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.4em] text-earth-300 mb-8"
        >
          AgriVision Encyclopedia
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-tight"
        >
          ফসলের <span className="text-gold-400">তথ্য ভাণ্ডার</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/80 text-lg md:text-xl font-bold mb-12 max-w-xl mx-auto leading-relaxed font-bn"
        >
          সব ধরণের ফসলের রোগ ও প্রতিকার নিয়ে বিশেষজ্ঞ-অনুমোদিত তথ্য।
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-white/95 backdrop-blur-xl p-2.5 rounded-[1.25rem] shadow-2xl flex items-center gap-2 max-w-xl mx-auto border border-white/60"
        >
          <div className="flex-1 flex items-center px-4 gap-3 bg-slate-50 rounded-xl">
            <Search className="h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              onChange={(e) => onSearch(e.target.value)}
              placeholder="রোগের নাম দিয়ে খুঁজুন..."
              className="w-full py-3 text-[15px] focus:outline-none text-slate-800 font-bold placeholder:text-slate-400 font-bn bg-transparent"
            />
          </div>
          <button className="bg-[#052E16] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-green-950/20">
            খুঁজুন
          </button>
        </motion.div>
      </div>
    </div>
  );
}

interface SidebarProps {
  selectedCrops: string[];
  onToggleCrop: (c: string) => void;
  onReset: () => void;
  selectedSeverities: string[];
  onToggleSeverity: (s: string) => void;
}

export function LibrarySidebar({ selectedCrops, onToggleCrop, onReset, selectedSeverities, onToggleSeverity }: SidebarProps) {
  const CROPS = ["Rice", "Brassica"];
  
  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm backdrop-blur-xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[15px] font-black text-slate-900 tracking-tight">Filters</h3>
          <button onClick={onReset} className="text-[10px] font-black text-earth-700 uppercase tracking-widest">RESET</button>
        </div>

        <div className="space-y-8">
          <div>
            <span className="text-[11px] font-black text-slate-900 mb-5 block">Target Crops</span>
            <div className="space-y-4">
              {CROPS.map((crop) => {
                const isSelected = selectedCrops.includes(crop);
                return (
                  <button key={crop} onClick={() => onToggleCrop(crop)} className="flex items-center gap-4 w-full group">
                    <div className={`h-5 w-5 rounded-md border transition-all flex items-center justify-center ${isSelected ? 'bg-[#052E16] border-[#052E16]' : 'border-slate-200 bg-white'}`}>
                      {isSelected && <Check className="h-3 w-3 text-white stroke-[3]" />}
                    </div>
                    <span className={`text-[13px] font-bold transition-colors ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                      {crop}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-black text-slate-900 mb-5 block">Severity Levels</span>
            <div className="space-y-3">
              {[
                { id: "High", label: "High Severity", color: "text-[#B91C1C] bg-[#FEF2F2]", icon: AlertTriangle },
                { id: "Medium", label: "Medium Severity", color: "text-[#9A3412] bg-[#FFFBEB]", icon: Zap },
                { id: "Low", label: "Low Severity", color: "text-[#1D4ED8] bg-[#EFF6FF]", icon: CloudRain },
              ].map((s) => {
                const isSelected = selectedSeverities.includes(s.id);
                return (
                  <button 
                    key={s.id} 
                    onClick={() => onToggleSeverity(s.id)}
                    className={`w-full px-5 py-3.5 rounded-xl text-[11px] font-black flex items-center justify-between transition-all ${s.color} ${isSelected ? 'ring-2 ring-current ring-offset-2' : ''}`}
                  >
                    {s.label}
                    <s.icon className="h-4 w-4 opacity-40" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Seasonal Trends Section (Exact match) */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="bg-[#2D5A27] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
        <div className="flex items-center gap-3 mb-6">
           <Calendar className="h-5 w-5 text-[#EAB308]" />
           <h3 className="text-[15px] font-black tracking-tight">Seasonal Trends</h3>
        </div>
        <p className="text-[11px] text-green-100/80 font-medium leading-relaxed mb-8">Based on current regional weather patterns and the planting calendar.</p>
        
        <div className="space-y-3 mb-8">
           <div className="p-4 rounded-xl bg-white/10 border border-white/10">
              <span className="text-[9px] font-black text-[#EAB308] uppercase tracking-widest block mb-1">ALERT: RISING HUMIDITY</span>
              <p className="text-[12px] font-bold text-white">Rice Blast Risk (94%)</p>
           </div>
           <div className="p-4 rounded-xl bg-white/10 border border-white/10">
              <span className="text-[9px] font-black text-[#EAB308] uppercase tracking-widest block mb-1">NEW OUTBREAK</span>
              <p className="text-[12px] font-bold text-white">Potato Late Blight</p>
           </div>
        </div>

        <button className="w-full py-4 rounded-xl bg-[#EAB308] text-[#052E16] font-black text-[11px] uppercase tracking-widest shadow-lg shadow-gold-900/20 active:scale-95 transition-all">
          VIEW FULL REPORT
        </button>
      </motion.div>

      {/* Community Impact Section (Exact match) */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-8">
           <Users className="h-5 w-5 text-earth-700" />
           <h3 className="text-[15px] font-black text-slate-900 tracking-tight">Community Impact</h3>
        </div>
        
        <div className="space-y-6 mb-10">
           <div className="flex gap-4">
              <div className="h-2 w-2 rounded-full bg-[#854D0E] mt-1.5 flex-shrink-0" />
              <div>
                 <p className="text-[13px] font-black text-slate-900 leading-tight">12k+ Rice Blast Cases</p>
                 <p className="text-[10px] font-bold text-slate-400">Reported this month</p>
              </div>
           </div>
           <div className="flex gap-4">
              <div className="h-2 w-2 rounded-full bg-[#166534] mt-1.5 flex-shrink-0" />
              <div>
                 <p className="text-[13px] font-black text-slate-900 leading-tight">Rajshahi District</p>
                 <p className="text-[10px] font-bold text-slate-400">Most affected region</p>
              </div>
           </div>
           <div className="flex gap-4">
              <div className="h-2 w-2 rounded-full bg-[#1D4ED8] mt-1.5 flex-shrink-0" />
              <div>
                 <p className="text-[13px] font-black text-slate-900 leading-tight">5.2k Farmers Assisted</p>
                 <p className="text-[10px] font-bold text-slate-400">Through digital diagnosis</p>
              </div>
           </div>
        </div>

        <button className="text-[10px] font-black text-earth-700 uppercase tracking-widest flex items-center gap-2 group">
          VIEW LOCAL INSIGHTS <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}
