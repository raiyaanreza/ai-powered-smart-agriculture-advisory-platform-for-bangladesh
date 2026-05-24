"use client";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Sparkles, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";

const STATS = [
  { value: "50K+",  label: "Active Farmers" },
  { value: "99.2%", label: "AI Accuracy" },
  { value: "<1s",   label: "Diagnosis Time" },
  { value: "64",    label: "Districts" },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, text: "Govt. Verified" },
  { icon: Sparkles,    text: "99.2% Accurate" },
  { icon: TrendingUp,  text: "Free for Farmers" },
];

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-hero hero-grid">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full pointer-events-none bg-radial from-earth-700/10 dark:from-emerald-500/10 to-transparent" />
      <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none bg-radial from-amber-500/10 to-transparent" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-10 items-center">

          {/* ── Left: Copy ── */}
          <div className="text-center lg:text-left">

            {/* Pill label */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 rounded-full mb-6 text-[10px] font-black uppercase tracking-[0.14em] px-3.5 py-1.5 bg-earth-700/10 dark:bg-emerald-500/10 text-earth-700 dark:text-emerald-400 border border-earth-700/20 dark:border-emerald-500/20"
            >
              <span className="h-1.5 w-1.5 rounded-full animate-pulse bg-earth-700 dark:bg-emerald-400" />
              National AI Infrastructure · Bangladesh
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-black leading-[1.06] tracking-tighter text-slate-900 dark:text-white mb-5 text-[clamp(2.4rem,5vw,3.6rem)] text-balance"
            >
              Protect Your Crops with{" "}
              <span className="relative inline-block text-gradient">
                Instant AI
                {/* Underline squiggle */}
                <svg className="absolute -bottom-1 left-0 w-full text-earth-700 dark:text-emerald-400 h-[6px] opacity-45" viewBox="0 0 200 6" preserveAspectRatio="none">
                  <path d="M0,3 Q50,0 100,3 Q150,6 200,3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </span>{" "}
              Diagnosis
            </motion.h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-lg leading-relaxed mb-3 max-w-xl mx-auto lg:mx-0 text-slate-600 dark:text-slate-350"
            >
              Upload a photo of your affected crop. Get an expert-verified treatment
              plan in Bangla within seconds — completely free.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32 }}
              className="text-base font-semibold mb-8 max-w-xl mx-auto lg:mx-0 text-earth-700 dark:text-emerald-400"
            >
              ফসলের রোগ নির্ণয় করুন তাৎক্ষণিকভাবে।
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-10"
            >
              <Link
                href="/diagnose"
                className="group flex items-center gap-2 rounded-xl text-sm font-bold text-white transition-all duration-250 hover:-translate-y-0.5 w-full sm:w-auto justify-center h-12 px-7 bg-linear-to-br from-earth-700 to-earth-500 dark:from-emerald-600 dark:to-emerald-400 shadow-lg shadow-green-900/20"
              >
                <Camera className="h-4 w-4" />
                Start Free Diagnosis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="#how-it-works"
                className="flex items-center gap-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 w-full sm:w-auto justify-center h-12 px-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                See How It Works
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-5"
            >
              {TRUST_BADGES.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
                  <Icon className="h-3.5 w-3.5 text-earth-700 dark:text-emerald-400" />
                  {text}
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: App Card ── */}
          <motion.div
            initial={{ opacity: 0, x: 28, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Glow behind */}
            <div className="absolute inset-6 rounded-3xl pointer-events-none bg-linear-to-br from-earth-700/20 to-amber-500/10 blur-3xl opacity-60" />

            {/* Browser card */}
            <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/50">

              {/* Chrome bar */}
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-850 rounded-t-3xl">
                <div className="flex gap-1.5">
                  {["#FC5753","#FDBC40","#33C748"].map(c => (
                    <div key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <div className="flex-1 flex items-center h-6 rounded-md px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-550">agrivision.gov.bd/diagnose</span>
                </div>
              </div>

              <div className="p-5">
                {/* Upload zone */}
                <div className="rounded-xl p-5 text-center mb-4 cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-700">
                  <div className="h-11 w-11 rounded-xl mx-auto mb-2.5 flex items-center justify-center bg-linear-to-br from-earth-50 to-earth-100 dark:from-emerald-950 dark:to-emerald-900">
                    <Camera className="h-5 w-5 text-earth-700 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Upload crop photo</p>
                  <p className="text-xs mt-0.5 text-slate-400 dark:text-slate-500">Drag & drop or tap to capture</p>
                </div>

                {/* Result */}
                <div className="rounded-xl p-4 mb-3 bg-linear-to-br from-earth-50 to-amber-50 dark:from-emerald-950/20 dark:to-amber-950/10 border border-earth-200/50 dark:border-emerald-900/30">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-earth-100 dark:bg-emerald-900/50">
                      <ShieldCheck className="h-4.5 w-4.5 text-earth-700 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-bold text-slate-850 dark:text-slate-200">Brown Spot Disease</p>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-earth-100 dark:bg-emerald-900/50 text-earth-700 dark:text-emerald-400">
                          97.3%
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Paddy · Rajshahi Region</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {["Apply Copper fungicide within 48h","Improve field drainage","Monitor for 5 days"].map((tip, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-350">
                        <div className="h-1.5 w-1.5 rounded-full flex-shrink-0 bg-earth-700 dark:bg-emerald-400" />
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action */}
                <button className="w-full rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity h-10 bg-linear-to-br from-earth-700 to-earth-500 dark:from-emerald-600 dark:to-emerald-400 shadow-md">
                  <Sparkles className="h-4 w-4" />
                  View Full Report in Bangla
                </button>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-3 -right-3 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg"
            >
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full animate-pulse bg-emerald-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Live AI · Online</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.06 }}
              className="text-center p-3 sm:p-5 rounded-xl sm:rounded-2xl transition-all hover:shadow-md hover:border-earth-700/30 dark:hover:border-emerald-500/30 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-100/50 dark:shadow-none"
            >
              <div className="font-black mb-1 text-[clamp(1.5rem,3.5vw,2.4rem)] letter-spacing-[-0.03em] text-earth-700 dark:text-emerald-400 leading-none">
                {s.value}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}