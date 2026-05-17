"use client";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { VerificationCard } from "./VerificationCard";

interface VerificationTabProps {
  pendingFarmers: any[];
  onVerify: (id: string, approve: boolean) => void;
  fetching: boolean;
}

export function VerificationTab({ pendingFarmers, onVerify, fetching }: VerificationTabProps) {
  if (fetching) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 border-4 border-[#052E16] border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading applicant telemetry...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-[#052E16] tracking-tighter">Farmer Authentication Queue</h1>
        <p className="text-slate-500 font-medium text-lg">Verify identity and land documents for {pendingFarmers.length} pending applications.</p>
      </div>
      
      <div className="grid gap-6">
        {pendingFarmers.length > 0 ? (
          pendingFarmers.map(farmer => (
            <VerificationCard key={farmer.id} farmer={farmer} onVerify={onVerify} />
          ))
        ) : (
          <div className="py-32 bg-white rounded-[3rem] border border-slate-100 text-center flex flex-col items-center">
            <div className="h-20 w-20 rounded-[2rem] bg-emerald-50 flex items-center justify-center mb-8 border border-emerald-100">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">No Pending Verifications</h3>
            <p className="text-slate-400 font-medium">The national queue is currently empty.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
