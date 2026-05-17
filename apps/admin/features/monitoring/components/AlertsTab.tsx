"use client";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";

interface AlertsTabProps {
  alertForm: {
    title: string;
    type: string;
    target: string;
    message: string;
  };
  onChangeForm: (form: any) => void;
  onBroadcast: () => void;
}

export function AlertsTab({ alertForm, onChangeForm, onBroadcast }: AlertsTabProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-[#052E16] tracking-tighter">National Alert Broadcast</h1>
        <p className="text-slate-500 font-medium text-lg">Deploy critical bulletins to the national farmer network via push and SMS.</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-[3.5rem] p-12 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.04)] space-y-10">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Bulletin Title</label>
            <input 
              type="text" 
              value={alertForm.title}
              onChange={e => onChangeForm({ ...alertForm, title: e.target.value })}
              placeholder="e.g. Cyclone Amphan Warning"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-8 py-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#052E16]/5 transition-all"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Bulletin Priority</label>
            <select 
              value={alertForm.type} 
              onChange={e => onChangeForm({ ...alertForm, type: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#052E16]/5 transition-all appearance-none"
            >
              <option>Information</option>
              <option>Warning</option>
              <option>Critical</option>
              <option>Emergency</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Detailed Intelligence</label>
          <textarea 
            rows={5} 
            value={alertForm.message}
            onChange={e => onChangeForm({ ...alertForm, message: e.target.value })}
            placeholder="Type your message here..."
            className="w-full bg-slate-50 border border-slate-200 rounded-3xl px-8 py-6 text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#052E16]/5 transition-all resize-none"
          />
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <div className="flex items-center gap-3">
            <input type="checkbox" id="sms" className="h-5 w-5 rounded-lg border-slate-200 text-[#052E16] focus:ring-[#052E16]" />
            <label htmlFor="sms" className="text-xs font-black uppercase tracking-widest text-slate-400">Trigger SMS Gateway</label>
          </div>
          <button 
            onClick={onBroadcast}
            className="h-16 px-10 rounded-2xl bg-rose-600 text-white text-[12px] font-black uppercase tracking-widest flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-500/30 active:scale-95"
          >
            <Bell className="h-5 w-5" /> Deploy Broadcast
          </button>
        </div>
      </div>
    </motion.div>
  );
}
