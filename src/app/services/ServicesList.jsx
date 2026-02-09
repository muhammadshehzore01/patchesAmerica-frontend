"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { getMediaUrl } from "@/lib/media";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  hover: { scale: 1.05, y: -6, boxShadow: "0 20px 60px rgba(0,140,255,0.25)" },
};

export default function ServicesList({ services = [] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!services?.length) return [];
    const q = search.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.slug?.toLowerCase().includes(q)
    );
  }, [services, search]);

  useEffect(() => {
    console.log("🧠 Services loaded:", services.length);
  }, [services]);

  if (!services?.length) {
    return (
      <section className="py-24 text-center text-gray-300 text-lg">
        No services found. Please check back later.
      </section>
    );
  }

  return (
    <section className="relative py-16 px-4 md:px-6 max-w-7xl mx-auto text-white">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-[#00033D]/10 to-transparent pointer-events-none" />

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 md:mb-12 gradient-heading">
        Our Custom Patch Services USA
      </h2>

      {/* Search + CTA */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 md:mb-12">
        <div className="w-full sm:max-w-md">
          <label className="relative block">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-xl">🔍</span>
            <input
              aria-label="Search custom patch services"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services (embroidered, PVC, chenille...)"
              className="pl-10 pr-4 py-3 w-full rounded-xl bg-black/30 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-md transition"
            />
          </label>
        </div>
        <div className="flex items-center gap-3 text-white mt-3 sm:mt-0">
          <span className="text-sm opacity-80">{filtered.length} results</span>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-400/40 hover:bg-cyan-400 text-white rounded-xl shadow-md hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Get a Quote <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Services Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        <AnimatePresence>
          {filtered.map((service, idx) => {
            const imgSrc = getMediaUrl(
              service.image_url || service.gallery?.[0]?.image_url || "/placeholder-service.jpg"
            );

            const serviceSchema = {
              "@context": "https://schema.org",
              "@type": "Service",
              name: service.title,
              description: service.description,
              url: `https://northernpatches.com/services/${service.slug}`,
              image: imgSrc,
              provider: {
                "@type": "Organization",
                name: "Northern Patches USA",
                url: "https://northernpatches.com",
              },
              areaServed: {
                "@type": "Country",
                name: "United States",
              },
              serviceType: "Custom Patches",
            };

            return (
              <motion.article
                key={service.id ?? idx}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, amount: 0.2 }}
                className="relative rounded-3xl overflow-hidden backdrop-blur-xl bg-black/30 border border-cyan-400/20 text-white group transition-all duration-500 shadow-md focus-within:ring-2 focus-within:ring-cyan-400 focus-within:ring-offset-2 focus-within:ring-offset-black"
              >
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
                />

                {/* Image */}
                <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={`${service.title} - Custom patches USA | No Minimum | Northern Patches`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain transition-transform duration-700 group-hover:scale-110"
                    priority={idx < 3}
                    placeholder="blur"
                    decoding="async"
                    quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex flex-col justify-between h-full">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 group-hover:text-cyan-400 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
                    {service.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-200/90 line-clamp-3 mb-5">
                    {service.meta_description || service.description || "Premium custom patch service – USA made."}
                  </p>
                  <div className="flex flex-wrap justify-between items-center gap-3 mt-auto">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-2 font-semibold text-cyan-400 hover:text-white transition focus-visible:underline"
                    >
                      More Details →
                    </Link>
                    <Link
                      href="/quote"
                      className="inline-block px-4 py-1.5 text-sm font-semibold rounded-full bg-cyan-400/40 border border-cyan-400/60 text-white hover:bg-cyan-400/70 transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
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