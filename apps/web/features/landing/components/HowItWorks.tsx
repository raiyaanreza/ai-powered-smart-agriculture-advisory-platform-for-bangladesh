"use client";
import { motion } from "framer-motion";
import { Camera, Cpu, FileText, CheckCircle, ArrowRight } from "lucide-react";

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

const STEPS = [
  {
    n: "01", icon: Camera,
    title: "Upload a Photo", bn: "ছবি তুলুন",
    desc: "Snap a photo of the affected leaf or crop using your smartphone. Supports gallery uploads and direct camera capture.",
    iconBg: "#F1F8F2", iconColor: "#2D5A27", labelBg: "#F1F8F2", labelColor: "#2D5A27",
  },
  {
    n: "02", icon: Cpu,
    title: "AI Analyzes It", bn: "এআই বিশ্লেষণ করে",
    desc: "Our YOLOv8-based neural network identifies the pathogen and severity level in under 1 second with 99.2% accuracy.",
    iconBg: "#FEFCE8", iconColor: "#92400E", labelBg: "#FEFCE8", labelColor: "#92400E",
  },
  {
    n: "03", icon: FileText,
    title: "Get Your Report", bn: "পরামর্শ নিন",
    desc: "Receive a full advisory in Bangla: disease name, treatment steps, dosage, and expert agronomist verification.",
    iconBg: "#EFF6FF", iconColor: "#1E40AF", labelBg: "#EFF6FF", labelColor: "#1E40AF",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32" style={{ background: "#FFFFFF" }}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Steps ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] mb-5"
              style={{ background: "rgba(45,90,39,0.07)", color: "#2D5A27", border: "1px solid rgba(45,90,39,0.16)" }}
            >
              How It Works
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-4"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Diagnosis in{" "}
              <GradientText>3 simple steps</GradientText>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-base leading-relaxed mb-10"
              style={{ color: "#64748B" }}
            >
              Designed for any farmer — even first-time smartphone users — with no
              technical knowledge required.
            </motion.p>

            <div className="space-y-6 relative">
              {/* Vertical connector */}
              <div className="absolute left-5 top-12 bottom-12 w-px hidden sm:block"
                   style={{ background: "linear-gradient(to bottom, #E2E8F0, transparent)" }} />

              {STEPS.map((step, i) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.14 }}
                  className="flex gap-5 group"
                >
                  <div
                    className="flex-shrink-0 flex h-11 w-11 rounded-full items-center justify-center z-10 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: step.iconBg,
                      boxShadow: `0 0 0 3px white, 0 0 0 5px ${step.iconBg}`,
                    }}
                  >
                    <step.icon className="h-5 w-5" style={{ color: step.iconColor }} />
                  </div>

                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-black tracking-widest" style={{ color: "#CBD5E1" }}>
                        {step.n}
                      </span>
                      <h3 className="text-[15px] font-bold text-slate-800">{step.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-md font-semibold"
                            style={{ background: step.labelBg, color: step.labelColor }}>
                        {step.bn}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{step.desc}</p>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-2 text-sm font-semibold sm:ml-16 pt-2"
                style={{ color: "#2D5A27" }}
              >
                <CheckCircle className="h-4 w-4" />
                Works offline · Free for all Bangladeshi farmers
              </motion.div>
            </div>
          </div>

          {/* ── Right: App Mockup ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, type: "spring", stiffness: 80 }}
            className="relative"
          >
            {/* Subtle glow */}
            <div className="absolute inset-6 rounded-3xl blur-2xl opacity-25 pointer-events-none"
                 style={{ background: "linear-gradient(135deg, rgba(45,90,39,0.3), rgba(234,179,8,0.2))" }} />

            <div className="relative rounded-3xl overflow-hidden"
                 style={{
                   background: "#FFFFFF",
                   border: "1px solid #E2E8F0",
                   boxShadow: "0 24px 64px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.05)",
                 }}>

              {/* App chrome */}
              <div className="px-5 py-4 flex items-center justify-between border-b"
                   style={{ background: "linear-gradient(90deg, #F1F8F2, #FEFCE8)", borderColor: "#E2E8F0" }}>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg flex items-center justify-center"
                       style={{ background: "#2D5A27" }}>
                    <Camera className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">AgriVision Diagnosis</span>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full"
                      style={{ background: "#E0F0E3", color: "#2D5A27" }}>
                  Live
                </span>
              </div>

              <div className="p-5 relative group overflow-hidden">
                <div className="rounded-2xl overflow-hidden aspect-video relative flex items-center justify-center bg-slate-900 border border-slate-100 shadow-inner">
                  <video 
                    src="/assets/demo.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  
                  {/* Overlay decorative elements */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                       <span className="text-white text-[10px] font-black uppercase tracking-widest shadow-sm">AI Scan Active</span>
                    </div>
                    <div className="px-2 py-1 rounded-md bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold">
                       99.2% Accuracy
                    </div>
                  </div>
                </div>

                {/* Analysis Report Mock */}

                {/* Result */}
                <div className="rounded-xl p-4 mb-3"
                     style={{ background: "#F1F8F2", border: "1px solid #C1E2C6" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-800">Brown Spot Detected</span>
                    <span className="text-sm font-black" style={{ color: "#2D5A27" }}>97.3%</span>
                  </div>
                  <div className="w-full rounded-full h-1.5 mb-3" style={{ background: "#E2E8F0" }}>
                    <div className="h-1.5 rounded-full" style={{ width: "97.3%", background: "linear-gradient(90deg, #2D5A27, #3D9150)" }} />
                  </div>
                  <button className="w-full h-9 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5"
                          style={{ background: "linear-gradient(135deg, #2D5A27, #3D9150)" }}>
                    View Full Advisory in Bangla
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}