"use client";
import { useState, useMemo } from "react";
import { LibraryHero, LibrarySidebar } from "./LibraryLayout";
import { LibraryGrid, LibraryDetails } from "./LibraryContent";
import { diseases as staticDiseases, Disease } from "../data/diseases";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Zap, MessageSquare, FilterX, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function LibraryContainer() {
  const [dbDiseases, setDbDiseases] = useState<Disease[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrops, setSelectedCrops] = useState<string[]>(["Rice"]);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDbDiseases();
  }, []);

  const fetchDbDiseases = async () => {
    const { data } = await supabase.from("diseases").select("*");
    if (data) setDbDiseases(data as Disease[]);
    setLoading(false);
  };

  const allDiseases = useMemo(() => {
    return [...dbDiseases, ...staticDiseases];
  }, [dbDiseases]);

  const filteredDiseases = useMemo(() => {
    return allDiseases.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.nameBn.includes(searchQuery) ||
        d.crop.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCrop = selectedCrops.length === 0 || selectedCrops.includes(d.crop);
      const matchesSeverity = selectedSeverities.length === 0 || selectedSeverities.includes(d.severity);
      return matchesSearch && matchesCrop && matchesSeverity;
    });
  }, [allDiseases, searchQuery, selectedCrops, selectedSeverities]);

  const currentDiseases = filteredDiseases.slice(0, visibleCount);

  const resultStats = [
    { label: "Live entries", value: `${allDiseases.length}+` },
    { label: "Search matches", value: `${filteredDiseases.length}` },
    { label: "Active crops", value: `${selectedCrops.length}` },
  ];

  const handleView = (d: Disease) => {
    setSelectedDisease(d);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(74,85,104,0.08),_transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
      <LibraryHero onSearch={setSearchQuery} />

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 grid gap-4 md:grid-cols-3"
        >
          {resultStats.map((stat) => (
            <div key={stat.label} className="rounded-[1.75rem] border border-white/70 bg-white/85 backdrop-blur-xl p-5 shadow-lg shadow-slate-200/50">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{stat.label}</div>
              <div className="text-2xl font-black tracking-tighter text-slate-900">{stat.value}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10">

          <div className="lg:col-span-3 lg:sticky lg:top-6 self-start">
            <LibrarySidebar
              selectedCrops={selectedCrops}
              onToggleCrop={(c) => setSelectedCrops(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
              onReset={() => { setSelectedCrops([]); setSelectedSeverities([]); setSearchQuery(""); }}
              selectedSeverities={selectedSeverities}
              onToggleSeverity={(s) => setSelectedSeverities(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
            />
          </div>

          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {selectedDisease ? (
                <LibraryDetails
                  key="details"
                  disease={selectedDisease}
                  onBack={() => setSelectedDisease(null)}
                />
              ) : (
                <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      Showing {filteredDiseases.length} Results
                    </h2>
                    <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-500 focus:outline-none">
                      <option>Relevance</option>
                      <option>Newest</option>
                    </select>
                  </div>

                  <LibraryGrid diseases={currentDiseases} onView={handleView} />

                  {visibleCount < filteredDiseases.length && (
                    <motion.div
                      className="mt-16 flex flex-col items-center gap-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Showing {visibleCount} of {filteredDiseases.length} diseases
                      </span>
                      <button
                        onClick={() => setVisibleCount(prev => prev + 20)}
                        className="group relative px-10 py-4 rounded-2xl bg-[#052E16] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#1A321A] transition-all overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          Load More
                          <motion.svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            animate={{ y: [0, 3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <path d="m6 9 6 6 6-6" />
                          </motion.svg>
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            {loading && (
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-[340px] rounded-[2rem] bg-white border border-slate-100 shadow-sm animate-pulse" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Condensed CTA Section */}
      <div className="relative overflow-hidden py-16 bg-[#052E16]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_24%)]" />
        <motion.div
          aria-hidden="true"
          className="absolute -top-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-gold-500/15 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-gold-300 mb-6">
              <Sparkles className="h-3.5 w-3.5" /> Expert-curated library
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Can&apos;t find what you&apos;re looking for?</h2>
            <p className="text-earth-200 mb-10 text-sm md:text-base font-medium max-w-2xl mx-auto">Explore the latest disease guidance, then move straight into AI diagnosis if you need a fresh analysis.</p>
          </motion.div>
          <div className="flex items-center justify-center gap-4">
            <Link href="/diagnose" className="h-12 px-8 rounded-xl bg-gold-500 text-[#052E16] font-black text-xs flex items-center gap-2 hover:bg-gold-400 transition-all shadow-xl shadow-gold-500/10">
              <Zap className="h-4 w-4" /> Launch AI Diagnosis
            </Link>
            <button className="h-12 px-8 rounded-xl bg-white/10 text-white font-black text-xs border border-white/20 hover:bg-white/20 transition-all">
              Consult Expert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
