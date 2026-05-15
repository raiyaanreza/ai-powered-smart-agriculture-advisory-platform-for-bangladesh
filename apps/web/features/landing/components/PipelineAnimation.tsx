"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Camera, Cpu, Globe, FileText, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export function PipelineAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const pathLength = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  const NODES = [
    { icon: Camera, title: "Image Ingestion", desc: "Multi-modal input from farmer's mobile device", color: "#3B82F6" },
    { icon: Cpu, title: "Agent Orchestrator", desc: "LangGraph routes input to specific crop nodes", color: "#8B5CF6" },
    { icon: Zap, title: "YOLO Inference", desc: "Computer vision detects disease & severity", color: "#F59E0B" },
    { icon: ShieldCheck, title: "Expert Guardrails", desc: "BARI-verified knowledge base validation", color: "#10B981" },
    { icon: FileText, title: "Bilingual Advisory", desc: "Instant Bengali & English treatment steps", color: "#052E16" },
  ];

  return (
    <section ref={containerRef} className="py-32 bg-white overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#2D5A27] bg-emerald-50 border border-emerald-100 mb-6"
          >
            The Intelligence Engine
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-black text-[#052E16] tracking-tighter mb-6">
            From Photo to Advisory <br /> <span className="text-slate-400">in under 2 seconds.</span>
          </h2>
          <p className="text-slate-500 text-lg font-medium">Our agentic pipeline unifies computer vision and expert agronomy.</p>
        </div>

        <div className="relative flex flex-col items-center">
          {/* Connecting Path */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-slate-50 rounded-full hidden lg:block overflow-hidden">
            <motion.div 
              style={{ scaleY: pathLength, originY: 0 }}
              className="w-full h-full bg-linear-to-b from-blue-500 via-emerald-500 to-[#052E16]"
            />
          </div>

          <div className="space-y-24 w-full relative z-10">
            {NODES.map((node, i) => (
              <motion.div
                key={node.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              >
                <div className={`flex-1 text-center ${i % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                  <h3 className="text-2xl font-black text-[#052E16] tracking-tight mb-4">{node.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed max-w-md mx-auto lg:mx-0">{node.desc}</p>
                </div>

                <div className="relative">
                  <div className="h-24 w-24 rounded-[2.5rem] bg-white border border-slate-100 shadow-2xl flex items-center justify-center relative z-20 transition-transform hover:scale-110 duration-500">
                    <node.icon className="h-10 w-10" style={{ color: node.color }} />
                    <div className="absolute -inset-4 rounded-[3rem] blur-xl opacity-20" style={{ backgroundColor: node.color }} />
                  </div>
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -right-4 h-10 w-10 rounded-2xl bg-[#052E16] text-white text-[12px] font-black flex items-center justify-center shadow-xl border-4 border-white z-30">
                    0{i + 1}
                  </div>
                </div>

                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-32 p-12 rounded-[4rem] bg-[#052E16] text-white text-center relative overflow-hidden"
        >
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_70%)]" />
           <div className="relative z-10 max-w-2xl mx-auto">
              <h4 className="text-3xl font-black tracking-tighter mb-6">Experience Government-Grade AI</h4>
              <p className="text-emerald-100/60 font-medium mb-10">Start protecting your crops today with the same technology used by the National Agricultural Bureau.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <Link href="/diagnose" className="h-[64px] px-12 rounded-3xl bg-emerald-500 text-[#052E16] text-[14px] font-black uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/20">
                    Run First Diagnosis <ArrowRight className="h-5 w-5" />
                 </Link>
              </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
}
