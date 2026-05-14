"use client";
import { motion } from "framer-motion";
import { Zap, Activity, CloudRain, Smartphone, Cpu, Globe, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant AI Diagnosis",
    desc: "Sub-second disease detection using YOLOv8 models fine-tuned on Bangladeshi crop varieties and local pathogen datasets.",
    color: "#2D5A27",
    bg: "#F1F8F2",
    border: "#C1E2C6",
    tag: "Core Feature",
  },
  {
    icon: Activity,
    title: "Bangla Advisory Engine",
    desc: "Treatment plans generated in native Bangla, tailored to your soil type, season, and nearest agronomist center.",
    color: "#92400E",
    bg: "#FEFCE8",
    border: "#FDE68A",
    tag: "Localized",
  },
  {
    icon: CloudRain,
    title: "Regional Disease Alerts",
    desc: "Hyper-local weather risk maps and early outbreak warnings push-delivered before damage spreads to your district.",
    color: "#1E40AF",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    tag: "Real-time",
  },
  {
    icon: Smartphone,
    title: "Offline-First Design",
    desc: "Full diagnosis capability on slow 2G/3G networks. Syncs automatically when connectivity is restored.",
    color: "#065F46",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    tag: "Inclusive",
  },
  {
    icon: Cpu,
    title: "Multi-Agent AI Engine",
    desc: "Specialized AI agents for pest detection, nutrient analysis, yield prediction, and crop calendar management.",
    color: "#5B21B6",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    tag: "Advanced",
  },
  {
    icon: Globe,
    title: "National Monitoring",
    desc: "Live disease heatmaps for government officials. Track regional outbreaks and enforce agricultural policy in real-time.",
    color: "#0E7490",
    bg: "#ECFEFF",
    border: "#A5F3FC",
    tag: "Government",
  },
];

const GradientText = ({ children }: { children: React.ReactNode }) => (
  <span style={{
    background: "linear-gradient(135deg, #2D5A27 0%, #3D9150 50%, #2D7A3E 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  }}>
    {children}
  </span>
);

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32" style={{ background: "#F8FAFC" }}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] mb-4"
            style={{ background: "rgba(45,90,39,0.07)", color: "#2D5A27", border: "1px solid rgba(45,90,39,0.16)" }}
          >
            Platform Capabilities
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-4"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Everything a farmer needs.{" "}
            <GradientText>Nothing they don&apos;t.</GradientText>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-base leading-relaxed"
            style={{ color: "#64748B" }}
          >
            Built for the realities of rural Bangladesh — from unstable internet
            to first-time smartphone users.
          </motion.p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 100 }}
              className="group cursor-default flex flex-col gap-4 rounded-2xl p-6 transition-all duration-300"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.06), 0 12px 32px rgba(45,90,39,0.07)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(45,90,39,0.22)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0";
              }}
            >
              {/* Tag + Icon row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl"
                     style={{ background: f.bg, border: `1px solid ${f.border}` }}>
                  <f.icon className="h-5 w-5" style={{ color: f.color }} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: f.bg, color: f.color, border: `1px solid ${f.border}` }}>
                  {f.tag}
                </span>
              </div>

              {/* Text */}
              <div>
                <h3 className="text-[15px] font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{f.desc}</p>
              </div>

              {/* Hover: learn more */}
              <div className="mt-auto flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                   style={{ color: f.color }}>
                Learn more <ArrowRight className="h-3 w-3" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}