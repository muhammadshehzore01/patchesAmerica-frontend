// frontend\src\app\services\ServicesList.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { getMediaUrl } from "@/lib/media"; // ✅ helper

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: { scale: 1.04, y: -8, boxShadow: "0 25px 50px rgba(0,51,255,0.25)" },
};

export default function ServicesList({ services = [] }) {
  const [search, setSearch] = useState("");

  // -----------------------------
  // Filter services by search
  // -----------------------------
  const filtered = useMemo(() => {
    if (!services?.length) return [];
    if (!search.trim()) return services;
    const q = search.trim().toLowerCase();
    return services.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.slug?.toLowerCase().includes(q)
    );
  }, [services, search]);

  // -----------------------------
  // 🧠 Client-side logging of resolved images
  // -----------------------------
  useEffect(() => {
    console.log("🧠 Services received in component:", services);
  }, [services]);

  if (!services?.length) {
    return (
      <section className="py-24">
        <p className="text-center text-gray-300 text-lg">
          No services found. Please check back later.
        </p>
      </section>
    );
  }

  return (
    <section
      className="relative py-12 rounded-3xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #00033D 0%, #0600AB 60%, #0033FF 100%)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

      {/* Section Heading */}
      <h2 className="text-4xl font-extrabold text-center text-white mb-12">
        Our Services
      </h2>

      {/* Search + CTA */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 px-4">
        <div className="w-full sm:max-w-md">
          <label className="relative block">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">🔎</span>
            <input
              aria-label="Search services"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="pl-10 pr-4 py-3 w-full rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0033FF]"
            />
          </label>
        </div>

        <div className="flex items-center gap-3 text-white">
          <span className="text-sm opacity-80">{filtered.length} results</span>
          <Link
            href="/contact"
            title="Get a Quote from Northren Patches"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0033FF] hover:bg-[#0600AB] text-white rounded-xl shadow-md transition-all hover:scale-105"
          >
            Get a Quote
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-4"
      >
        <AnimatePresence>
          {filtered.map((service, idx) => {
            const imgSrc = getMediaUrl(
              service.image_url || service.gallery?.[0]?.image_url || "/placeholder-service.jpg"
            );

            // Structured data per service
            const serviceSchema = {
              "@context": "https://schema.org",
              "@type": "Service",
              name: service.title,
              description: service.description,
              url: `https://northren-patches.au/services/${service.slug}`,
              image: imgSrc,
              provider: {
                "@type": "Organization",
                name: "Northren Patches United States Of America",
                url: "https://northren-patches.au",
              },
              areaServed: { "@type": "Country", name: "United States Of America" },
            };

            return (
              <motion.article
                key={service.id ?? idx}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, amount: 0.2 }}
                className="relative rounded-3xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 text-white group transition-all duration-500"
              >
                {/* Structured Data */}
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
                />

                {/* Image */}
                <div className="relative h-56 md:h-64 w-full overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={service.title ?? "Service image"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority={idx === 0}
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00033D]/70 via-[#00033D]/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-[#00A2FF] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-200/90 line-clamp-3 mb-6">
                    {service.description || "Premium service by Northren Patches United States Of America."}
                  </p>

                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={`/services/${service.slug}`}
                      title={`View details for ${service.title}`}
                      className="inline-flex items-center gap-2 font-semibold text-[#00A2FF] hover:text-white transition"
                    >
                      More Details →
                    </Link>

                    <Link
                      href="/quote"
                      title={`Get a quote for ${service.title}`}
                      className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-[#00A2FF]/40 border border-[#00A2FF]/60 text-white hover:bg-[#00A2FF]/70 transition-all"
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
