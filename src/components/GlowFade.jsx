// src/components/GlowFade.jsx
"use client";

import { motion } from "framer-motion";

export default function GlowFade({ className = "" }) {
  return (
    <div className={`pointer-events-none fixed inset-x-0 bottom-0 z-10 ${className}`}>
      {/* Primary brand glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[320px] bg-gradient-to-t
                   from-blue-500/25 via-purple-400/15 to-transparent blur-3xl"
        animate={{ opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary accent glow */}
      <motion.div
        className="absolute bottom-0 left-1/4 right-1/4 h-[260px] bg-gradient-to-t
                   from-pink-400/20 via-transparent to-transparent blur-[90px]"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
