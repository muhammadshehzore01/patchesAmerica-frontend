"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getSlideImage } from "@/lib/media";

export default function Slider({ slides = [] }) {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);
  const [particles, setParticles] = useState([]);

  // Generate floating particles
  const genParticles = (n = 60) =>
    Array.from({ length: n }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: 1 + Math.random() * 3,
      d: 5 + Math.random() * 8,
      delay: Math.random() * 2,
      hue: Math.floor(Math.random() * 360),
    }));

  useEffect(() => setParticles(genParticles()), []);

  // Auto slide
  useEffect(() => {
    if (!slides.length) return;
    const play = () => setIndex((i) => (i + 1) % slides.length);
    timeoutRef.current = setInterval(play, 7000);
    return () => clearInterval(timeoutRef.current);
  }, [slides]);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);
  const slide = slides[index];

  if (!slides.length)
    return <div className="h-[600px] md:h-[700px] bg-black/20 rounded-3xl" />;

  return (
    <div className="relative h-[700px] md:h-[800px] overflow-hidden rounded-3xl">
      {/* Neon Particles */}
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full pointer-events-none blur-xl"
          style={{
            width: p.s,
            height: p.s,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `hsl(${p.hue}, 90%, 55%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.7, 0.1], y: [`${p.y - 2}%`, `${p.y + 2}%`] }}
          transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}

      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id || index}
          className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-neon-xl"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1 }}
        >
          <Image
            src={getSlideImage(slide)}
            alt={`${slide.title || ""} ${slide.subtitle || ""}`.trim() || "Slide image"}
            fill
            className="object-cover rounded-3xl"
            priority={index === 0} // only first slide priority
          />

          {/* Gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/10 to-blue-500/20"
            animate={{ opacity: [0.7, 0.4, 0.7] }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          {/* Text */}
          <div className="absolute left-6 md:left-16 top-1/3 z-20 max-w-xl">
            {slide.title && (
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-neon-pink drop-shadow-[0_0_20px_hsl(320,100%,65%)]"
              >
                {slide.title}
              </motion.h2>
            )}
            {slide.subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="mt-4 text-lg md:text-xl text-white/90 drop-shadow-md"
              >
                {slide.subtitle}
              </motion.p>
            )}
            {slide.cta_text && (
              <motion.a
                href={slide.cta_url || "#"}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-6 inline-block px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 font-semibold shadow-[0_0_35px_rgba(255,0,255,0.6)] hover:shadow-[0_0_60px_rgba(255,0,255,0.9)] text-white tracking-wider"
              >
                {slide.cta_text}
              </motion.a>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <button
        aria-label="Previous Slide"
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl z-30 p-4 bg-black/30 rounded-full hover:bg-black/50 shadow-neon-xl transition-all"
      >
        ‹
      </button>
      <button
        aria-label="Next Slide"
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl z-30 p-4 bg-black/30 rounded-full hover:bg-black/50 shadow-neon-xl transition-all"
      >
        ›
      </button>

      {/* Pagination */}
      <div className="absolute left-1/2 bottom-6 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-3 h-3 rounded-full transition-all ${
              i === index
                ? "bg-neon-pink scale-125 shadow-[0_0_15px_hsl(320,100%,65%)]"
                : "bg-white/30 hover:scale-110"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
