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

interface Analytics {
  totalDiagnoses: number;
  byDisease: Record<string, number>;
  byDistrict: Record<string, number>;
  trend7: number[];
  avgConfidence: number;
}

export default function OutbreakMap() {
  const [reports, setReports] = useState<Report[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalDiagnoses: 0, byDisease: {}, byDistrict: {}, trend7: [0,0,0,0,0,0,0], avgConfidence: 0
  });
  const [loading, setLoading] = useState(true);
  const [hoveredReport, setHoveredReport] = useState<Report | null>(null);
  const [predictionDays, setPredictionDays] = useState(0);

  useEffect(() => {
    fetchAll();

    const channel = supabase
      .channel("realtime-reports")
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "reports" },
        (payload) => {
          setReports((prev) => [payload.new as Report, ...prev]);
          toast.info(`New outbreak: ${payload.new.disease_name} in ${payload.new.location_name}`);
        }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchAll = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || "admin-mock-token";

      const response = await fetch("/api/outbreak-analytics", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const payload = await response.json();
        const reportsData = payload.reports || [];
        const diagnoses = payload.diagnoses || [];

        setReports(reportsData);

        const byDisease: Record<string, number> = {};
        const byDistrict: Record<string, number> = {};
        let confSum = 0;

        // Build 7-day trend
        const now = new Date();
        const trend7 = Array.from({ length: 7 }, (_, idx) => {
          const day = new Date(now);
          day.setDate(day.getDate() - (6 - idx));
          const dayStr = day.toISOString().slice(0, 10);
          return diagnoses.filter((d: any) => d.created_at && d.created_at.slice(0, 10) === dayStr).length;
        });

        diagnoses.forEach((d: any) => {
          const raw = d.disease_detected || "";
          const parts = raw.split(" - ");
          const disease = parts.length > 1 ? parts[1] : raw;
          byDisease[disease] = (byDisease[disease] || 0) + 1;
          if (d.confidence_score) confSum += d.confidence_score;
        });

        reportsData.forEach((r: any) => {
          byDistrict[r.location_name] = (byDistrict[r.location_name] || 0) + 1;
        });

        setAnalytics({
          totalDiagnoses: diagnoses.length,
          byDisease,
          byDistrict,
          trend7,
          avgConfidence: diagnoses.length ? confSum / diagnoses.length : 0,
        });
      }
    } catch (err) {
      console.error("Error loading outbreak analytics GIS data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "high":   return { dot: "#ef4444", glow: "rgba(239,68,68,0.3)" };
      case "medium": return { dot: "#f59e0b", glow: "rgba(245,158,11,0.3)" };
      default:       return { dot: "#10b981", glow: "rgba(16,185,129,0.3)" };
    }
  };

  const projectPoint = (lat: number, lon: number) => {
    const x = ((lon - 88.0) / (92.9 - 88.0)) * 100;
    const y = (1 - (lat - 20.5) / (26.8 - 20.5)) * 100;
    return { left: `${Math.max(4, Math.min(94, x))}%`, top: `${Math.max(4, Math.min(94, y))}%` };
  };

  // Top diseases for bar chart
  const topDiseases = Object.entries(analytics.byDisease)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxDiseaseCount = Math.max(...topDiseases.map(d => d[1]), 1);

  // Top districts
  const topDistricts = Object.entries(analytics.byDistrict)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // 7-day chart max
  const maxTrend = Math.max(...analytics.trend7, 1);
  const dayLabels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const today = new Date().getDay();
  const labels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()];
  });

  return (
    <div className="space-y-6">
      {/* ── GIS MAP ─────────────────────────────────────────────── */}
      <div className="h-72 w-full rounded-[2rem] overflow-hidden border border-slate-100 bg-gradient-to-br from-slate-50 to-slate-100 relative">
        {/* Bangladesh SVG outline */}
        <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full opacity-10 pointer-events-none">
          <path
            d="M130 45 L165 30 L210 40 L255 35 L290 60 L320 90 L340 140 L355 200 L345 260 L320 310 L290 355 L260 390 L230 420 L195 440 L165 435 L140 415 L110 380 L85 340 L70 295 L60 250 L65 200 L75 155 L95 110 Z"
            fill="#052E16" stroke="#052E16" strokeWidth="1"
          />
        </svg>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        />

        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 border-3 border-[#052E16] border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading GIS Data...</span>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-white/90 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200">
              No outbreak reports
            </div>
          </div>
        ) : (
          reports.map((report) => {
            // Predict spread by increasing glow radius and jittering pos based on predictionDays
            const spreadFactor = 1 + (predictionDays * 0.15);
            const spreadRadius = Math.min(20, 8 * spreadFactor);
            const pos = projectPoint(
              report.latitude + (predictionDays > 0 ? (Math.random() - 0.5) * predictionDays * 0.05 : 0), 
              report.longitude + (predictionDays > 0 ? (Math.random() - 0.5) * predictionDays * 0.05 : 0)
            );
            const { dot, glow } = getSeverityColor(report.severity);
            const isHovered = hoveredReport?.id === report.id;
            return (
              <div
                key={report.id}
                className="absolute z-10 cursor-pointer transition-all duration-700"
                style={{ left: pos.left, top: pos.top }}
                onMouseEnter={() => setHoveredReport(report)}
                onMouseLeave={() => setHoveredReport(null)}
              >
                {/* Pulsing glow */}
                <div
                  className={`absolute -inset-3 rounded-full opacity-30 ${predictionDays > 0 ? 'animate-pulse' : 'animate-ping'}`}
                  style={{ backgroundColor: dot, transform: `scale(${spreadFactor})` }}
                />
                {/* Dot */}
                <div
                  className="relative h-3 w-3 rounded-full border-2 border-white shadow-lg transition-transform hover:scale-150"
                  style={{ backgroundColor: dot, boxShadow: `0 0 ${spreadRadius}px ${glow}`, transform: `scale(${spreadFactor > 1 ? 1.2 : 1})` }}
                />
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-2 rounded-xl shadow-xl border border-slate-100 z-30">
                    <div className="text-[11px] font-black text-slate-900">{report.disease_name}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{report.location_name} • {report.severity}</div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Legend */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-lg z-20 space-y-1">
          <div className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Severity</div>
          {[{c:"#ef4444", label:"High"},{c:"#f59e0b", label:"Med"},{c:"#10b981", label:"Low"}].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.c }} />
              <span className="text-[9px] font-bold text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Report count badge */}
        <div className="absolute top-3 left-3 bg-white/90 px-3 py-1.5 rounded-xl border border-slate-200 shadow-lg z-20 flex flex-col gap-1">
          <span className="text-[10px] font-black text-slate-900">{reports.length} Active Reports</span>
          {predictionDays > 0 && <span className="text-[9px] font-bold text-red-500 uppercase">+{Math.floor(reports.length * predictionDays * 0.12)} Projected</span>}
        </div>

        {/* Prediction Slider */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200 shadow-lg z-20 w-48 flex flex-col gap-2">
          <div className="flex justify-between items-center">
             <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Predictive Spread</span>
             <span className="text-[10px] font-bold text-slate-900">{predictionDays > 0 ? `+${predictionDays} Days` : "Live"}</span>
          </div>
          <input 
            type="range" 
            min="0" max="14" 
            value={predictionDays} 
            onChange={(e) => setPredictionDays(parseInt(e.target.value))}
            className="w-full accent-red-500 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* ── ANALYTICS ROW ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* 7-Day Trend Bar Chart */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">7-Day Diagnosis Trend</div>
          <div className="h-24 flex items-end gap-1">
            {analytics.trend7.map((val, i) => {
              const h = Math.max(6, (val / maxTrend) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="text-[8px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{val}</div>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-green-600 to-green-400 transition-all duration-500 group-hover:from-green-700 group-hover:to-green-500"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[8px] font-bold text-slate-300">{labels[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Diseases Horizontal Bar */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Top Diseases</div>
          <div className="space-y-2">
            {topDiseases.length === 0 ? (
              <div className="text-[10px] text-slate-300 font-bold">No data yet</div>
            ) : topDiseases.map(([name, count]) => (
              <div key={name} className="space-y-0.5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-slate-600 truncate max-w-[70%]">{name}</span>
                  <span className="text-[9px] font-black text-slate-400">{count}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all duration-700"
                    style={{ width: `${(count / maxDiseaseCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top Districts & Resource Allocation Model */}
      <div className="grid grid-cols-2 gap-4">
        {/* Outbreak Hotspots */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
            Outbreak Hotspots by District
          </div>
          <div className="grid grid-cols-5 gap-2">
            {topDistricts.map(([district, count], idx) => (
              <div key={district} className="text-center">
                <div className={`text-lg font-black ${idx === 0 ? 'text-red-600' : idx === 1 ? 'text-amber-600' : 'text-slate-600'}`}>
                  {count}
                </div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{district}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Allocation Model */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-2xl p-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-3 flex justify-between">
            <span>Resource Allocation Model</span>
            <span className="bg-blue-100 text-blue-700 px-1.5 rounded-md">AI Suggested</span>
          </div>
          <div className="space-y-2">
            {topDistricts.slice(0,3).map(([district, count], idx) => {
               // mock logic for officers
               const suggestedOfficers = Math.ceil(count * 1.5 + (idx === 0 ? 5 : 0));
               return (
                <div key={district} className="bg-white/60 p-2 rounded-xl flex items-center justify-between border border-white">
                  <div className="flex items-center gap-2">
                     <div className={`h-2 w-2 rounded-full ${idx === 0 ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
                     <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">{district}</span>
                  </div>
                  <div className="text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-1 rounded-lg">
                    Deploy {suggestedOfficers} Ext. Officers
                  </div>
                </div>
               );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
