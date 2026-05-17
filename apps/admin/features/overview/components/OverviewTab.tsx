"use client";
import { Users, Activity, Zap, Bell, FileJson } from "lucide-react";
import { MetricCard } from "./MetricCard";
import dynamic from "next/dynamic";

const OutbreakMap = dynamic(() => import("@/features/admin/components/OutbreakMap"), { 
  ssr: false,
  loading: () => (
    <div className="h-125 w-full rounded-[3rem] bg-slate-100 animate-pulse flex items-center justify-center">
      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Initializing GIS Intelligence...</div>
    </div>
  )
});

interface OverviewTabProps {
  metrics: {
    totalUsers: number;
    diagnosesCount: number;
    accuracy: number;
    activeAlerts: number;
  };
}

export function OverviewTab({ metrics }: OverviewTabProps) {
  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-[#052E16] tracking-tighter leading-tight">National Agricultural Intelligence</h1>
          <p className="text-slate-400 font-medium text-lg">Monitoring 64 districts and 50,000+ active farming nodes.</p>
        </div>
        <div className="flex gap-4">
          <button className="h-[52px] px-8 rounded-2xl bg-white border border-slate-200 text-[11px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-3">
            <FileJson className="h-4 w-4" /> Export Datasets
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricCard label="Total User Base" value={metrics.totalUsers.toLocaleString()} icon={Users} color="text-blue-600" bg="bg-blue-50" />
        <MetricCard label="Total Diagnoses" value={metrics.diagnosesCount.toLocaleString()} icon={Activity} color="text-emerald-600" bg="bg-emerald-50" />
        <MetricCard label="AI Model Confidence" value="99.2%" icon={Zap} color="text-amber-600" bg="bg-amber-50" />
        <MetricCard label="Active National Alerts" value={metrics.activeAlerts} icon={Bell} color="text-rose-600" bg="bg-rose-50" />
      </div>

      <div className="bg-white border border-slate-100 rounded-[3.5rem] p-12 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Outbreak Visualization</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Geospatial Intelligence Engine</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">Live Telemetry</span>
          </div>
        </div>
        <div className="h-[500px] w-full rounded-[2.5rem] overflow-hidden border border-slate-100">
          <OutbreakMap />
        </div>
      </div>
    </div>
  );
}
