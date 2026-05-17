"use client";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export function MetricCard({ label, value, icon: Icon, color, bg }: MetricCardProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.04)] group transition-all hover:shadow-xl">
      <div className={`h-14 w-14 rounded-2xl ${bg} flex items-center justify-center ${color} mb-8 transition-transform group-hover:scale-110`}>
        <Icon className="h-7 w-7" />
      </div>
      <div className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</div>
    </div>
  );
}
