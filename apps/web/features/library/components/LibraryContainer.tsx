"use client";
import { useState, useMemo } from "react";
import { LibraryHero, LibrarySidebar } from "./LibraryLayout";
import { LibraryGrid, LibraryDetails } from "./LibraryContent";
import { diseases, Disease } from "../data/diseases";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Zap, MessageSquare, FilterX } from "lucide-react";
import Link from "next/link";

export function LibraryContainer() {
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrops, setSelectedCrops] = useState<string[]>(["Rice"]);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);

  const filteredDiseases = useMemo(() => {
    return diseases.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            d.nameBn.includes(searchQuery) ||
                            d.crop.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCrop = selectedCrops.length === 0 || selectedCrops.includes(d.crop);
      const matchesSeverity = selectedSeverities.length === 0 || selectedSeverities.includes(d.severity);
      return matchesSearch && matchesCrop && matchesSeverity;
    });
  }, [searchQuery, selectedCrops, selectedSeverities]);

  const currentDiseases = filteredDiseases.slice(0, visibleCount);

  const handleView = (d: Disease) => {
    setSelectedDisease(d);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <LibraryHero onSearch={setSearchQuery} />

      <div className="max-w-[1400px] mx-auto px-6 py-12 relative z-20">
        <div className="grid lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-3">
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
                    <div className="mt-16 flex flex-col items-center gap-4">
                       <button 
                        onClick={() => setVisibleCount(prev => prev + 20)}
                        className="px-10 py-4 rounded-2xl bg-[#052E16] text-white text-[11px] font-black uppercase tracking-widest hover:bg-earth-900 transition-all"
                       >
                         Load More
                       </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Condensed CTA Section */}
      <div className="bg-[#052E16] py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Can&apos;t find what you&apos;re looking for?</h2>
          <p className="text-earth-200 mb-10 text-sm font-medium">Identify crop diseases instantly with 98% accuracy.</p>
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
