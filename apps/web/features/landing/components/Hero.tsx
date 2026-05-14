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

const GreenGradientText = ({ children }: { children: React.ReactNode }) => (
  <span style={{
    background: "linear-gradient(135deg, #2D5A27 0%, #3D9150 50%, #2D7A3E 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    position: "relative",
    display: "inline",
  }}>
    {children}
  </span>
);

export function Hero() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{
        /* Light hero: soft green-to-white-to-warm gradient with subtle grid */
        background: `
          linear-gradient(rgba(45,90,39,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(45,90,39,0.035) 1px, transparent 1px),
          linear-gradient(160deg, #EEF7EF 0%, #FAFAFA 45%, #FDFCF0 100%)
        `,
        backgroundSize: "40px 40px, 40px 40px, 100% 100%",
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(45,90,39,0.10) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(234,179,8,0.12) 0%, transparent 70%)" }} />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-10 items-center">

          {/* ── Left: Copy ── */}
          <div className="text-center lg:text-left">

            {/* Pill label */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 rounded-full mb-6 text-[10px] font-black uppercase tracking-[0.14em]"
              style={{
                padding: "6px 14px",
                background: "rgba(45,90,39,0.07)",
                color: "#2D5A27",
                border: "1px solid rgba(45,90,39,0.16)",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "#2D5A27" }} />
              National AI Infrastructure · Bangladesh
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-black leading-[1.06] tracking-tighter text-slate-900 mb-5"
              style={{
                fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
                textWrap: "balance",
              } as React.CSSProperties}
            >
              Protect Your Crops with{" "}
              <span className="relative inline-block">
                <GreenGradientText>Instant AI</GreenGradientText>
                {/* Underline squiggle */}
                <svg className="absolute -bottom-1 left-0 w-full" style={{ height: "6px", opacity: 0.45 }} viewBox="0 0 200 6" preserveAspectRatio="none">
                  <path d="M0,3 Q50,0 100,3 Q150,6 200,3" stroke="#2D5A27" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </span>{" "}
              Diagnosis
            </motion.h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-lg leading-relaxed mb-3 max-w-xl mx-auto lg:mx-0"
              style={{ color: "#475569" }}
            >
              Upload a photo of your affected crop. Get an expert-verified treatment
              plan in Bangla within seconds — completely free.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32 }}
              className="text-base font-semibold mb-8 max-w-xl mx-auto lg:mx-0"
              style={{ color: "#2D5A27" }}
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
                className="group flex items-center gap-2 rounded-xl text-sm font-bold text-white transition-all duration-250 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
                style={{
                  height: "48px", padding: "0 28px",
                  background: "linear-gradient(135deg, #2D5A27, #3D9150)",
                  boxShadow: "0 4px 18px rgba(45,90,39,0.38)",
                }}
              >
                <Camera className="h-4 w-4" />
                Start Free Diagnosis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="#how-it-works"
                className="flex items-center gap-2 rounded-xl text-sm font-bold text-slate-700 transition-all duration-200 hover:bg-slate-100 w-full sm:w-auto justify-center"
                style={{
                  height: "48px", padding: "0 28px",
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                }}
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
                <div key={text} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#94A3B8" }}>
                  <Icon className="h-3.5 w-3.5" style={{ color: "#2D5A27" }} />
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
            <div className="absolute inset-6 rounded-3xl pointer-events-none"
                 style={{
                   background: "linear-gradient(135deg, rgba(45,90,39,0.18), rgba(234,179,8,0.12))",
                   filter: "blur(48px)",
                   opacity: 0.6,
                 }} />

            {/* Browser card */}
            <div className="relative overflow-hidden rounded-3xl"
                 style={{
                   background: "#FFFFFF",
                   border: "1px solid #E2E8F0",
                   boxShadow: "0 24px 64px rgba(0,0,0,0.09), 0 4px 16px rgba(0,0,0,0.05)",
                 }}>

              {/* Chrome bar */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-t-3xl"
                   style={{ background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
                <div className="flex gap-1.5">
                  {["#FC5753","#FDBC40","#33C748"].map(c => (
                    <div key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <div className="flex-1 flex items-center h-6 rounded-md px-3" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
                  <span className="text-[10px] font-mono" style={{ color: "#94A3B8" }}>agrivision.gov.bd/diagnose</span>
                </div>
              </div>

              <div className="p-5">
                {/* Upload zone */}
                <div className="rounded-xl p-5 text-center mb-4 cursor-pointer"
                     style={{ border: "2px dashed #CBD5E1" }}>
                  <div className="h-11 w-11 rounded-xl mx-auto mb-2.5 flex items-center justify-center"
                       style={{ background: "linear-gradient(135deg, #F1F8F2, #E0F0E3)" }}>
                    <Camera className="h-5 w-5" style={{ color: "#2D5A27" }} />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Upload crop photo</p>
                  <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>Drag & drop or tap to capture</p>
                </div>

                {/* Result */}
                <div className="rounded-xl p-4 mb-3"
                     style={{ background: "linear-gradient(135deg, #F1F8F2, #FEFCE8)", border: "1px solid #C1E2C6" }}>
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0"
                         style={{ background: "#E0F0E3" }}>
                      <ShieldCheck className="h-4.5 w-4.5" style={{ color: "#2D5A27", height:"18px", width:"18px" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-bold text-slate-800">Brown Spot Disease</p>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#E0F0E3", color: "#2D5A27" }}>
                          97.3%
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: "#64748B" }}>Paddy · Rajshahi Region</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {["Apply Copper fungicide within 48h","Improve field drainage","Monitor for 5 days"].map((tip, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs" style={{ color: "#475569" }}>
                        <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: "#2D5A27" }} />
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action */}
                <button className="w-full rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        style={{ height: "40px", background: "linear-gradient(135deg, #2D5A27, #3D9150)" }}>
                  <Sparkles className="h-4 w-4" />
                  View Full Report in Bangla
                </button>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-3 -right-3 rounded-xl px-3 py-2"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: "#22C55E" }} />
                <span className="text-xs font-bold text-slate-700">Live AI · Online</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.06 }}
              className="text-center p-5 rounded-2xl transition-shadow hover:shadow-md"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div className="font-black mb-1"
                   style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", letterSpacing: "-0.03em", color: "#2D5A27", lineHeight: 1 }}>
                {s.value}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}