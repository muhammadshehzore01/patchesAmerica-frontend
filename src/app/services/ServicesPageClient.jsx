"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useServices } from "@/hooks/useApiHooks";
import { useGlobalModal } from "@/components/GlobalModalProvider";
import PatchRequestWizard from "@/components/PatchRequestWizard";

const FuturisticGallery = dynamic(() => import("./ServicesGalleryGrid"), { ssr: false });

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
  hover: { y: -6, scale: 1.02 },
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
  const loadMore = () =>
    setVisibleCount((p) => Math.min(p + 6, filtered.length));

  const handleGetQuote = (service) => {
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

  if (isLoading)
    return (
      <section className="py-24 text-center text-muted text-lg">
        Loading services…
      </section>
    );

  if (isError)
    return (
      <section className="py-24 text-center text-red-500 text-lg">
        Failed to load services.
      </section>
    );

  if (!services.length)
    return (
      <section className="py-24 text-center text-muted text-lg">
        No services found.
      </section>
    );

  return (
    <section className="relative py-12 px-4 max-w-7xl mx-auto">
      {/* Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
        <input
          type="text"
          placeholder="Search services…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full sm:max-w-md
            px-4 py-3 rounded-xl
            bg-white/80 backdrop-blur
            border border-border
            text-foreground placeholder-muted
            focus:outline-none focus:ring-2 focus:ring-primary/40
          "
        />
        <span className="text-sm text-muted">
          {filtered.length} results
        </span>
      </div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence>
          {visibleServices.map((service, idx) => (
            <motion.article
              key={service.id ?? idx}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              className="card overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-48 sm:h-56 w-full">
                <img
                  src={
                    service.image_url ||
                    service.gallery?.[0]?.image_url ||
                    "/placeholder-service.jpg"
                  }
                  alt={service.title}
                  loading={idx < 2 ? "eager" : "lazy"}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col">
                <h3 className="text-xl font-bold mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-muted line-clamp-3 mb-4">
                  {service.meta_description || service.description}
                </p>

                <div className="flex justify-between items-center mt-auto">
                  <a
                    href={`/services/${service.slug}`}
                    className="text-primary font-semibold hover:underline"
                  >
                    Details →
                  </a>

                  <button
                    onClick={() => handleGetQuote(service)}
                    className="btn-primary !py-1.5 !px-4 text-sm"
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
            className="btn-primary"
          >
            Load More Services
          </button>
        </div>
      )}

      {/* Gallery */}
      <FuturisticGallery
        services={filtered.slice(0, visibleCount)}
        particleCount={8}
        lazy
      />
    </section>
  );
}
