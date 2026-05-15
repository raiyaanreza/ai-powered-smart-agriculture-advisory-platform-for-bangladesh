"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Fix for Leaflet default icon issues in Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

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

  return (
    <div className="h-[500px] w-full rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-inner bg-slate-50 relative z-10">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-20">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 border-4 border-[#052E16] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Geospatial Data...</span>
          </div>
        </div>
      ) : (
        <MapContainer 
          center={[23.685, 90.3563]} 
          zoom={7} 
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {reports.map((report) => (
            <div key={report.id}>
              <Marker position={[report.latitude, report.longitude]}>
                <Popup className="custom-popup">
                  <div className="p-2">
                    <h3 className="text-sm font-black text-slate-900 mb-1">{report.disease_name}</h3>
                    <p className="text-[10px] font-bold text-slate-500 mb-2">{report.location_name}</p>
                    <div className={`px-2 py-0.5 rounded-full inline-block text-[8px] font-black uppercase tracking-widest text-white`} style={{ backgroundColor: getSeverityColor(report.severity) }}>
                      {report.severity} Severity
                    </div>
                  </div>
                </Popup>
              </Marker>
              <Circle 
                center={[report.latitude, report.longitude]} 
                radius={20000} // 20km
                pathOptions={{ 
                  fillColor: getSeverityColor(report.severity), 
                  color: getSeverityColor(report.severity),
                  fillOpacity: 0.1,
                  weight: 1
                }} 
              />
            </div>
          ))}
        </MapContainer>
      )}
      
      {/* Map Legend */}
      <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl z-[1000] space-y-2">
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
