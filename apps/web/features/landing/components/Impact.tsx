"use client";
import { motion } from "framer-motion";
import { Users, TrendingUp, Leaf, Bell, Award, CheckCircle2 } from "lucide-react";

const STATS = [
  { value: "50,000+", label: "Farmer Nodes",  icon: Users,      sub: "Active agricultural sectors", color: "text-blue-400" },
  { value: "99.2%",   label: "AI Accuracy",     icon: TrendingUp, sub: "Expert-verified models", color: "text-emerald-400" },
  { value: "64",      label: "Districts",        icon: Leaf,       sub: "National grid coverage", color: "text-amber-400" },
  { value: "1.2M",    label: "Intelligence Logs",icon: Bell,       sub: "Advisory reports generated", color: "text-indigo-400" },
];

export function Impact() {
  return (
    <section
      id="stats"
      className="py-32 relative overflow-hidden bg-[#021109]"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative container mx-auto max-w-7xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 bg-white/5 border border-white/10 mb-8"
          >
            <Award className="h-4 w-4" />
            National Performance Metrics
          </motion.div>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-8 leading-tight">
            Digitizing the backbone <br /> 
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-emerald-200">of our national economy.</span>
          </h2>
          <p className="text-white/40 text-lg font-medium">Protecting over 5,000 hectares of farmland with real-time AI security.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/10 group hover:bg-white/10 transition-all duration-500"
            >
              <div className={`h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center ${s.color} mb-8 transition-transform group-hover:scale-110 border border-white/5`}>
                <s.icon className="h-7 w-7" />
              </div>
              <div className="text-5xl font-black text-white mb-2 tracking-tighter">{s.value}</div>
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">{s.label}</div>
              <div className="text-[13px] font-medium text-white/20">{s.sub}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 p-12 rounded-[4rem] bg-linear-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-3xl relative overflow-hidden group"
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div>
                <h3 className="text-3xl font-black text-white tracking-tighter mb-6">Efficiency Benchmarks</h3>
                <p className="text-white/40 text-lg font-medium leading-relaxed mb-10">AgriVision AI consistently outperforms traditional manual inspection in both speed and diagnostic precision.</p>
                <div className="space-y-6">
                  {[
                    { label: "Yield Protection", val: 87, color: "bg-emerald-500" },
                    { label: "Early Detection Speed", val: 94, color: "bg-blue-500" },
                    { label: "Reduction in Chemical Waste", val: 63, color: "bg-amber-500" }
                  ].map(item => (
                    <div key={item.label} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-[11px] font-black uppercase tracking-widest text-white/60">{item.label}</span>
                        <span className="text-sm font-black text-white">{item.val}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.val}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className={`h-full ${item.color} shadow-[0_0_20px_rgba(0,0,0,0.5)]`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
             </div>
             <div className="relative">
                <div className="aspect-square rounded-[3.5rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative overflow-hidden group-hover:bg-emerald-500/20 transition-all duration-700">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.2),transparent_70%)]" />
                   <div className="text-center relative z-10 px-8">
                      <CheckCircle2 className="h-20 w-20 text-emerald-400 mx-auto mb-8 animate-pulse" />
                      <div className="text-4xl font-black text-white tracking-tighter mb-4">BARI Certified</div>
                      <p className="text-emerald-100/40 text-sm font-medium">Models validated by the Bangladesh Agricultural Research Institute for national accuracy standards.</p>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
