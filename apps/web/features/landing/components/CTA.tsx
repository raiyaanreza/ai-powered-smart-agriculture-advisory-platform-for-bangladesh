"use client";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Leaf, Phone } from "lucide-react";
import Link from "next/link";

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

const TIERS = [
  { icon: "🌾", title: "For Farmers",        desc: "Free forever for individual farmers in Bangladesh" },
  { icon: "🤝", title: "For Cooperatives",   desc: "Team plans available with group alert management" },
  { icon: "🏛️", title: "For Government",     desc: "Enterprise API and national monitoring dashboard" },
];

export function CTA() {
  return (
    <section className="py-24 sm:py-32" style={{ background: "#FFFFFF" }}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Main CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80 }}
          className="relative rounded-3xl overflow-hidden mb-6"
          style={{ background: "linear-gradient(135deg, #1A321A 0%, #2D5A27 55%, #3D9150 100%)" }}
        >
          {/* Grid overlay */}
          <div className="absolute inset-0 pointer-events-none"
               style={{
                 backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                 backgroundSize: "32px 32px",
               }} />
          {/* Gold glow */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
               style={{
                 background: "radial-gradient(circle, rgba(234,179,8,0.2), transparent 70%)",
                 transform: "translate(25%, -30%)",
               }} />

          <div className="relative px-8 py-14 sm:px-14 sm:py-16 text-center">
            {/* Icon */}
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-6"
                 style={{
                   background: "rgba(255,255,255,0.1)",
                   border: "1px solid rgba(255,255,255,0.18)",
                   boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                 }}>
              <Leaf className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4"
                style={{ textWrap: "balance" } as React.CSSProperties}>
              Start protecting your crops{" "}
              <GoldText>today. For free.</GoldText>
            </h2>

            <p className="text-base leading-relaxed mb-10 max-w-xl mx-auto"
               style={{ color: "rgba(255,255,255,0.55)" }}>
              Join 50,000+ farmers across Bangladesh who diagnose crop diseases
              instantly with AI — no registration required to try.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <Link href="/diagnose"
                className="group inline-flex items-center gap-2 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-50 transition-all duration-200 hover:-translate-y-0.5"
                style={{ height: "52px", padding: "0 32px", fontSize: "15px", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                <Camera className="h-5 w-5" style={{ color: "#2D5A27" }} />
                Diagnose My Crop — Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" style={{ color: "#2D5A27" }} />
              </Link>

              <Link href="/contact"
                className="inline-flex items-center gap-2 rounded-xl font-bold transition-all duration-200 hover:bg-white/10"
                style={{
                  height: "52px", padding: "0 28px", fontSize: "14px",
                  color: "rgba(255,255,255,0.75)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}>
                <Phone className="h-4 w-4" />
                Talk to an Agronomist
              </Link>
            </div>

            <p className="text-xs font-medium"
               style={{ color: "rgba(255,255,255,0.28)" }}>
              No credit card · No account needed · Works offline · Available in Bangla
            </p>
          </div>
        </motion.div>

        {/* Tier cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09 }}
              className="flex items-start gap-4 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">{tier.icon}</span>
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">{tier.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>{tier.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
