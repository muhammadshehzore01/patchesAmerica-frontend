"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function HeroSlider({ slides = [] }) {
  const [index, setIndex] = useState(0);
  const timer = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide every 6.5s, pause on hover
  useEffect(() => {
    if (!slides.length) return;
    if (isHovered) return;

    timer.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6500);

    return () => clearInterval(timer.current);
  }, [slides.length, isHovered]);

  if (!slides.length) {
    return (
      <div className="h-[80vh] min-h-[600px] bg-gradient-to-br from-[#0a1326] to-[#111827]" />
    );
  }

  const slide = slides[index];
  const ctaText = slide.cta_text || "Get Your Free Quote →";
  const ctaUrl = slide.cta_url || "/quote";
  const badgeText = slide.badge_text || "Limited Offer!";

  return (
    <section
      className="relative z-0 flex items-center justify-center overflow-hidden pt-20"
      style={{ minHeight: "calc(80vh)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slide Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <Image
            src={slide.image_url || slide.image || "/placeholder-hero.jpg"}
            alt={slide.title || "Premium Custom Patches - Northern Patches USA"}
            fill
            className="object-contain brightness-[0.7] contrast-[1.1]"
            priority={index === 0}
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-purple-900/10" />
        </motion.div>
      </AnimatePresence>

      {/* Slide Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        {/* Badge / Offer */}
        {badgeText && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block mb-4 px-4 py-2 bg-red-600 text-white font-bold rounded-full shadow-lg uppercase tracking-wide animate-pulse"
          >
            {badgeText}
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-2xl"
        >
          {slide.title || "Craft Premium Custom Patches"}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto"
        >
          {slide.subtitle ||
            "Embroidered • PVC • Chenille • Fast USA Shipping • Expert Craftsmanship"}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.9 }}
        >
          <Link
            href={ctaUrl}
            className="inline-block px-12 py-5 text-xl font-semibold rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-xl hover:shadow-2xl text-white transition-all duration-300 scale-100 hover:scale-105"
            aria-label={ctaText}
          >
            {ctaText}
          </Link>
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
        className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20 p-4 glass rounded-full text-white hover:bg-white/10 transition-all duration-300"
        aria-label="Previous slide"
      >
        <FiChevronLeft size={32} />
      </button>
      <button
        onClick={() => setIndex((i) => (i + 1) % slides.length)}
        className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 p-4 glass rounded-full text-white hover:bg-white/10 transition-all duration-300"
        aria-label="Next slide"
      >
        <FiChevronRight size={32} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === index ? "bg-white scale-125" : "bg-white/50"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
