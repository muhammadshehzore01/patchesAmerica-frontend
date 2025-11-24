"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useServices } from "@/hooks/useApiHooks";
import { useGlobalModal } from "@/components/GlobalModalProvider";
import PatchRequestWizard from "@/components/PatchRequestWizard";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  hover: { scale: 1.05, y: -5, boxShadow: "0 20px 40px rgba(0,255,255,0.2)" },
};

export default function ServicesPageClient() {
  const { services, isLoading, isError } = useServices();
  const { openModal, closeModal } = useGlobalModal();

  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = useMemo(() => {
    if (!services.length) return [];
    if (!search.trim()) return services;
    const q = search.trim().toLowerCase();
    return services.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.slug?.toLowerCase().includes(q)
    );
  }, [services, search]);

  const visibleServices = filtered.slice(0, visibleCount);
  const loadMore = () => setVisibleCount((prev) => Math.min(prev + 6, filtered.length));

  const handleGetQuote = (service) => {
    openModal(
      <PatchRequestWizard
        initialService={{
          title: service.title,
          description: service.description,
          image: service.image_url || "/placeholder-service.jpg",
        }}
        onClose={closeModal}
      />
    );
  };

  if (isLoading)
    return <section className="py-24 text-center text-white text-lg">Loading services...</section>;

  if (isError)
    return <section className="py-24 text-center text-red-400 text-lg">Failed to load services.</section>;

  if (!services.length)
    return <section className="py-24 text-center text-gray-300 text-lg">No services found.</section>;

  return (
    <section className="relative py-12 rounded-3xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

      <h2 className="text-4xl font-extrabold text-center text-white mb-12">Our Services</h2>

      {/* Search */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 px-4">
        <div className="w-full sm:max-w-md">
          <label className="relative block">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">🔎</span>
            <input
              aria-label="Search services"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="pl-10 pr-4 py-3 w-full rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </label>
        </div>
        <div className="flex items-center gap-3 text-white">
          <span className="text-sm opacity-80">{filtered.length} results</span>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4"
      >
        <AnimatePresence>
          {visibleServices.map((service, idx) => {
            const imgSrc = service.image_url || "/placeholder-service.jpg";

            return (
              <motion.article
                key={service.id ?? idx}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, amount: 0.2 }}
                className="relative rounded-2xl overflow-hidden backdrop-blur-md bg-white/5 border border-white/10 text-white group transition-all duration-300 shadow-lg hover:shadow-[0_0_40px_rgba(0,255,255,0.25)]"
              >
                {/* Image */}
                <div className="relative h-56 md:h-64 w-full overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={service.title ?? "Service image"}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00033D]/70 via-[#0033FF]/30 to-transparent pointer-events-none" />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">{service.title}</h3>
                  <p className="text-sm text-gray-200/90 line-clamp-3 mb-6">{service.description}</p>

                  <div className="flex items-center justify-between gap-3 mt-auto">
                    <a
                      href={`/services/${service.slug}`}
                      title={`View details for ${service.title}`}
                      className="inline-flex items-center gap-2 font-semibold text-cyan-400 hover:text-white transition"
                    >
                      More Details →
                    </a>

                    <button
                      onClick={() => handleGetQuote(service)}
                      title={`Get a quote for ${service.title}`}
                      className="px-4 py-1.5 text-xs font-semibold rounded-full bg-cyan-400/40 border border-cyan-400/60 text-white hover:bg-cyan-400/70 transition-all"
                    >
                      Get Quote
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {visibleCount < filtered.length && (
        <div className="flex justify-center mt-12">
          <button
            onClick={loadMore}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-black font-bold shadow-lg hover:scale-105 transition-transform"
          >
            Load More Services
          </button>
        </div>
      )}
    </section>
  );
}
