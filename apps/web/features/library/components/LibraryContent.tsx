"use client";
import { motion } from "framer-motion";
import { Eye, ArrowLeft, Beaker, ShieldCheck, Leaf, AlertTriangle, ScanLine, CheckCircle2 } from "lucide-react";
import Image from "next/image";
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -10, scale: 1.02 }}
          transition={{ delay: i * 0.03, type: "spring", stiffness: 120, damping: 14 }}
          className="bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-slate-100/80 shadow-md flex flex-col group hover:shadow-[0_25px_60px_-15px_rgba(5,46,22,0.12)] transition-all duration-500 relative"
        >
          {/* Card Border Highlight Glow */}
          <div className="absolute inset-0 rounded-[2rem] border-2 border-transparent group-hover:border-green-800/10 pointer-events-none transition-all duration-500" />
          
          <div className="relative aspect-[16/10.5] overflow-hidden bg-slate-50">
            <Image 
              src={disease.image} 
              alt={disease.name} 
              width={400}
              height={250}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" 
              loading="lazy"
            />
            {/* Elegant glassmorphic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="absolute top-4 left-4">
               <motion.span 
                 whileHover={{ scale: 1.05 }}
                 className={`px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl backdrop-blur-md ${
                   disease.severity === 'High' ? 'bg-red-600/90 text-white' : 
                   disease.severity === 'Medium' ? 'bg-amber-600/90 text-white' : 
                   'bg-blue-600/90 text-white'
                 }`}
               >
                 <AlertTriangle className="h-3.5 w-3.5 animate-pulse" /> {disease.severity}
               </motion.span>
            </div>

            {/* Glowing ring animation on card hover */}
            <div className="absolute inset-0 bg-radial-gradient(circle_at_center, rgba(234,179,8,0.1) 0%, transparent 70%) opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>

          <div className="p-7 flex-1 flex flex-col relative z-10">
            <h3 className="text-xl font-black text-slate-900 leading-snug mb-1 font-bn group-hover:text-green-950 transition-colors duration-300">{disease.nameBn}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">{disease.name}</p>

            <div className="space-y-2 mb-6 flex-1">
                {(disease.symptoms || []).slice(0, 2).map((s, idx) => (
                  <div key={idx} className="text-[13px] text-slate-500 font-semibold flex items-start gap-2.5 font-bn leading-relaxed">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-700/60 mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                    {s}
                  </div>
                ))}
            </div>

            <button 
              onClick={() => onView(disease)}
              className="w-full py-4 rounded-2xl bg-slate-50 hover:bg-green-950 text-slate-800 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all duration-300 active:scale-98 shadow-sm group-hover:shadow-md flex items-center justify-center gap-2"
            >
              বিস্তারিত তথ্য
              <motion.span 
                className="inline-block"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              >
                
              </motion.span>
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
      className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-100 shadow-2xl overflow-hidden"
    >
      <div className="p-6 sm:p-8 md:p-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-green-950 transition-all mb-6 sm:mb-10"
        >
          <ArrowLeft className="h-4 w-4" /> BACK TO LIBRARY
        </button>

        {/* Hero Section with Header Image */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl mb-8 sm:mb-12 border-4 border-slate-50 group">
          <Image src={disease.image} alt={disease.name} width={800} height={400} className="w-full h-100 object-cover" loading="lazy" />
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
