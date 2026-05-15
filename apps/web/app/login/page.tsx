"use client";
import { AuthForm } from "@/features/auth/components/AuthForm";
import { motion } from "framer-motion";
import { Leaf, ShieldCheck, Zap, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      
      {/* Left Panel: Branding & Value Props */}
      <div className="hidden lg:flex flex-col bg-[#052E16] p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#2D5A27]/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        
        <Link href="/" className="flex items-center gap-2 mb-32 relative z-10">
          <div className="h-10 w-10 rounded-xl bg-[#2D5A27] flex items-center justify-center">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            Agri<span className="text-green-400">Vision</span>
          </span>
        </Link>

        <div className="space-y-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-6xl font-black text-white tracking-tighter leading-none mb-6">
               Empowering <br /> Bangladesh's <br /> <span className="text-green-400">Agriculture.</span>
            </h2>
            <p className="text-green-100/60 text-lg font-medium max-w-md">
              The national AI infrastructure for smart farming, regional outbreak detection, and expert advisory.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-8">
             {[
               { icon: Zap, label: "Instant Diagnosis", desc: "AI-powered disease detection" },
               { icon: MessageSquare, label: "Expert Advisory", desc: "Direct specialist consults" },
               { icon: ShieldCheck, label: "Gov Verified", desc: "Ministry-backed research" },
             ].map((item, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 + (i * 0.1) }}
                 className="space-y-2"
               >
                 <item.icon className="h-6 w-6 text-green-400" />
                 <div className="text-white font-bold text-sm">{item.label}</div>
                 <div className="text-green-100/40 text-[11px] font-medium leading-relaxed uppercase tracking-wider">{item.desc}</div>
               </motion.div>
             ))}
          </div>
        </div>

        <div className="mt-auto relative z-10">
           <p className="text-green-100/30 text-xs font-black uppercase tracking-widest">
             © 2026 AgriVision Bangladesh • Ministry of Agriculture Partner
           </p>
        </div>
      </div>

      {/* Right Panel: Auth Form */}
      <div className="flex items-center justify-center p-8 bg-[#F8FAFC]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex justify-center mb-12">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-[#2D5A27] flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-[#052E16]">AgriVision</span>
            </Link>
          </div>
          <AuthForm />
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Government staff and verified admins use the same sign-in flow.
            </p>
            <p className="mt-1 text-[11px] font-medium text-slate-500">
              Approved admin profiles are routed to the Command Center after login.
            </p>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
