"use client";
import { Download, Phone, ShieldCheck, Beaker, Leaf, RotateCcw, AlertTriangle, CheckCircle2, Activity, Microscope } from "lucide-react";
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

const severityConfig: Record<string, { color: string; bg: string; border: string; icon: any; label: string }> = {
  High:   { color: "text-red-600 dark:text-red-400",   bg: "bg-red-50 dark:bg-red-950/20",    border: "border-red-200 dark:border-red-900/30",   icon: AlertTriangle,  label: "HIGH RISK" },
  Medium: { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/20",  border: "border-amber-200 dark:border-amber-900/30", icon: Activity,       label: "MODERATE" },
  Low:    { color: "text-emerald-600 dark:text-emerald-450", bg: "bg-emerald-50 dark:bg-emerald-950/20", border: "border-emerald-200 dark:border-emerald-900/30", icon: CheckCircle2, label: "LOW RISK" },
};

export function ResultDisplay({ result, image, onReset }: ResultDisplayProps) {
  const sev = severityConfig[result.severity] ?? severityConfig.Medium;
  const SevIcon = sev.icon;
  const confidencePct = Math.round((result.confidence || 0) * 100);
  const isHealthy = result.disease?.toLowerCase().includes("healthy");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl sm:rounded-3xl overflow-hidden bg-card border border-border shadow-2xl dark:shadow-black/50"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-earth-900 to-earth-700 dark:from-emerald-950 dark:to-emerald-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center">
            <Microscope className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">AgriVision AI</div>
            <div className="text-sm font-black text-white">Diagnosis Report</div>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${sev.bg} ${sev.border} border`}>
          <SevIcon className={`h-3.5 w-3.5 ${sev.color}`} />
          <span className={`text-[9px] font-black uppercase tracking-widest ${sev.color}`}>{sev.label}</span>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid lg:grid-cols-12 gap-8">

          {/* Left: Image + confidence ring */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden aspect-square border-2 border-border shadow-lg">
              {image && <img src={image} alt="Uploaded crop" className="w-full h-full object-cover" />}
              {/* Overlay badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div className="px-2 py-1 rounded-lg bg-black/50 backdrop-blur-md text-[9px] font-mono text-white/90">
                  USER_UPLOAD
                </div>
                <div className="px-2 py-1 rounded-lg bg-earth-700/80 dark:bg-emerald-600/80 backdrop-blur-md text-[9px] font-bold text-white">
                  AI ANALYZED
                </div>
              </div>
            </div>

            {/* Confidence bar */}
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Confidence</span>
                <span className="text-lg font-black text-slate-900 dark:text-slate-100">{confidencePct}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${confidencePct >= 80 ? 'bg-emerald-500' : confidencePct >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${confidencePct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  role="progressbar"
                  aria-valuenow={confidencePct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`AI confidence: ${confidencePct}%`}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[8px] text-slate-300 dark:text-slate-650 font-bold">0%</span>
                <span className="text-[8px] text-slate-300 dark:text-slate-655 font-bold">100%</span>
              </div>
              <div className="mt-2 text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                {confidencePct >= 80 ? 'High confidence diagnosis' : confidencePct >= 60 ? 'Moderate confidence - consider expert review' : 'Low confidence - expert review recommended'}
              </div>
            </div>

            <button
              onClick={onReset}
              className="flex items-center justify-center gap-2 text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 hover:text-earth-700 dark:hover:text-emerald-450 hover:bg-slate-50 dark:hover:bg-slate-800/50 py-2 rounded-xl transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Upload Different Image
            </button>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Disease name */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Crop</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black">{result.crop}</span>
              </div>
              <h2 className={`text-3xl font-black tracking-tighter leading-tight ${isHealthy ? 'text-emerald-705 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                {isHealthy ? '✓ Healthy Plant' : result.disease}
              </h2>
              {result.pathogen && (
                <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <Beaker className="h-3 w-3 text-slate-450 dark:text-slate-500" />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 italic">{result.pathogen}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {result.description && (
              <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed border-l-2 border-primary/30 pl-3">
                {result.description}
              </p>
            )}

            {/* Treatment grid */}
            {!isHealthy && (
              <div className="grid md:grid-cols-2 gap-4">
                {/* English */}
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Beaker className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Treatment (EN)</span>
                  </div>
                  <ul className="space-y-2">
                    {(result.treatment_en || []).map((step, i) => (
                      <li key={i} className="flex gap-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-350">
                        <span className="h-4 w-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[8px] font-black flex-shrink-0 mt-0.5">{i+1}</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bangla */}
                <div className="rounded-2xl bg-green-50/40 dark:bg-emerald-950/20 border border-green-100/30 dark:border-emerald-900/30 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Leaf className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-450" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">চিকিৎসা (BN)</span>
                  </div>
                  <ul className="space-y-2">
                    {(result.treatment_bn || []).map((step, i) => (
                      <li key={i} className="flex gap-2 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                        <span className="h-4 w-4 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-[8px] font-black flex-shrink-0 mt-0.5">{i+1}</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Prevention */}
            {result.prevention && (
              <div className="flex items-start gap-3 rounded-2xl bg-amber-50/30 dark:bg-amber-955/10 border border-amber-100/40 dark:border-amber-900/20 p-4">
                <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-450 mb-1">Prevention Tip</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed">{result.prevention}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
              <button className="h-10 px-6 rounded-xl border border-border text-xs font-bold text-slate-705 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Download className="h-3.5 w-3.5" />
                Download PDF Report
              </button>
              <button className="h-10 px-6 rounded-xl bg-linear-to-br from-earth-700 to-earth-500 dark:from-emerald-600 dark:to-emerald-400 text-white dark:text-slate-950 text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md">
                <Phone className="h-3.5 w-3.5" />
                Talk to Local Expert
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
