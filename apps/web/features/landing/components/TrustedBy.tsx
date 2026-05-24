"use client";
import { motion } from "framer-motion";

const PARTNERS = [
  "Ministry of Agriculture",
  "Bangladesh Rice Research Institute",
  "BARI",
  "Wheat & Maize Research",
  "Dept. of Agricultural Extension",
  "BINA",
  "Jute Research Institute",
  "Agricultural Development Corp.",
];

export function TrustedBy() {
  return (
    <section className="py-12 bg-white dark:bg-[#0A0F0D] border-y border-slate-100 dark:border-slate-900 overflow-hidden transition-colors duration-200">
      <div className="text-center mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
          Endorsed & Supported by National Institutions
        </p>
      </div>

      <div className="relative">
        {/* Fade masks */}
        <div className="absolute left-0 inset-y-0 w-20 sm:w-32 bg-gradient-to-r from-white dark:from-[#0A0F0D] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-20 sm:w-32 bg-gradient-to-l from-white dark:from-[#0A0F0D] to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-12 sm:gap-20 items-center whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 55, ease: "linear", repeat: Infinity }}
        >
          {[...PARTNERS, ...PARTNERS].map((name, i) => (
            <div key={`${name}-${i}`} className="flex items-center gap-12 sm:gap-20 flex-shrink-0">
              <span className="text-sm font-semibold text-slate-350 dark:text-slate-700 hover:text-slate-500 dark:hover:text-slate-400 transition-colors cursor-default select-none">
                {name}
              </span>
              <span className="text-slate-200 dark:text-slate-800 text-xs flex-shrink-0">·</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}