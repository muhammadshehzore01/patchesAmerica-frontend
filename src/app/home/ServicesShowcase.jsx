"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getServiceImage } from "@/lib/media";

export default function ServicesShowcase({ services = [] }) {
  const [visibleCount, setVisibleCount] = useState(4);

  return (
    <section className="relative py-28 bg-transparent text-white overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-0 w-[40rem] h-[40rem] bg-blue-700/20 blur-[140px]" />
        <div className="absolute -bottom-40 right-0 w-[35rem] h-[35rem] bg-[#0A0E2E]/70 blur-[160px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.03] to-transparent" />
      </div>

      {/* Heading */}
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative z-10 text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-blue-400 via-[#6EA8FF] to-white bg-clip-text text-transparent">
            Premium Patch Services
          </span>
        </h2>
        <p className="text-blue-100/70 mt-4 text-lg max-w-2xl mx-auto">
          Professionally manufactured — engineered for clarity, durability and American-grade performance.
        </p>
        <div className="mx-auto mt-6 w-24 h-[3px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent rounded-full shadow-[0_0_20px_3px_rgba(30,144,255,0.4)]" />
      </motion.div>

      {/* Services Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid gap-16">
        {services.slice(0, visibleCount).map((service, idx) => {
          const image = getServiceImage(service);
          const reversed = idx % 2 === 1;

          return (
            <motion.div
              key={service.id || idx}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              whileHover={{ scale: 1.015 }}
              className={`relative flex flex-col lg:flex-row ${reversed ? "lg:flex-row-reverse" : ""} overflow-hidden rounded-[2rem] backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] shadow-[0_0_60px_rgba(0,102,255,0.08)] hover:shadow-[0_0_90px_rgba(0,140,255,0.25)] transition-all duration-700`}
            >
              <div className="relative w-full lg:w-1/2 h-56 md:h-72 overflow-hidden">
                <Image src={image} alt={service.title} fill className="object-cover" unoptimized priority={idx === 0} />
                <motion.div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/10 to-transparent" initial={{ opacity: 0.7 }} whileHover={{ opacity: 0.5 }} />
                <motion.div className="absolute inset-0 z-10" style={{ background: "radial-gradient(circle at 30% 40%, rgba(0,102,255,0.3), transparent 60%)" }} initial={{ opacity: 0 }} whileHover={{ opacity: 0.3 }} transition={{ duration: 0.5 }} />
              </div>

              <div className="relative z-10 flex flex-col justify-center w-full lg:w-1/2 p-8 md:p-12">
                <motion.h3 initial={{ opacity: 0, x: reversed ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-2xl md:text-3xl font-bold">
                  {service.title}
                </motion.h3>
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-blue-100/70 mt-4 leading-relaxed">
                  {service.description?.slice(0, 180)}...
                </motion.p>
                <motion.a href={`/services/${service.slug}`} whileHover={{ scale: 1.05, x: 8 }} className="mt-8 inline-flex items-center gap-2 px-6 py-3 w-fit font-semibold text-white rounded-full bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 shadow-[0_0_25px_rgba(0,102,255,0.5)] hover:shadow-[0_0_40px_rgba(30,144,255,0.9)] transition-all">
                  Explore Service <span className="text-xl">→</span>
                </motion.a>
              </div>

              <motion.div className="absolute inset-0 pointer-events-none rounded-[2rem]" initial={{ opacity: 0 }} whileHover={{ opacity: 0.4 }} transition={{ duration: 0.4 }} style={{ boxShadow: "inset 0 0 35px rgba(0,122,255,0.35)" }} />
            </motion.div>
          );
        })}
      </div>

      {visibleCount < services.length && (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-20">
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} onClick={() => setVisibleCount(visibleCount + 4)} className="px-10 py-4 rounded-full font-semibold text-lg bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 shadow-[0_0_20px_rgba(0,120,255,0.4)] hover:shadow-[0_0_45px_rgba(0,140,255,0.7)] transition-all">
            Load More Services
          </motion.button>
        </motion.div>
      )}
    </section>
  );
}
