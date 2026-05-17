"use client";
import { Terminal, Server } from "lucide-react";
import { motion } from "framer-motion";

export function SystemTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-[#052E16] tracking-tighter">System Engine Configuration</h1>
        <p className="text-slate-500 font-medium text-lg">Manage low-level infrastructure and missing table initializations.</p>
      </div>

      <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_70%)]" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <Terminal className="h-8 w-8 text-emerald-500" />
            <h3 className="text-2xl font-black tracking-tight">Database Initialization</h3>
          </div>
          <p className="text-slate-400 mb-10 leading-relaxed font-medium">If you encounter "Table not found" errors for <b>notifications</b>, please execute the following SQL in your Supabase SQL Editor:</p>
          <pre className="bg-black/40 rounded-3xl p-8 border border-white/5 text-emerald-400 font-mono text-sm leading-relaxed overflow-x-auto mb-10">
{`CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'info', 'warning', 'critical', 'emergency'
    target_role TEXT DEFAULT 'all', -- 'all', 'farmer', 'user'
    is_read BOOLEAN DEFAULT false
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for all users" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated admins" ON public.notifications FOR INSERT WITH CHECK (true);`}
          </pre>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500 border border-white/10">
              <Server className="h-5 w-5" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Manual Provisioning Required</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
