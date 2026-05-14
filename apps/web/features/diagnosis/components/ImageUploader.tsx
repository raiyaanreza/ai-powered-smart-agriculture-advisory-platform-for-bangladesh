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
    <div 
      className={`relative h-full min-h-[400px] rounded-[2rem] p-12 border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer bg-white
        ${dragActive ? "border-earth-700 bg-earth-50/20" : "border-slate-200 hover:border-earth-700/50"}
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
      <input 
        ref={inputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="h-16 w-16 rounded-2xl bg-earth-50 flex items-center justify-center mb-6">
        <div className="relative">
          <ImageIcon className="h-8 w-8 text-earth-700" />
          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-white flex items-center justify-center border border-earth-700">
             <span className="text-[10px] font-black text-earth-700">+</span>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-black text-slate-800 mb-2">Identify Crop Disease</h3>
      <p className="text-sm text-slate-400 mb-8 max-w-xs mx-auto">
        Drag and drop photos or browse to start. Supported: JPG, PNG (Max 10MB).
      </p>

      <button className="px-8 py-3 rounded-xl bg-[#FBBF24] text-[#78350F] text-sm font-black shadow-lg shadow-yellow-200 hover:scale-[1.02] active:scale-[0.98] transition-all">
        Browse Photo Library
      </button>
    </div>
  );
}
