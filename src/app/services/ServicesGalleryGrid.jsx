// project/frontend/src/app/services/ServicesGalleryGrid.jsx
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function FuturisticGallery({ services = [], particleCount = 12, lazy = true }) {
  const gallery = useMemo(
    () => services.flatMap((s) => (s.gallery || []).map((img) => ({ ...img, serviceName: s.title }))),
    [services]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inView, setInView] = useState(!lazy);
  const [particles, setParticles] = useState([]);
  const sectionRef = useRef(null);

  // Lazy load on intersection
  useEffect(() => {
    if (!lazy) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [lazy]);

  // Particle effect – reduced count & opacity on mobile
  useEffect(() => {
    if (!inView) return;
    const isMobile = window.innerWidth < 768;
    setParticles(
      Array.from({ length: isMobile ? Math.min(particleCount, 6) : particleCount }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        hue: Math.floor(Math.random() * 360),
        speed: 3 + Math.random() * 2,
        delay: Math.random() * 2,
      }))
    );
  }, [inView, particleCount]);

  if (!gallery.length) {
    return (
      <section ref={sectionRef} className="py-16 md:py-20 text-center text-white/80">
        <h2 className="text-3xl md:text-4xl font-bold">Custom Patches Gallery Coming Soon</h2>
        <p className="mt-3 text-base md:text-lg text-gray-400">
          Ultra-premium custom patch visuals & USA-made designs loading soon...
        </p>
      </section>
    );
  }

  const selectedItem = gallery[selectedIndex];

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6 text-white"
      aria-labelledby="gallery-heading"
    >
      <h2
        id="gallery-heading"
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 text-center mb-8 md:mb-12"
      >
        Custom Patches Gallery USA – Premium Work Showcase
      </h2>

      {/* Floating particles */}
      {inView &&
        particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none blur-lg opacity-60 md:opacity-80"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: `hsl(${p.hue},80%,55%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              y: [`${p.y - 3}%`, `${p.y + 3}%`],
            }}
            transition={{ duration: p.speed, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          />
        ))}

      {/* Main gallery display */}
      <div className="relative mx-auto w-full aspect-[4/3] sm:aspect-[12/7] rounded-2xl overflow-hidden border-2 border-cyan-400/40 shadow-[0_0_40px_rgba(0,255,255,0.15)] bg-black/30">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full"
          >
            <Image
              src={selectedItem?.image_url || "/placeholder-service.jpg"}
              alt={`${selectedItem?.serviceName || "Custom Patch"} – Premium Custom Patches USA | No Minimum Order by Northern Patches`}
              fill
              quality={75}
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-contain"
              priority={selectedIndex < 3}
              fetchPriority={selectedIndex < 3 ? "high" : "low"}
              placeholder="blur"
              decoding="async"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      <div className="mt-6 sm:mt-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
        {gallery.map((img, idx) => (
          <div
            key={idx}
            className={`relative w-full aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 touch-manipulation
              ${
                idx === selectedIndex
                  ? "border-cyan-400 scale-105 z-10 shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                  : "border-white/20 hover:border-cyan-400 hover:scale-105"
              }`}
            onClick={() => setSelectedIndex(idx)}
            role="button"
            tabIndex={0}
            aria-label={`View ${img.serviceName || "custom patch"} gallery image ${idx + 1}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedIndex(idx);
              }
            }}
          >
            <Image
              src={img.image_url || "/placeholder-service.jpg"}
              alt={`${img.serviceName || "Custom Patch"} – Premium Custom Patches USA Gallery | Northern Patches`}
              fill
              quality={68}
              sizes="180px"
              className="object-contain"
              loading="lazy"
              placeholder="blur"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </section>
  );
}