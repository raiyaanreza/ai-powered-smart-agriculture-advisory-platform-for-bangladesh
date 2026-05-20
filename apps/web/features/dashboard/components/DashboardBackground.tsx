"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const PARTICLE_COUNT = 15;

export function DashboardBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1.5 + Math.random() * 3.5,
    duration: 14 + Math.random() * 20,
    delay: Math.random() * 10,
    driftX: (Math.random() - 0.5) * 40,
    driftY: (Math.random() - 0.5) * 40,
  }));

  return (
    <div className="fixed inset-0 z-[-1] bg-white overflow-hidden">
      {/* Primary dotted pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      {/* Secondary offset dots for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.04) 1.5px, transparent 1.5px)`,
          backgroundSize: "48px 48px",
          backgroundPosition: "12px 12px",
        }}
      />

      {/* Ambient light glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-1/6 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-emerald-50/40 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/6 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-teal-50/30 to-transparent blur-3xl pointer-events-none" />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: p.size > 2.5
              ? "radial-gradient(circle, rgba(45,90,39,0.3), rgba(45,90,39,0.08))"
              : "radial-gradient(circle, rgba(45,90,39,0.18), transparent)",
            boxShadow: p.size > 3 ? "0 0 8px rgba(45,90,39,0.1)" : "none",
          }}
          animate={{
            x: [0, p.driftX, p.driftX * -0.6, 0],
            y: [0, p.driftY * -1, p.driftY * 0.7, 0],
            scale: [1, 1.8, 0.7, 1],
            opacity: [0.15, 0.65, 0.25, 0.15],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Large ambient drifting blobs */}
      {[
        { w: 200, h: 200, l: "15%", t: "20%", d: 30 },
        { w: 160, h: 160, l: "65%", t: "60%", d: 35 },
        { w: 120, h: 120, l: "40%", t: "75%", d: 40 },
      ].map((blob, i) => (
        <motion.div
          key={`blob-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: blob.w,
            height: blob.h,
            left: blob.l,
            top: blob.t,
            background: i === 1
              ? "radial-gradient(circle, rgba(5,46,22,0.03) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(45,90,39,0.03) 0%, transparent 70%)",
          }}
          animate={{
            x: [0, 20, -12, 8, 0],
            y: [0, -18, 14, -8, 0],
            scale: [1, 1.12, 0.92, 1.05, 1],
          }}
          transition={{
            duration: blob.d,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}