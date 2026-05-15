"use client";
import { motion } from "framer-motion";
import { Eye, ArrowLeft, Beaker, ShieldCheck, Leaf, AlertTriangle, ScanLine, CheckCircle2 } from "lucide-react";
import { Disease } from "../data/diseases";

interface LibraryGridProps {
  diseases: Disease[];
  onView: (d: Disease) => void;
}

export function LibraryGrid({ diseases, onView }: LibraryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {diseases.map((disease, i) => (
        <motion.div
          key={disease.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -8, scale: 1.01 }}
          transition={{ delay: i * 0.03, type: "spring", stiffness: 140, damping: 18 }}
          className="bg-white/90 backdrop-blur-xl rounded-4xl overflow-hidden border border-slate-100 shadow-sm flex flex-col group hover:shadow-2xl transition-all duration-500"
        >
          <div className="relative aspect-16/10 overflow-hidden bg-slate-50">
            <img 
              src={disease.image} 
              alt={disease.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
            <div className="absolute top-4 left-4">
               <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg ${
                 disease.severity === 'High' ? 'bg-[#B91C1C] text-white' : 
                 disease.severity === 'Medium' ? 'bg-[#9A3412] text-white' : 
                 'bg-[#1D4ED8] text-white'
               }`}>
                 {disease.severity}
               </span>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-lg font-black text-slate-900 leading-tight mb-1 font-bn">{disease.nameBn}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{disease.name}</p>

            <div className="space-y-1.5 mb-6">
                {(disease.symptoms || []).slice(0, 2).map((s, idx) => (
                  <div key={idx} className="text-[12px] text-slate-500 font-medium flex items-start gap-2 font-bn leading-tight">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                    {s}
                  </div>
                ))}
            </div>

            <button 
              onClick={() => onView(disease)}
              className="mt-auto w-full py-3.5 rounded-xl bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-green-950 hover:text-white transition-all active:scale-95"
            >
              বিস্তারিত তথ্য
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

interface LibraryDetailsProps {
  disease: Disease;
  onBack: () => void;
}

export function LibraryDetails({ disease, onBack }: LibraryDetailsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden"
    >
      <div className="p-8 md:p-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-green-950 transition-all mb-10"
        >
          <ArrowLeft className="h-4 w-4" /> BACK TO LIBRARY
        </button>

        {/* Hero Section with Header Image */}
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 border-4 border-slate-50 group">
          <img src={disease.image} alt={disease.name} className="w-full h-100 object-cover" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/30" />
          <div className="absolute top-6 left-6">
             <span className={`px-5 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl ${
               disease.severity === 'High' ? 'bg-[#B91C1C]' : 
               disease.severity === 'Medium' ? 'bg-[#9A3412]' : 
               'bg-[#1D4ED8]'
             }`}>
                <AlertTriangle className="h-4 w-4" /> {disease.severity} SEVERITY
             </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* Left Column (Exact Spacing and Headers) */}
          <div className="lg:col-span-8">
            <div className="flex items-start justify-between mb-16">
               <div>
                  <h1 className="text-6xl font-black text-green-950 tracking-tighter mb-2">{disease.name}</h1>
                  <p className="text-xl font-bold text-slate-300 font-bn">{disease.nameBn}</p>
               </div>
               <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-green-950 text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-green-950/20 active:scale-95 transition-all">
                  <ScanLine className="h-5 w-5 text-green-400" /> AI Diagnosis
               </button>
            </div>

            <div className="space-y-16">
               <section>
                  <div className="flex items-center gap-4 mb-8 opacity-40">
                     <div className="h-px w-12 bg-slate-400" />
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">রোগ সম্পর্কে তথ্য</span>
                  </div>
                  <p className="text-[18px] text-slate-700 leading-[1.8] font-medium font-bn bg-slate-50 p-8 rounded-4xl border border-slate-100 shadow-sm">
                     {disease.description}
                  </p>
               </section>

               <section>
                  <div className="flex items-center gap-4 mb-8 opacity-40">
                     <div className="h-px w-12 bg-slate-400" />
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">লক্ষণসমূহ (SYMPTOMS)</span>
                  </div>
                  <div className="space-y-6">
                     {(disease.symptoms || []).map((s, idx) => (
                       <div key={idx} className="flex gap-6 items-start">
                          <div className="h-3 w-3 rounded-full bg-green-800 mt-2 shrink-0" />
                          <p className="text-[17px] text-slate-600 leading-relaxed font-medium font-bn">{s}</p>
                       </div>
                     ))}
                  </div>
               </section>
            </div>
          </div>

          {/* Right Column (Sidebar Cards) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Management Card (Green) */}
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="p-10 rounded-[2.5rem] bg-earth-700 text-white shadow-2xl shadow-green-950/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.2),transparent_28%)]" />
               <div className="flex items-center gap-3 mb-8">
                  <ShieldCheck className="h-6 w-6 text-gold-500" />
                  <span className="text-[12px] font-black text-green-200 uppercase tracking-[0.3em]">প্রতিকার ও ব্যবস্থাপনা</span>
               </div>
               
              <div className="space-y-8 relative z-10">
                  {(disease.management || []).map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                       <CheckCircle2 className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
                       <p className="text-[16px] text-green-50/90 leading-[1.6] font-medium font-bn">
                          {step}
                       </p>
                    </div>
                  ))}
               </div>

              <div className="mt-12 p-6 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm relative z-10">
                  <p className="text-[13px] font-medium text-green-100/70 italic font-bn">
                    * আক্রান্ত গাছ থেকে রোগ অন্য গাছে ছড়িয়ে পড়া রোধ করতে দ্রুত ব্যবস্থা নিন।
                  </p>
               </div>
            </motion.div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
