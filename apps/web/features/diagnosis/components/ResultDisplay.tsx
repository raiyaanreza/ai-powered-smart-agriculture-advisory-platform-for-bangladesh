"use client";
import { Download, Phone, ShieldCheck, Beaker, Leaf, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface ResultDisplayProps {
  result: {
    crop: string;
    disease: string;
    pathogen: string;
    confidence: number;
    severity: string;
    description: string;
    treatment_en: string[];
    treatment_bn: string[];
    prevention: string;
  };
  image: string | null;
  onReset: () => void;
}

export function ResultDisplay({ result, image, onReset }: ResultDisplayProps) {
  return (
    <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl">
      
      {/* Dark Header Bar */}
      <div className="bg-[#1A321A] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-white/10 flex items-center justify-center">
             <Beaker className="h-3 w-3 text-white" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white">AI Diagnosis Report</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[9px] font-black uppercase text-red-400">Action Required</span>
        </div>
      </div>

      <div className="p-8">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Left: Image */}
          <div className="lg:col-span-4">
            <div className="relative rounded-2xl overflow-hidden aspect-square border-4 border-slate-50 group">
              {image && <img src={image} alt="Report" className="w-full h-full object-cover" />}
              <div className="absolute top-4 left-4 px-2 py-1 rounded bg-black/40 backdrop-blur-md text-[8px] font-mono text-white/80">
                 USER_UPLOAD_012
              </div>
            </div>
            
            <button 
              onClick={onReset}
              className="w-full mt-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-earth-700 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Upload Different Image
            </button>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-8">
            <div className="mb-6">
              <h2 className="text-3xl font-black text-slate-900 mb-1">{result.disease} ({result.crop})</h2>
              <div className="inline-block px-2 py-1 rounded bg-slate-100 text-[10px] text-slate-500 font-medium">
                Pathogen: <span className="italic">{result.pathogen}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* English Treatment */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Beaker className="h-4 w-4 text-earth-700" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Treatment (EN)</span>
                </div>
                <ul className="space-y-3">
                  {result.treatment_en.map((step, i) => (
                    <li key={i} className="flex gap-2 text-[11px] leading-relaxed text-slate-600">
                      <span className="text-earth-700 font-bold">•</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bangla Treatment */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Leaf className="h-4 w-4 text-earth-700" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">চিকিৎসা ব্যবস্থা (BN)</span>
                </div>
                <ul className="space-y-3">
                  {result.treatment_bn.map((step, i) => (
                    <li key={i} className="flex gap-2 text-[11px] leading-relaxed text-slate-600 font-medium">
                      <span className="text-earth-700 font-bold">•</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
              <button className="h-12 px-8 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-colors">
                <Download className="h-4 w-4" />
                Download PDF Report
              </button>
              <button className="h-12 px-8 rounded-xl bg-[#FBBF24] text-[#78350F] text-sm font-bold flex items-center gap-2 hover:scale-[1.02] transition-all shadow-lg shadow-yellow-100">
                <Phone className="h-4 w-4" />
                Talk to Local Expert
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
