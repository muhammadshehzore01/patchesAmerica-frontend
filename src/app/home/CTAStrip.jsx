"use client";

import { motion } from "framer-motion";

export default function CTAStrip() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-7xl mx-auto py-20 px-6 md:px-12 text-center relative bg-gradient-to-r from-[#FF4D6D]/20 via-[#FF914D]/15 to-[#FFD54D]/10 rounded-3xl overflow-hidden shadow-lg"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D6D]/10 via-[#FF914D]/5 to-[#FFD54D]/5 blur-3xl -z-10" />

      <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] via-[#FF914D] to-[#FFD54D] mb-6">
        Get Your Custom Patch Today
      </h2>
      <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
        Experience ultra-premium craftsmanship with precise embroidery and vibrant designs — perfect for your brand or personal collection.
      </p>

      <motion.a
        href="/quote"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="inline-block px-10 py-4 rounded-full font-bold bg-gradient-to-r from-[#FF4D6D] via-[#FF914D] to-[#FFD54D] shadow-[0_0_25px_rgba(255,77,109,0.4)] hover:shadow-[0_0_50px_rgba(255,145,77,0.6)] transition-all text-white"
      >
        Request a Quote
      </motion.a>

      <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#FF4D6D]/30 to-[#FFD54D]/0 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-gradient-to-tl from-[#FF914D]/20 to-[#FF4D6D]/0 rounded-full blur-3xl -z-10 animate-pulse" />
    </motion.section>
  );
}
