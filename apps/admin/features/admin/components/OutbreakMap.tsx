"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Report {
  id: string;
  disease_name: string;
  latitude: number;
  longitude: number;
  severity: string;
  location_name: string;
}

export default function OutbreakMap() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();

    const channel = supabase
      .channel('realtime-reports')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'reports' }, 
        (payload) => {
          setReports(prev => [payload.new as Report, ...prev]);
          toast.info(`New outbreak reported in ${payload.new.location_name}`);
        }
      ).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReports(data);
    }
    setLoading(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return '#ef4444'; // red-500
      case 'medium': return '#f59e0b'; // amber-500
      case 'low': return '#10b981'; // emerald-500
      default: return '#3b82f6'; // blue-500
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
      left: `${Math.max(5, Math.min(95, x))}%`,
      top: `${Math.max(5, Math.min(95, y))}%`,
    };
  };

  return (
    <div className="h-125 w-full rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-inner bg-slate-50 relative z-10">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-white via-slate-50 to-slate-100" />
        <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full opacity-15 drop-shadow-2xl">
          <path
            d="M150 50 L250 50 L300 150 L350 250 L300 400 L200 450 L100 400 L50 250 L100 150 Z"
            fill="#052E16"
            stroke="#052E16"
            strokeWidth="2"
          />
        </svg>

        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-20">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 border-4 border-[#052E16] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Geospatial Data...</span>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="rounded-2xl border border-slate-200 bg-white/90 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 shadow-lg">
              No live outbreak reports yet.
            </div>
          </div>
        ) : (
          reports.map((report) => {
            const position = projectPoint(report.latitude, report.longitude);
            const severityColor = getSeverityColor(report.severity);

            return (
              <div key={report.id} className="absolute" style={{ left: position.left, top: position.top }}>
                <div
                  className="absolute -inset-4 rounded-full opacity-20"
                  style={{ backgroundColor: severityColor }}
                />
                <div
                  className="relative h-3 w-3 rounded-full shadow-lg border-2 border-white"
                  style={{ backgroundColor: severityColor }}
                />
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 rounded-lg shadow-sm border border-slate-100 text-[9px] font-black text-slate-900 z-20">
                  {report.location_name}
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Map Legend */}
      <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl z-1000 space-y-2">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Outbreak Intensity</h4>
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <span className="text-[10px] font-bold text-slate-700">Critical</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-amber-500" />
          <span className="text-[10px] font-bold text-slate-700">Warning</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-bold text-slate-700">Moderate</span>
        </div>
      </div>
    </div>
  );
}
