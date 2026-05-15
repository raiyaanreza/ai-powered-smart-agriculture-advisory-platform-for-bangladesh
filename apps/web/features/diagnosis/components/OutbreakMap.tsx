"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Map as MapIcon, ShieldAlert, Activity, Navigation } from "lucide-react";
import { supabase, supabaseAdmin } from "@/lib/supabase";

interface Report {
  id: string;
  disease_name: string;
  latitude: number;
  longitude: number;
  severity: string;
  location_name: string;
}

export function OutbreakMap() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchReports = async () => {
      const { data, error } = await supabaseAdmin
        .from("reports")
        .select("id, disease_name, latitude, longitude, severity, location_name")
        .order("created_at", { ascending: false })
        .limit(5);

      if (!mounted) return;

      if (!error && data) {
        setReports(data);
      }
      setLoading(false);
    };

    fetchReports();

    const channel = supabase
      .channel("diagnosis-reports")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reports" },
        (payload) => {
          setReports((prev) => [payload.new as Report, ...prev].slice(0, 5));
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const getSeverityTone = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "High";
      case "medium":
        return "Medium";
      default:
        return "Low";
    }
  };

  const projectPoint = (latitude: number, longitude: number) => {
    const lonMin = 88.0;
    const lonMax = 92.9;
    const latMin = 20.5;
    const latMax = 26.8;

    const x = ((longitude - lonMin) / (lonMax - lonMin)) * 100;
    const y = (1 - (latitude - latMin) / (latMax - latMin)) * 100;

    return {
      x: `${Math.max(5, Math.min(95, x))}%`,
      y: `${Math.max(5, Math.min(95, y))}%`,
    };
  };

  return (
    <div className="rounded-[2.5rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
      <div className="grid lg:grid-cols-12">
        
        {/* Left Info Panel */}
        <div className="lg:col-span-4 p-10 bg-green-950 text-white">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <MapIcon className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Regional Outbreak</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-green-400/70">Real-time Heatmap</p>
            </div>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-green-100/50">
                Loading live outbreak points...
              </div>
            ) : reports.length === 0 ? (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-green-100/50">
                No live outbreak reports yet.
              </div>
            ) : reports.map((point, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-black">{point.location_name}</span>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                    getSeverityTone(point.severity) === 'High' ? 'bg-red-500/20 text-red-400' :
                    getSeverityTone(point.severity) === 'Medium' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {point.severity}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-medium text-green-100/60">
                   <ShieldAlert className="h-3 w-3" /> {point.disease_name}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 pt-10 border-t border-white/5">
            <div className="flex items-center gap-4 text-[11px] font-bold text-green-100/40">
              <Activity className="h-4 w-4" /> Updated via PostGIS Analytics
            </div>
          </div>
        </div>

        {/* Right Map Canvas */}
        <div className="lg:col-span-8 p-12 bg-slate-50 relative overflow-hidden flex items-center justify-center">
          {/* Abstract Bangladesh Map SVG Placeholder */}
          <div className="relative w-full aspect-4/5 max-w-100">
            <svg viewBox="0 0 400 500" className="w-full h-full drop-shadow-2xl opacity-10">
              <path 
                d="M150 50 L250 50 L300 150 L350 250 L300 400 L200 450 L100 400 L50 250 L100 150 Z" 
                fill="#052E16" 
                stroke="#052E16" 
                strokeWidth="2"
              />
            </svg>

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            {/* Heat Points */}
            {reports.map((point, i) => {
              const position = projectPoint(point.latitude, point.longitude);
              return (
              <motion.div
                key={point.id}
                className="absolute"
                style={{ left: position.x, top: position.y }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1, type: "spring" }}
              >
                {/* Pulse Animation */}
                <motion.div 
                  className={`absolute -inset-4 rounded-full opacity-20 ${
                    getSeverityTone(point.severity) === 'High' ? 'bg-red-500' :
                    getSeverityTone(point.severity) === 'Medium' ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`}
                  animate={{ scale: [1, 2, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Center Point */}
                <div className={`relative h-3 w-3 rounded-full shadow-lg border-2 border-white ${
                  getSeverityTone(point.severity) === 'High' ? 'bg-red-500' :
                  getSeverityTone(point.severity) === 'Medium' ? 'bg-orange-500' :
                  'bg-blue-500'
                }`} />

                {/* Label */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 rounded-lg shadow-sm border border-slate-100 text-[9px] font-black text-slate-900 z-20">
                  {point.location_name}
                </div>
              </motion.div>
              );
            })}

            {/* Floating Stats */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-4 rounded-2xl border border-slate-200 shadow-xl"
            >
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">TOTAL THREATS</div>
              <div className="text-2xl font-black text-green-950 leading-none">842 <span className="text-[10px] text-red-500">↑ 12%</span></div>
            </motion.div>
          </div>

          <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-100 shadow-sm">
            <Navigation className="h-3 w-3 text-slate-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Reports Layer: active</span>
          </div>
        </div>

      </div>
    </div>
  );
}
