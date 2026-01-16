// src/components/LuxuryOverlay.jsx
"use client";

import { motion } from "framer-motion";

export default function LuxuryOverlay({ className = "" }) {
  return (
    <div className={`pointer-events-none fixed inset-0 z-0 ${className}`}>
      {/* Primary soft gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white/10" />

      {/* Animated aurora blobs */}
      <motion.div
        className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-blue-400/20 blur-[120px]"
        animate={{ x: [0, 60, -40], y: [0, 40, -30] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[20%] -right-40 w-[520px] h-[520px] rounded-full bg-purple-400/20 blur-[120px]"
        animate={{ x: [0, -60, 40], y: [0, -30, 50] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-200px] left-1/3 w-[520px] h-[520px] rounded-full bg-pink-300/20 blur-[140px]"
        animate={{ y: [0, -50, 30] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle futuristic grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.35) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.35) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Luxury grain */}
      <div className="absolute inset-0 grain" />
    </div>
  );
}
