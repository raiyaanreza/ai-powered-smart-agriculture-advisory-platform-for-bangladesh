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
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-150 group ${
        active 
          ? 'bg-[#052E16] text-white shadow-sm' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
        <span className="text-xs font-medium">{label}</span>
      </div>
      {badge && badge > 0 ? (
        <span className={`h-5 min-w-5 px-1.5 rounded-md text-[10px] font-semibold flex items-center justify-center ${
          active ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'
        }`}>
          {badge}
        </span>
      ) : null}
    </button>
  );
}
