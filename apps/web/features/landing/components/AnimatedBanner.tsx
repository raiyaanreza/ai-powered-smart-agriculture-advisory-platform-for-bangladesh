"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { AlertTriangle, X, ChevronRight } from "lucide-react";

const ALERTS = [
  { type: "warning", text: "Brown Spot outbreak detected in Rajshahi — 3 districts affected. View advisory →" },
  { type: "info",    text: "AI models updated with Boro rice disease patterns for 2025 season" },
  { type: "success", text: "Free diagnosis available for all farmers — No registration required" },
  { type: "info",    text: "New: Voice-assisted diagnosis now available in Bangla" },
];

export function AnimatedBanner() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Slower interval to prevent "blinking" feel
    const t = setInterval(() => setIndex(i => (i + 1) % ALERTS.length), 8000);
    return () => clearInterval(t);
  }, []);

  if (!visible) return null;

  const alert = ALERTS[index];

  return (
    <div
      role="alert"
      aria-live="polite"
      className="relative z-[100] bg-[#2D5A27] text-white overflow-hidden border-b border-white/10"
    >
      {/* Extremely subtle, slow shimmer sweep */}
      <motion.div 
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{ 
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
          width: "50%"
        }}
      />

      <div className="relative flex items-center justify-center py-2.5 px-4 gap-3">
        <div className="flex items-center gap-2 flex-1 justify-center min-w-0">
          <AlertTriangle className="h-3 w-3 text-[#FDE047] flex-shrink-0" />

          <div className="h-5 overflow-hidden relative flex-1 max-w-xl">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-[12px] sm:text-[13px] font-bold text-white/95 text-center truncate tracking-wide"
              >
                {alert.text}
              </motion.p>
            </AnimatePresence>
          </div>

          <ChevronRight className="h-3 w-3 text-white/40 flex-shrink-0 hidden sm:block" />
        </div>

        <button
          onClick={() => setVisible(false)}
          className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
        >
          <X className="h-3.5 w-3.5 text-white/40" />
        </button>
      </div>
    </div>
  );
}