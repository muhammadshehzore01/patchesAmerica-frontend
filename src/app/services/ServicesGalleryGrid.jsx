"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FuturisticGallery({ services = [], particleCount = 12, lazy = true }) {
  const gallery = useMemo(
    () => services.flatMap(s => (s.gallery || []).map(img => ({ ...img, serviceName: s.title }))),
    [services]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inView, setInView] = useState(!lazy);
  const [particles, setParticles] = useState([]);
  const sectionRef = useRef(null);

  // Lazy load on intersection
  useEffect(() => {
    if (!lazy) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [lazy]);

  // Particle effect
  useEffect(() => {
    if (!inView) return;
    setParticles(
      Array.from({ length: particleCount }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 5,
        hue: Math.floor(Math.random() * 360),
        speed: 3 + Math.random() * 2,
        delay: Math.random() * 2,
      }))
    );
  }, [inView, particleCount]);

  if (!gallery.length) return (
    <section ref={sectionRef} className="py-20 text-center text-white">
      <h2 className="text-4xl font-bold">Gallery Coming Soon</h2>
      <p className="mt-4 text-gray-400">Ultra-premium visuals loading soon...</p>
    </section>
  );

  const selectedItem = gallery[selectedIndex];

  return (
    <section ref={sectionRef} className="relative py-20 max-w-6xl mx-auto px-4 text-white">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 gradient-heading">
        Our Work Gallery
      </h2>

      {/* Floating particles */}
      {inView && particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none blur-lg"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`, background: `hsl(${p.hue},80%,55%)` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.7, 0.2], y: [`${p.y - 3}%`, `${p.y + 3}%`] }}
          transition={{ duration: p.speed, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}

      {/* Main gallery display */}
      <div className="relative mx-auto w-full md:w-4/5 aspect-[12/7] rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_40px_rgba(0,255,255,0.2)] bg-black/20">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedIndex}
            src={selectedItem?.image_url || "/placeholder-service.jpg"}
            alt={selectedItem?.serviceName || "Gallery Image"}
            className="w-full h-full object-contain"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.6 }}
          />
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {gallery.map((img, idx) => (
          <div
            key={idx}
            className={`relative w-full h-24 rounded-xl overflow-hidden cursor-pointer border transition-all duration-300
              ${idx === selectedIndex ? "border-cyan-400 scale-105 z-10 shadow-[0_0_15px_rgba(0,255,255,0.5)]" : "border-white/20 hover:border-cyan-400 hover:scale-105"}`}
            onClick={() => setSelectedIndex(idx)}
          >
            <img src={img.image_url || "/placeholder-service.jpg"} alt={img.serviceName} className="w-full h-full object-contain" />
          </div>
        ))}
      </div>
    </section>
  );
}
