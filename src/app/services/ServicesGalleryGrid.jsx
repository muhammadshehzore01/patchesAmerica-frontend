
// frontend\src\app\services\ServicesGalleryGrid.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getGalleryImage } from "@/lib/media";

export default function FuturisticGallery({ services = [], particleCount = 18, lazy = true }) {
  const gallery = Array.isArray(services)
    ? services.flatMap((s) =>
        (s.gallery || []).map((img) => ({ ...img, serviceName: s.title }))
      ).filter(Boolean)
    : [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inView, setInView] = useState(!lazy);
  const [particles, setParticles] = useState([]);
  const sectionRef = useRef(null);

  // Lazy load observer
  useEffect(() => {
    if (!lazy) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [lazy]);

  // Generate floating particles
  const genParticles = (n = particleCount) =>
    Array.from({ length: n }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 5,
      hue: Math.floor(Math.random() * 360),
      speed: 3 + Math.random() * 3,
      delay: Math.random() * 2,
    }));

  useEffect(() => {
    if (inView) setParticles(genParticles());
  }, [inView, particleCount]);

  if (!gallery.length)
    return (
      <section className="py-20 text-center text-white bg-black/20 rounded-xl backdrop-blur-md border border-neon-blue/20">
        <h2 className="text-4xl font-orbitron tracking-widest text-neon-blue animate-pulse">
          Gallery Coming Soon
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          Ultra-premium visuals loading soon...
        </p>
      </section>
    );

  const selectedItem = gallery[selectedIndex];

  return (
    <section ref={sectionRef} className="relative max-w-6xl mx-auto px-6 py-24 text-white">
      {/* SEO Heading */}
      <h2 className="text-4xl font-extrabold text-center mb-10">
        Our Work Gallery
      </h2>

      {/* Structured Data for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "Northren Patches Gallery",
            "url": "https://northren-patches.au/gallery",
            "images": gallery.map((img) => ({
              "@type": "ImageObject",
              "url": getGalleryImage(img),
              "caption": img.serviceName ? `${img.serviceName} - Patch Gallery` : "Northren Patch Gallery"
            }))
          })
        }}
      />

      {/* Neon Particles */}
      {inView &&
        particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none blur-xl"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: `hsl(${p.hue}, 80%, 55%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.2, 0.7, 0.2],
              y: [`${p.y - 3}%`, `${p.y + 3}%`],
            }}
            transition={{ duration: p.speed, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          />
        ))}

      {/* Featured Image */}
      <div className="relative mx-auto w-full md:w-4/5 aspect-[12/7] rounded-2xl overflow-hidden border-2 border-neon-blue/50 shadow-neon-xl backdrop-blur-md bg-black/20">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex items-center justify-center p-4"
          >
            <Image
              src={getGalleryImage(selectedItem)}
              alt={selectedItem?.serviceName ? `${selectedItem.serviceName} - Patch Gallery` : `Gallery Image ${selectedIndex + 1}`}
              fill
              style={{ objectFit: "contain" }}
              className="rounded-xl"
              placeholder="empty"
            />
          </motion.div>
        </AnimatePresence>

        {/* Neon border glow */}
        <div className="absolute inset-0 rounded-2xl border-2 border-gradient-to-r from-purple-500 via-pink-400 to-blue-400 pointer-events-none shadow-[0_0_50px_rgba(46,102,255,0.45)] animate-pulse-slow" />
      </div>

      {/* Service Name */}
      <h3 className="mt-4 text-center text-2xl font-orbitron text-neon-pink tracking-wide">
        {selectedItem?.serviceName || "Service Name"}
      </h3>

      {/* Thumbnails */}
      <div className="mt-10 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-4 justify-center">
        {gallery.map((img, idx) => (
          <motion.div
            key={idx}
            className={`relative w-full h-20 rounded-xl overflow-hidden cursor-pointer border transition-all duration-500 perspective-3d tilt-card ${
              idx === selectedIndex
                ? "border-neon-pink shadow-neon-xl scale-110 z-10"
                : "border-white/20 hover:border-neon-blue hover:scale-105"
            }`}
            onClick={() => setSelectedIndex(idx)}
            whileHover={{ scale: 1.1, rotateY: 5, rotateX: 3 }}
          >
            <Image
              src={getGalleryImage(img)}
              alt={img.serviceName ? `${img.serviceName} Thumbnail` : `Gallery Thumbnail ${idx + 1}`}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-xl shadow-[0_0_15px_rgba(134,168,255,0.25)]"
              placeholder="empty"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-purple-500/20 via-pink-300/10 to-blue-400/10 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
