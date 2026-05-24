"use client";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Leaf, Phone } from "lucide-react";
import Link from "next/link";

const TIERS = [
  { icon: "🌾", title: "For Farmers",        desc: "Free forever for individual farmers in Bangladesh" },
  { icon: "🤝", title: "For Cooperatives",   desc: "Team plans available with group alert management" },
  { icon: "🏛️", title: "For Government",     desc: "Enterprise API and national monitoring dashboard" },
];

export function CTA() {
  return (
    <section className="py-24 sm:py-32 bg-background transition-colors duration-200">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Main CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80 }}
          className="relative rounded-3xl overflow-hidden mb-6 bg-linear-to-br from-earth-900 via-earth-850 to-earth-700 dark:from-emerald-950 dark:via-[#0c1a14] dark:to-emerald-900 border border-transparent dark:border-emerald-800/20"
        >
          {/* Grid overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-10 dark:opacity-5 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
          
          {/* Gold glow */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none bg-radial from-amber-500/10 to-transparent translate-x-1/4 -translate-y-1/3" />

          <div className="relative px-8 py-14 sm:px-14 sm:py-16 text-center">
            {/* Icon */}
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-6 bg-white/10 border border-white/20 shadow-xl backdrop-blur-md">
              <Leaf className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 text-balance">
              Start protecting your crops{" "}
              <span className="text-gradient-gold">today. For free.</span>
            </h2>

            <p className="text-base leading-relaxed mb-10 max-w-xl mx-auto text-white/60 dark:text-white/50">
              Join 50,000+ farmers across Bangladesh who diagnose crop diseases
              instantly with AI — no registration required to try.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <Link href="/diagnose"
                className="group inline-flex items-center gap-2 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-50 transition-all duration-200 hover:-translate-y-0.5 h-[52px] px-8 text-[15px] shadow-lg shadow-black/25">
                <Camera className="h-5 w-5 text-earth-700 dark:text-emerald-600" />
                Diagnose My Crop — Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 text-earth-700 dark:text-emerald-600" />
              </Link>

              <Link href="/contact"
                className="inline-flex items-center gap-2 rounded-xl font-bold transition-all duration-200 hover:bg-white/10 h-[52px] px-7 text-[14px] text-white/80 border border-white/20">
                <Phone className="h-4 w-4" />
                Talk to an Agronomist
              </Link>
            </div>

            <p className="text-xs font-medium text-white/30 dark:text-white/20">
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
              className="flex items-start gap-4 rounded-2xl p-5 bg-card border border-border shadow-xs hover:translate-y-[-2px] transition-all duration-200 hover:shadow-md hover:border-primary/30"
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">{tier.icon}</span>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">{tier.title}</h4>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{tier.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
