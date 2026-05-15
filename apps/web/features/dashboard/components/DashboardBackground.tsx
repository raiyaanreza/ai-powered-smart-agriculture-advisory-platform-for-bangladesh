"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const nodes = [
  { id: 1, x: 50, y: 55, name: "Dhaka" },
  { id: 2, x: 70, y: 75, name: "Chittagong" },
  { id: 3, x: 30, y: 45, name: "Rajshahi" },
  { id: 4, x: 35, y: 65, name: "Khulna" },
  { id: 5, x: 60, y: 35, name: "Sylhet" },
  { id: 6, x: 45, y: 25, name: "Rangpur" },
  { id: 7, x: 55, y: 70, name: "Barisal" },
  { id: 8, x: 55, y: 45, name: "Mymensingh" },
];

const connections = [
  [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8],
  [2, 7], [3, 6], [4, 7], [5, 8], [8, 6]
];

export function DashboardBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-1] bg-[#052E16] overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#052E16] via-[#064E3B] to-[#052E16] opacity-90" />
      
      {/* Bangladesh Map Outline (Simplified SVG) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="h-[90vh] w-[90vh] text-green-400 fill-current">
          <path d="M45,15 L55,12 L65,15 L70,25 L75,35 L72,45 L78,55 L82,65 L78,75 L70,85 L60,95 L50,92 L40,95 L30,85 L25,75 L20,65 L22,55 L18,45 L25,35 L35,25 Z" />
        </svg>
      </div>

      {/* Connection Lines */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none">
        {connections.map(([startId, endId], index) => {
          const start = nodes.find(n => n.id === startId)!;
          const end = nodes.find(n => n.id === endId)!;
          return (
            <motion.line
              key={`conn-${index}`}
              x1={`${start.x}%`}
              y1={`${start.y}%`}
              x2={`${end.x}%`}
              y2={`${end.y}%`}
              stroke="rgba(74, 222, 128, 0.2)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 0], 
                opacity: [0, 0.5, 0],
                stroke: ["rgba(74, 222, 128, 0.2)", "rgba(234, 179, 8, 0.4)", "rgba(74, 222, 128, 0.2)"]
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </svg>

      {/* Glowing Nodes */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          {/* Node Core */}
          <motion.div
            className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)]"
            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Node Ripple */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-green-400/20"
            animate={{ scale: [1, 2], opacity: [0.3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
          />

          {/* Node Label (Subtle) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-green-400/30 uppercase tracking-[0.2em] whitespace-nowrap">
            {node.name}
          </div>
        </div>
      ))}

      {/* Random Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute h-1 w-1 rounded-full bg-white/20"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            scale: Math.random()
          }}
          animate={{
            y: [null, (Math.random() - 0.5) * 20 + "%"],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Scanning Line Effect */}
      <motion.div 
        className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-green-400/20 to-transparent shadow-[0_0_20px_rgba(74,222,128,0.1)]"
        animate={{ y: ["0%", "100%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
