"use client";
import { CheckCircle2, XCircle, Users } from "lucide-react";
import { motion } from "framer-motion";

interface VerificationCardProps {
  farmer: {
    id: string;
    full_name?: string;
    email?: string;
    created_at: string;
  };
  onVerify: (id: string, approve: boolean) => void;
}

export function VerificationCard({ farmer, onVerify }: VerificationCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row md:items-center justify-between hover:border-[#2D5A27]/20 hover:bg-slate-50/50 transition-all gap-8 group"
    >
      <div className="flex items-center gap-8">
        <div className="h-20 w-20 rounded-[1.5rem] bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#2D5A27]/10 group-hover:text-[#2D5A27] transition-all">
          <Users className="h-10 w-10" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">{farmer.full_name || "New Farmer"}</h3>
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">
            {farmer.email} · Applied {new Date(farmer.created_at).toLocaleDateString()}
          </p>
          <div className="flex gap-3">
            <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest border border-amber-100">National ID Pending</span>
            <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest border border-blue-100">Land Record Match</span>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button onClick={() => onVerify(farmer.id, false)} className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center transition-all hover:bg-rose-100 active:scale-95">
          <XCircle className="h-6 w-6" />
        </button>
        <button onClick={() => onVerify(farmer.id, true)} className="h-14 px-10 rounded-2xl bg-[#052E16] text-white text-[12px] font-black uppercase tracking-widest transition-all hover:shadow-2xl hover:shadow-green-900/30 active:scale-95 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5" /> Approve Farmer
        </button>
      </div>
    </motion.div>
  );
}
