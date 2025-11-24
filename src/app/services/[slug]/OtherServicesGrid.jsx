// frontend\src\app\services\[slug]\OtherServicesGrid.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function OtherServicesGrid({ services = [], currentSlug }) {
  const [showAll, setShowAll] = useState(false);
  const visibleServices = showAll ? services : services.slice(0, 6);

  return (
    <section className="relative py-20">
      {/* Background gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0018FF]/10 via-transparent to-[#0600AB]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white mb-12 tracking-tight"
        >
          Explore Other Services
        </motion.h2>

        {/* Services Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
          <AnimatePresence>
            {visibleServices
              .filter((s) => s.slug !== currentSlug)
              .map((service, index) => (
                <motion.div
                  key={service.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="relative rounded-3xl overflow-hidden bg-white/10 border border-white/10 backdrop-blur-md
                             hover:border-[#0033FF]/50 shadow-md hover:shadow-blue-600/30 transition-all duration-500 group"
                >
                  {/* Glow border effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#0033FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

                  <Link href={`/services/${service.slug}`} className="block">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-3xl">
                      {service.thumbnail ? (
                        <Image
                          src={service.thumbnail}
                          alt={`${service.title} - Premium Patch Service in USA`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          placeholder="empty"
                        />
                      ) : (
                        <Image
                          src="/placeholder-service.jpg"
                          alt="Placeholder service image"
                          fill
                          className="object-cover"
                          placeholder="empty"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition" />
                    </div>
                    <div className="p-4 md:p-5 text-left">
                      <h3 className="text-white font-semibold text-base md:text-lg mb-2 group-hover:text-[#00A6FF] transition">
                        {service.title}
                      </h3>
                      <p className="text-white/70 text-sm line-clamp-2">
                        {service.description || "Learn more about this premium patch service offered in the USA."}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        {/* Toggle Button */}
        {services.length > 6 && (
          <motion.button
            onClick={() => setShowAll(!showAll)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-12 px-8 py-3 rounded-full bg-gradient-to-r from-[#0033FF] via-[#0600AB] to-[#00033D]
                       text-white font-medium shadow-lg hover:shadow-blue-500/40 hover:scale-105
                       transition-all duration-500 relative overflow-hidden group"
          >
            <span className="relative z-10">{showAll ? "Show Less" : "Show All"}</span>
            {/* Shimmer animation */}
            <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
          </motion.button>
        )}
      </div>
    </section>
  );
}
