"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useHomeData } from "@/hooks/useApiHooks";
import { getSlideImage } from "@/lib/media";
import { useState, useEffect } from "react";

export default function HeroSlider() {
  const { sliders, isLoading, isError } = useHomeData();
  const [current, setCurrent] = useState(0);

  // Auto slide every 6s
  useEffect(() => {
    if (!sliders || sliders.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliders.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [sliders]);

  if (isError) return <p className="text-center mt-10 text-red-500">Failed to load slides.</p>;
  if (isLoading) return <p className="text-center mt-10">Loading slides...</p>;
  if (!sliders || sliders.length === 0) return null;

  const slide = sliders[current];

  // --- Variants ---
  const imageVariants = {
    initial: { opacity: 0, scale: 1.1, rotate: 1 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 0.95, rotate: -1 },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 60, skewY: 5 },
    visible: { opacity: 1, y: 0, skewY: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  const ctaVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { delay: 0.3, duration: 0.6, ease: "easeOut" } 
    },
    hover: { scale: 1.05, textShadow: "0 0 15px rgba(255,255,255,0.8)", boxShadow: "0 0 20px rgba(0,255,255,0.6)" },
  };

  return (
    <section className="relative w-full h-[80vh] overflow-hidden bg-gradient-to-r from-cyan-900 via-purple-900 to-pink-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="absolute inset-0 w-full h-full"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={imageVariants}
          transition={{ duration: 1.5 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, info) => {
            if (info.offset.x < -50) setCurrent((prev) => (prev + 1) % sliders.length);
            if (info.offset.x > 50) setCurrent((prev) => (prev - 1 + sliders.length) % sliders.length);
          }}
        >
          {/* Background */}
          <motion.img
            src={getSlideImage(slide)}
            alt={slide.title || "Slide"}
            className="w-full h-full object-contain brightness-75"
            variants={imageVariants}
          />

          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10" />

          {/* Text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center px-6 md:px-0 z-20">
            {slide.title && (
              <motion.h1
                className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-wide drop-shadow-[0_0_15px_rgba(0,255,255,0.7)]"
                variants={textVariants}
                initial="hidden"
                animate="visible"
                key={`title-${slide.id}`}
              >
                {slide.title}
              </motion.h1>
            )}

            {slide.subtitle && (
              <motion.p
                className="text-lg md:text-2xl text-cyan-100 mb-6 max-w-2xl mx-auto drop-shadow-md"
                variants={textVariants}
                initial="hidden"
                animate="visible"
                key={`subtitle-${slide.id}`}
              >
                {slide.subtitle}
              </motion.p>
            )}

            {slide.cta_text && slide.cta_url && (
              <motion.a
                href={slide.cta_url}
                className="inline-block px-8 py-4 text-lg font-bold text-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-xl shadow-lg hover:scale-105 transition-transform"
                variants={ctaVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                key={`cta-${slide.id}`}
              >
                {slide.cta_text}
              </motion.a>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
        {sliders.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-4 h-4 rounded-full transition-colors duration-300 ${
              index === current ? "bg-cyan-400 shadow-[0_0_10px_cyan] animate-pulse" : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
