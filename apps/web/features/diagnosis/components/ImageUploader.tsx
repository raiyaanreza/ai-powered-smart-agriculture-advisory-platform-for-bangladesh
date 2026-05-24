"use client";
import { useState, useRef } from "react";
import { Upload, Camera, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ImageUploaderProps {
  onUpload: (base64: string) => void;
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onUpload(e.target.result as string);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`relative h-full min-h-[420px] rounded-[2.5rem] p-12 border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden
        ${dragActive 
          ? "border-emerald-600 bg-emerald-50/30 dark:bg-emerald-950/15 shadow-[0_20px_50px_rgba(16,185,129,0.15)]" 
          : "border-slate-200/85 dark:border-slate-800 bg-card hover:border-emerald-600/50 hover:shadow-[0_30px_70px_-20px_rgba(5,46,22,0.08)]"
        }
      `}
      onDragEnter={() => setDragActive(true)}
      onDragLeave={() => setDragActive(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
    >
      {/* Background Soft Ambient Light */}
      <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-yellow-500/5 blur-3xl pointer-events-none" />

      {/* Modern Scanning Grid Line decoration */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none bg-[radial-gradient(rgba(128,128,128,0.35)_1px,transparent_1px)] [background-size:16px_16px]" />

      <input 
        ref={inputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Floating Animated Leaf/Uploader Icon */}
      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="h-20 w-20 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/30 flex items-center justify-center mb-6 shadow-sm border border-emerald-100/50 dark:border-emerald-900/30 relative group"
      >
        <div className="relative">
          <ImageIcon className="h-9 w-9 text-emerald-700 dark:text-emerald-455 transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-amber-400 dark:bg-amber-500 flex items-center justify-center border border-white dark:border-slate-900 shadow-sm">
             <span className="text-[11px] font-black text-emerald-950">+</span>
          </div>
        </div>
      </motion.div>

      <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2 tracking-tight">Identify Crop Disease</h3>
      <p className="text-sm text-slate-400 dark:text-slate-500 mb-8 max-w-xs mx-auto font-medium">
        Drag and drop photos or browse to start. Supported: JPG, PNG (Max 10MB).
      </p>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-10 py-4 rounded-2xl bg-amber-400 dark:bg-amber-500 text-emerald-950 dark:text-emerald-955 text-xs font-black uppercase tracking-widest shadow-xl shadow-yellow-500/10 hover:shadow-yellow-500/20 transition-all animate-pulse-ring"
      >
        Browse Photo Library
      </motion.button>
    </motion.div>
  );
}
