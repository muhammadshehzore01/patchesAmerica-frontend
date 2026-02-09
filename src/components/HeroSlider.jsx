// src/components/HeroSlider.jsx
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
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!slides.length || isHovered || isFocused) return;

    timer.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer.current);
  }, [slides.length, isHovered, isFocused]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setIndex((prev) => (prev - 1 + slides.length) % slides.length);
      } else if (e.key === "ArrowRight") {
        setIndex((prev) => (prev + 1) % slides.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length]);

  if (!slides.length) {
    return (
      <div className="h-[50vh] min-h-[380px] md:h-[70vh] bg-gradient-to-br from-[#0a1326] to-[#111827]" />
    );
  }

  const slide = slides[index];
  const ctaText = slide.cta_text || "Get Your Free Quote →";
  const ctaUrl = slide.cta_url || "/quote";
  const badgeText = slide.badge_text || "Limited Offer!";
  const altText =
    slide.alt ||
    slide.title ||
    `Custom embroidered patches USA - Northern Patches - Slide ${index + 1}`;

  const handleQuoteClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "quote_click", {
        event_category: "CTA",
        event_label: "Hero Slider",
        page_path: window.location.pathname,
        value: 1,
      });
    }
  };

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden h-[50vh] min-h-[380px] md:h-[70vh] md:min-h-[500px] focus:outline-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
    >
      
      <Image
        src={slide.image_url || slide.image || "/media/sliders/Adobe_Express_-_file_33.webp"}
        alt={altText}
        fill
        priority={index === 0}                 // ← This auto-preloads the LCP image
        fetchPriority={index === 0 ? "high" : "low"}
        quality={68}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 85vw, 1400px"
        placeholder="blur"
        className="object-cover md:object-contain"
        decoding="async"
        loading={index === 0 ? "eager" : "lazy"}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-purple-900/10" />
        </motion.div>
      </AnimatePresence>

      <div aria-live="polite" className="sr-only">
        Slide {index + 1} of {slides.length}: {slide.title || "Premium Custom Patches USA"}
      </div>

      <div className="relative z-20 text-center px-6 max-w-5xl">
        {badgeText && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block mb-4 px-4 py-2 bg-red-600 text-white font-bold rounded-full shadow-lg uppercase tracking-wide text-sm md:text-base"
          >
            {badgeText}
          </motion.div>
        )}

        <motion.h1
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400"
        >
          {slide.title || "Craft Premium Custom Patches USA"}
        </motion.h1>

        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="text-lg sm:text-xl md:text-2xl mb-8 md:mb-10 opacity-90 max-w-3xl mx-auto"
        >
          {slide.subtitle ||
            "Custom embroidered patches USA, custom PVC patches no minimum, custom chenille patches for jackets, custom woven patches for hats, custom leather patches for bags – fast US shipping"}
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.9 }}
        >
          <Link
            href={ctaUrl}
            onClick={handleQuoteClick}
            className="inline-block px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-semibold rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-xl hover:shadow-2xl text-white transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            {ctaText}
          </Link>
        </motion.div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={() => setIndex((prev) => (prev - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-4 glass rounded-full hover:bg-white/20 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
      >
        <FiChevronLeft className="w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12" />
      </button>

      <button
        onClick={() => setIndex((prev) => (prev + 1) % slides.length)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-4 glass rounded-full hover:bg-white/20 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
      >
        <FiChevronRight className="w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12" />
      </button>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1} of ${slides.length}`}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              i === index ? "bg-white scale-125 shadow-md" : "bg-white/50 hover:bg-white/80"
            } focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2`}
          />
        ))}
      </div>
    </section>
  );
}