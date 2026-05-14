"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Rahim Uddin",
    role: "Rice Farmer",
    location: "Rajshahi",
    quote: "AgriVision saved my rice crop from blast disease. The AI detected it within seconds and gave me the exact treatment in Bangla. My yield increased by 30% this season.",
    initial: "R",
    avatarBg: "linear-gradient(135deg, #2D5A27, #3D9150)",
  },
  {
    name: "Nasreen Akter",
    role: "Potato Grower",
    location: "Rangpur",
    quote: "The regional alerts feature is a game-changer. We received a blight warning 3 days before symptoms appeared and saved our entire harvest from total loss.",
    initial: "N",
    avatarBg: "linear-gradient(135deg, #92400E, #D97706)",
  },
  {
    name: "Kamal Hossain",
    role: "Cooperative Leader",
    location: "Sylhet",
    quote: "Even with poor internet, the offline sync works perfectly. My 200-farmer cooperative uses it daily — the government verification adds huge trust.",
    initial: "K",
    avatarBg: "linear-gradient(135deg, #1E40AF, #3B82F6)",
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

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 sm:py-32" style={{ background: "#F8FAFC" }}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] mb-4"
            style={{ background: "rgba(45,90,39,0.07)", color: "#2D5A27", border: "1px solid rgba(45,90,39,0.16)" }}
          >
            <Star className="h-3 w-3 fill-current" />
            Farmer Stories
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Trusted by farmers{" "}
            <GradientText>across the nation</GradientText>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 90 }}
              className="rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" style={{ color: "#EAB308" }} />
                ))}
              </div>

              <Quote className="h-6 w-6 mb-3" style={{ color: "#E2E8F0" }} />

              <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: "#475569" }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid #F1F5F9" }}>
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                     style={{ background: t.avatarBg }}>
                  {t.initial}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{t.name}</p>
                  <p className="text-xs" style={{ color: "#94A3B8" }}>{t.role} · {t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
