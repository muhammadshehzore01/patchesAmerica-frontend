"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useServices } from "@/hooks/useApiHooks";
import { useGlobalModal } from "@/components/GlobalModalProvider";
import PatchRequestWizard from "@/components/PatchRequestWizard";

// Lazy-load gallery (no SSR)
const FuturisticGallery = dynamic(() => import("./ServicesGalleryGrid"), { ssr: false });

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
  hover: { y: -6, scale: 1.02, transition: { duration: 0.3 } },
};

export default function ServicesPageClient() {
  const { services = [], isLoading, isError } = useServices();
  const { openModal, closeModal } = useGlobalModal();
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.slug?.toLowerCase().includes(q)
    );
  }, [services, search]);

  const visibleServices = filtered.slice(0, visibleCount);

  const loadMore = () => setVisibleCount((prev) => Math.min(prev + 6, filtered.length));

  const handleGetQuote = (service, e) => {
    e.preventDefault();
    e.stopPropagation();
    openModal(
      <PatchRequestWizard
        initialService={{
          title: service.title,
          description: service.meta_description || service.description,
          image: service.image_url || "/placeholder-service.jpg",
        }}
        onClose={closeModal}
      />
    );
  };

  if (isLoading) {
    return (
      <section className="py-24 text-center text-muted text-lg animate-pulse">
        Loading premium USA patch services…
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-24 text-center text-red-500 text-lg">
        Failed to load services. Please try again later.
      </section>
    );
  }

  if (!services.length) {
    return (
      <section className="py-24 text-center text-muted text-lg">
        No services available at the moment.
      </section>
    );
  }

  return (
    <section className="relative py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Search bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
        <input
          type="text"
          placeholder="Search services (embroidered, PVC, chenille...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full sm:max-w-md
            px-5 py-3 rounded-xl
            bg-white/10 backdrop-blur-md
            border border-white/20 text-white placeholder-white/50
            focus:outline-none focus:ring-2 focus:ring-cyan-400/50
            shadow-md transition
          "
        />
        <span className="text-sm text-white/70">
          {filtered.length} {filtered.length === 1 ? "service" : "services"} found
        </span>
      </div>

      {/* Services grid – entire card is clickable */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        <AnimatePresence>
          {visibleServices.map((service, idx) => (
            <motion.article
              key={service.id ?? service.slug ?? idx}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              className="
                group relative overflow-hidden rounded-3xl
                bg-black/30 backdrop-blur-xl border border-cyan-400/20
                shadow-lg hover:shadow-[0_0_30px_rgba(0,255,255,0.2)]
                transition-all duration-500 cursor-pointer
              "
            >
              {/* Full-card clickable link */}
              <Link
                href={`/services/${service.slug}`}
                className="absolute inset-0 z-10"
                aria-label={`View details for ${service.title}`}
                prefetch
              />

              {/* Image */}
              <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden pointer-events-none">
                <Image
                  src={
                    service.image_url ||
                    service.gallery?.[0]?.image_url ||
                    "/placeholder-service.jpg"
                  }
                  alt={`${service.title} – Custom Patches USA | Northern Patches`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain transition-transform duration-700 group-hover:scale-110"
                  priority={idx < 3}
                  fetchPriority={idx < 3 ? "high" : "low"}
                  placeholder="blur"
                  decoding="async"
                  quality={75}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
              </div>

              {/* Content */}
              <div className="relative z-20 p-5 sm:p-6 flex flex-col h-full pointer-events-none">
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 group-hover:text-cyan-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-white/80 line-clamp-3 mb-6 flex-grow">
                  {service.meta_description || service.description}
                </p>
                <div className="flex flex-wrap justify-between items-center gap-3 mt-auto pointer-events-auto">
                  <span className="text-cyan-400 font-semibold group-hover:text-white transition-colors">
                    View Details →
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleGetQuote(service, e)}
                    className="
                      relative z-30 px-4 py-2 text-sm font-semibold
                      rounded-full bg-cyan-500/30 hover:bg-cyan-500/50
                      border border-cyan-400/40 text-white transition-all
                      focus-visible:ring-2 focus-visible:ring-cyan-400
                      focus-visible:ring-offset-2 focus-visible:ring-offset-black
                    "
                  >
                    Get Quote
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More */}
      {visibleCount < filtered.length && (
        <div className="flex justify-center mt-12">
          <button
            onClick={loadMore}
            className="btn-primary px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)]"
          >
            Load More Services
          </button>
        </div>
      )}

      {/* Gallery section */}
      <FuturisticGallery
        services={filtered.slice(0, visibleCount)}
        particleCount={8}
        lazy
      />
    </section>
  );
}