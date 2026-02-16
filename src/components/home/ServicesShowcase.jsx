// src/components/home/ServicesShowcase.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Optional: tiny helper to strip HTML tags if your backend sometimes sends HTML
const stripHtml = (html) => {
  if (typeof window === "undefined") return html;
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

export default function ServicesShowcase({
  services = [],
  initialCount = 6,
  showAll = false,
}) {
  const [visible, setVisible] = useState(initialCount);
  const displayedServices = showAll ? services : services.slice(0, visible);
  const hasMore = visible < services.length && !showAll;

  const handleExploreClick = (serviceTitle) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "service_explore_click", {
        event_category: "Service CTA",
        event_label: serviceTitle,
        page_path: window.location.pathname,
      });
    }
  };

  return (
    <section
      className="py-32 bg-[var(--color-bg-secondary)]"
      aria-labelledby="services-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20 max-w-7xl mx-auto px-6"
      >
        <h2
          id="services-heading"
          className="mt-4 text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400"
        >
          Premium Custom Patch Services USA
        </h2>

        <p className="text-[var(--color-text-secondary)] text-xl max-w-3xl mx-auto">
          Discover our range of high quality{" "}
          <strong>custom embroidered patches USA</strong>,{" "}
          <strong>custom PVC patches no minimum</strong>,{" "}
          <strong>custom chenille patches for jackets</strong>,{" "}
          <strong>custom woven patches for hats</strong>,{" "}
          <strong>custom leather patches for bags</strong> crafted with expert
          precision and premium materials for durability and style.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {displayedServices.map((s, i) => (
          <motion.div
            key={s.slug}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
          >
            <Link
              href={`/services/${s.slug}`}
              aria-label={`View ${s.title} service – custom patches USA no minimum`}
              prefetch
              onClick={() => handleExploreClick(s.title)}
              className="glass overflow-hidden rounded-3xl shadow-lg group block cursor-pointer transition-transform duration-300 hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-secondary)]"
            >
              <div className="relative aspect-[14/10] w-full overflow-hidden">
                <Image
                  src={s.image_url}
                  alt={`${s.title} – custom ${s.title.toLowerCase()} USA example, no minimum order`}
                  fill
                  quality={72}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  placeholder="blur"
                  decoding="async"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
                  {s.title}
                </h3>

                {/* === FIXED: show clean text without HTML tags === */}
                <p className="text-[var(--color-text-secondary)] mb-6 line-clamp-4">
                  {stripHtml(s.description)}
                </p>

                <span className="inline-block text-[var(--color-accent)] font-semibold">
                  Explore Service →
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="min-h-[80px] flex items-center justify-center mt-16">
        {hasMore && (
          <button
            onClick={() => setVisible((v) => v + initialCount)}
            className="btn-primary px-10 py-4 text-lg focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            Load More Services
          </button>
        )}
      </div>
    </section>
  );
}