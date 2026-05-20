"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  Layers, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  ArrowUpRight, 
  Loader2, 
  Compass, 
  Sparkles,
  Search,
  Sliders,
  Calendar,
  AlertTriangle
} from "lucide-react";

interface SatelliteData {
  success: boolean;
  region: string;
  lat: number;
  lng: number;
  description: string;
  isLive: boolean;
  indicators: {
    meanNDVI: number;
    maxNDVI: number;
    minNDVI: number;
    h2oStress: number;
    nitrogenLevel: string;
    estimatedYield: string;
    uniformity: string;
  };
  matrix: number[][];
  satelliteTelemetry: {
    source: string;
    cloudCover: string;
    resolution: string;
    lastPass: string;
    processingTime: string;
  };
}

export function SatelliteHealthPanel() {
  const [selectedRegion, setSelectedRegion] = useState<string>("rajshahi");
  const [data, setData] = useState<SatelliteData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [spectralMode, setSpectralMode] = useState<"ndvi" | "ndwi" | "false-color">("ndvi");
  const [fieldCoords, setFieldCoords] = useState("24.3745, 88.6042");
  const [fieldArea, setFieldArea] = useState("2.5");
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number; val: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fetch telemetry from API
  useEffect(() => {
    const fetchTelemetry = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/satellite/ndvi?region=${selectedRegion}`);
        const result = await res.json();
        if (result.success) {
          setData(result);
        }
      } catch (err) {
        console.error("Failed to fetch satellite telemetry:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTelemetry();
  }, [selectedRegion]);

  // Render multi-spectral matrix on HTML5 Canvas
  useEffect(() => {
    if (!data || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const matrix = data.matrix;
    const rows = matrix.length;
    const cols = matrix[0].length;
    
    // Scale canvas pixels
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const val = matrix[r][c];
        let color = "";

        if (spectralMode === "ndvi") {
          // Standard NDVI Color Map (Green = Healthy, Yellow = Moderate, Red = Stressed)
          if (val > 0.75) {
            color = `rgb(${Math.round(20 - (val - 0.75) * 50)}, ${Math.round(80 + (val - 0.75) * 400)}, ${Math.round(30 - (val - 0.75) * 30)})`; // deep healthy green
          } else if (val > 0.5) {
            color = `rgb(${Math.round(34 + (0.75 - val) * 400)}, 139, 34)`; // medium green
          } else if (val > 0.35) {
            color = `rgb(${Math.round(234 - (val - 0.35) * 200)}, ${Math.round(179 + (val - 0.35) * 100)}, 8)`; // amber/yellow
          } else {
            color = `rgb(${Math.round(220 + (0.35 - val) * 200)}, ${Math.round(38 - (0.35 - val) * 100)}, ${Math.round(38 - (0.35 - val) * 100)})`; // high stressed red
          }
        } else if (spectralMode === "ndwi") {
          // Moisture NDWI Index (Deep Blue = Wet, Cyan = Optimal, Light brown = Dry/Water Stress)
          if (val > 0.7) {
            color = `rgb(10, 37, ${Math.round(150 + (val - 0.7) * 300)})`; // high water saturation
          } else if (val > 0.5) {
            color = `rgb(56, 189, 248)`; // optimal moisture
          } else {
            color = `rgb(${Math.round(180 + (0.5 - val) * 150)}, ${Math.round(100 - (0.5 - val) * 100)}, 40)`; // dry soil
          }
        } else {
          // False Color Infrared (Magenta = Biomass peak, Orange = Soil/Dry, Cyan = Water body)
          if (val > 0.7) {
            color = `rgb(${Math.round(180 + (val - 0.7) * 250)}, 30, ${Math.round(180 + (val - 0.7) * 250)})`; // biomass
          } else if (val > 0.45) {
            color = `rgb(249, 115, 22)`; // orange soil
          } else {
            color = `rgb(6, 182, 212)`; // low reflectance
          }
        }

        ctx.fillStyle = color;
        ctx.fillRect(c * cellWidth, r * cellHeight, cellWidth, cellHeight);

        // Subtle grid lines for high-tech telemetry feeling
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.strokeRect(c * cellWidth, r * cellHeight, cellWidth, cellHeight);
      }
    }
  }, [data, spectralMode]);

  // Handle canvas mouse interaction to extract coordinates and pixel stats
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!data || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Scale coordinates accurately regardless of high DPI displays
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cols = data.matrix[0].length;
    const rows = data.matrix.length;

    const cellX = Math.floor((x / rect.width) * cols);
    const cellY = Math.floor((y / rect.height) * rows);

    if (cellX >= 0 && cellX < cols && cellY >= 0 && cellY < rows) {
      setHoveredCell({
        r: cellY,
        c: cellX,
        val: data.matrix[cellY][cellX]
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  return (
    <div ref={containerRef} className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-8 relative overflow-hidden group shadow-[0_32px_64px_-24px_rgba(0,0,0,0.04)] transition-all duration-700 hover:shadow-2xl">
      {/* Visual background grid pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.02] bg-[radial-gradient(#052E16_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        
        {/* Top bar header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-50">
          <div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#2D5A27] mb-2">
              <Compass className="h-4 w-4 animate-spin-slow text-[#2D5A27]" />
              Copernicus Satellite Intelligence
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-tight flex items-center gap-2.5">
              Live Field Health Analyzer
              <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
            </h3>
          </div>

          {/* Regional Picker Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1 rounded-2xl border border-slate-100">
            {[
              { id: "rajshahi", label: "Rajshahi" },
              { id: "dinajpur", label: "Dinajpur" },
              { id: "gazipur", label: "Gazipur" },
              { id: "sylhet", label: "Sylhet" },
              { id: "barisal", label: "Barisal" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedRegion(tab.id)}
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${selectedRegion === tab.id ? "bg-[#052E16] text-white shadow-md" : "text-slate-400 hover:text-slate-950"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Body Grid Layout */}
                  {/* Field Coordinate & Area Setup */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Field Coordinates (Lat, Lng)</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <input 
                  type="text" 
                  value={fieldCoords}
                  onChange={(e) => setFieldCoords(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="e.g. 24.3745, 88.6042"
                />
              </div>
            </div>
            <div className="w-full sm:w-32">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Area (Acres)</label>
              <input 
                type="number" 
                value={fieldArea}
                onChange={(e) => setFieldArea(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="2.5"
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 1500);
                }}
                className="h-[42px] px-6 bg-[#052E16] text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#2D5A27] transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
              >
                <Sparkles className="h-4 w-4" /> Scan Field
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Canvas - Interactive Map View */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* Spectral Filter Toggle */}
            <div className="flex items-center gap-2 mb-4 w-full bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              {[
                { id: "ndvi", label: "NDVI Index", desc: "Biomass Health" },
                { id: "ndwi", label: "NDWI Index", desc: "Moisture Levels" },
                { id: "false-color", label: "False Color", desc: "NIR Reflectance" }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSpectralMode(opt.id as any)}
                  className={`flex-1 py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${spectralMode === opt.id ? "bg-white text-slate-900 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-800"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Canvas wrapper with laser scan effect */}
            <div className="relative w-full aspect-square max-w-[320px] rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 shadow-inner group/canvas cursor-crosshair">
              
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-20 backdrop-blur-xs">
                  <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mb-4" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Streaming Copernicus Bands...</span>
                </div>
              ) : (
                <AnimatePresence>
                  {/* Laser scanline */}
                  <motion.div 
                    initial={{ y: "0%" }}
                    animate={{ y: "100%" }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#EAB308]/60 to-transparent shadow-[0_0_12px_#EAB308] z-10 pointer-events-none"
                  />
                </AnimatePresence>
              )}

              <canvas
                ref={canvasRef}
                width={240}
                height={240}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-full h-full object-cover transition-transform duration-700 group-hover/canvas:scale-105"
              />

              {/* Dynamic HUD Coordinate Display */}
              {hoveredCell && (
                <div className="absolute bottom-4 left-4 right-4 bg-[#052E16]/95 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-white z-20 shadow-2xl flex items-center justify-between">
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Target Field Matrix</div>
                    <div className="text-[12px] font-black">X: {hoveredCell.c} · Y: {hoveredCell.r}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Spectral Val</div>
                    <div className="text-[14px] font-black flex items-center gap-1.5">
                      <span className={hoveredCell.val > 0.6 ? "text-emerald-400" : hoveredCell.val > 0.4 ? "text-amber-400" : "text-red-400"}>
                        {hoveredCell.val}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-white/60">
                        {hoveredCell.val > 0.75 ? "Optimal" : hoveredCell.val > 0.45 ? "Moderate" : "Stressed"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Metrics - Telemetry & Analysis Info */}
          <div className="lg:col-span-6 space-y-6">
            
            {data ? (
              <>
                {/* Description */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Sector Classification</div>
                  <div className="text-[14px] font-bold text-slate-800">{data.description}</div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 hover:bg-slate-100/50 transition-colors">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Mean NDVI</div>
                    <div className="text-3xl font-black text-emerald-600 mb-1">{data.indicators.meanNDVI}</div>
                    <div className="text-[10px] font-medium text-slate-400">Peak chlorophyll</div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 hover:bg-slate-100/50 transition-colors">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Biomass Yield</div>
                    <div className="text-3xl font-black text-slate-900 mb-1">{data.indicators.estimatedYield.split(' ')[0]}</div>
                    <div className="text-[10px] font-medium text-slate-400">Tons per hectare</div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 hover:bg-slate-100/50 transition-colors">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">H2O Stress</div>
                    <div className="text-3xl font-black text-blue-600 mb-1">{data.indicators.h2oStress}</div>
                    <div className="text-[10px] font-medium text-slate-400">Root saturation</div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 hover:bg-slate-100/50 transition-colors">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Nitrogen Audit</div>
                    <div className="text-3xl font-black text-amber-500 mb-1">{data.indicators.nitrogenLevel}</div>
                    <div className="text-[10px] font-medium text-slate-400">Soil N distribution</div>
                  </div>
                </div>

                {/* Telemetry info logger */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2">
                    <span>Sat-Feed Origin:</span>
                    <span className="font-black text-slate-800">{data.satelliteTelemetry.source}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2">
                    <span>Cloud Coverage:</span>
                    <span className="font-black text-slate-800">{data.satelliteTelemetry.cloudCover}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2">
                    <span>Last Orbital Pass:</span>
                    <span className="font-black text-slate-800">{data.satelliteTelemetry.lastPass}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>Grid Resolution:</span>
                    <span className="font-black text-[#2D5A27]">{data.satelliteTelemetry.resolution}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300">Telemetry Stream Error</div>
            )}
          </div>
        </div>

        {/* Footer Audit CTA */}
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Linked with 14 Regional Nodes</span>
          </div>
          <button className="text-[11px] font-black uppercase tracking-[0.2em] text-[#2D5A27] flex items-center gap-3 group">
            Deep Spectral Audit <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
          </button>
        </div>

      </div>
    </div>
  );
}
