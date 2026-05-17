"use client";
import { LucideIcon } from "lucide-react";

interface SidebarLinkProps {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  badge?: number;
}

export function SidebarLink({ active, onClick, icon: Icon, label, badge }: SidebarLinkProps) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group ${active ? 'bg-[#052E16] text-white shadow-xl shadow-green-900/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
    >
      <div className="flex items-center gap-4">
        <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
        <span className="text-[12px] font-black uppercase tracking-widest">{label}</span>
      </div>
      {badge && badge > 0 ? (
        <span className="h-6 w-6 rounded-lg bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-rose-500/20 animate-pulse">
          {badge}
        </span>
      ) : null}
    </button>
  );
}
