"use client";
import { motion } from "framer-motion";
import { Zap, Activity, CloudRain, Smartphone, Cpu, Globe, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant AI Diagnosis",
    desc: "Sub-second disease detection using YOLOv8 models fine-tuned on Bangladeshi crop varieties and local pathogen datasets.",
    bgClass: "bg-green-50 dark:bg-emerald-950/40",
    borderClass: "border-green-200 dark:border-emerald-800/30",
    textClass: "text-earth-705 text-green-700 dark:text-emerald-400",
    tag: "Core Feature",
  },
  {
    icon: Activity,
    title: "Bangla Advisory Engine",
    desc: "Treatment plans generated in native Bangla, tailored to your soil type, season, and nearest agronomist center.",
    bgClass: "bg-amber-50 dark:bg-amber-955/20",
    borderClass: "border-amber-200 dark:border-amber-800/30",
    textClass: "text-amber-800 dark:text-amber-400",
    tag: "Localized",
  },
  {
    icon: CloudRain,
    title: "Regional Disease Alerts",
    desc: "Hyper-local weather risk maps and early outbreak warnings push-delivered before damage spreads to your district.",
    bgClass: "bg-blue-50 dark:bg-blue-955/20",
    borderClass: "border-blue-200 dark:border-blue-800/30",
    textClass: "text-blue-800 dark:text-blue-400",
    tag: "Real-time",
  },
  {
    icon: Smartphone,
    title: "Offline-First Design",
    desc: "Full diagnosis capability on slow 2G/3G networks. Syncs automatically when connectivity is restored.",
    bgClass: "bg-emerald-50 dark:bg-emerald-955/20",
    borderClass: "border-emerald-200 dark:border-emerald-800/30",
    textClass: "text-emerald-800 dark:text-emerald-400",
    tag: "Inclusive",
  },
  {
    icon: Cpu,
    title: "Multi-Agent AI Engine",
    desc: "Specialized AI agents for pest detection, nutrient analysis, yield prediction, and crop calendar management.",
    bgClass: "bg-purple-50 dark:bg-purple-955/20",
    borderClass: "border-purple-200 dark:border-purple-800/30",
    textClass: "text-purple-800 dark:text-purple-400",
    tag: "Advanced",
  },
  {
    icon: Globe,
    title: "National Monitoring",
    desc: "Live disease heatmaps for government officials. Track regional outbreaks and enforce agricultural policy in real-time.",
    bgClass: "bg-cyan-50 dark:bg-cyan-955/20",
    borderClass: "border-cyan-200 dark:border-cyan-800/30",
    textClass: "text-cyan-800 dark:text-cyan-400",
    tag: "Government",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-section-alt transition-colors duration-200">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] mb-4 bg-earth-700/10 dark:bg-emerald-500/10 text-earth-700 dark:text-emerald-400 border border-earth-700/20 dark:border-emerald-500/20"
          >
            Platform Capabilities
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4 text-balance"
          >
            Everything a farmer needs.{" "}
            <span className="text-gradient">Nothing they don&apos;t.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-base leading-relaxed text-slate-500 dark:text-slate-400"
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
              className="group cursor-default flex flex-col gap-4 rounded-2xl p-6 transition-all duration-300 bg-card border border-border hover:translate-y-[-2px] hover:shadow-lg dark:hover:shadow-emerald-950/20 hover:border-primary/45"
            >
              {/* Tag + Icon row */}
              <div className="flex items-start justify-between">
                <div className={`flex items-center justify-center w-11 h-11 rounded-xl border ${f.bgClass} ${f.borderClass}`}>
                  <f.icon className={`h-5 w-5 ${f.textClass}`} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${f.bgClass} ${f.borderClass} ${f.textClass}`}>
                  {f.tag}
                </span>
              </div>

              {/* Text */}
              <div>
                <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{f.desc}</p>
              </div>

              {/* Hover: learn more */}
              <div className={`mt-auto flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${f.textClass}`}>
                Learn more <ArrowRight className="h-3 w-3" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}