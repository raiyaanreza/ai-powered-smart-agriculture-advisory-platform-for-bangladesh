"use client";
import { motion } from "framer-motion";
import { Users, TrendingUp, Leaf, Bell, Award } from "lucide-react";

const STATS = [
  { value: "50,000+", label: "Active Farmers",  icon: Users,      sub: "Across 64 districts" },
  { value: "99.2%",   label: "AI Accuracy",     icon: TrendingUp, sub: "Verified by BARI" },
  { value: "64",      label: "Districts",        icon: Leaf,       sub: "Full national coverage" },
  { value: "1.2M",    label: "Alerts Sent",      icon: Bell,       sub: "Disease warnings" },
];

const METRICS = [
  { label: "Crop Yield Improvement",  value: 87, color: "#2D5A27" },
  { label: "Disease Early Detection", value: 94, color: "#EAB308" },
  { label: "Farmer Cost Reduction",   value: 63, color: "#3B82F6" },
];

const GoldText = ({ children }: { children: React.ReactNode }) => (
  <span style={{
    background: "linear-gradient(135deg, #EAB308, #D97706)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  }}>
    {children}
  </span>
);

export function Impact() {
  return (
    <section
      id="stats"
      className="py-24 sm:py-32 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1A321A 0%, #2D5A27 60%, #214020 100%)" }}
    >
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 pointer-events-none"
           style={{
             backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
             backgroundSize: "40px 40px",
           }} />

      {/* Gold blob */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-10"
           style={{ background: "radial-gradient(circle, #EAB308, transparent 70%)", transform: "translate(30%, -30%)" }} />

      <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] mb-4"
            style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <Award className="h-3 w-3" />
            Our Impact
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-3xl sm:text-4xl font-black tracking-tight text-white"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Transforming agriculture{" "}
            <GoldText>across Bangladesh</GoldText>
          </motion.h2>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl p-6 text-center"
              style={{
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <s.icon className="h-6 w-6 mx-auto mb-3 opacity-50 text-green-300" />
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                {s.label}
              </div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.28)" }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Progress bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-7 sm:p-10"
          style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-7"
             style={{ color: "rgba(255,255,255,0.35)" }}>
            Average outcomes vs. traditional methods
          </p>
          <div className="space-y-5">
            {METRICS.map((m, i) => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>{m.label}</span>
                  <span className="text-sm font-black text-white">{m.value}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ background: m.color, width: 0 }}
                    whileInView={{ width: `${m.value}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.9, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
