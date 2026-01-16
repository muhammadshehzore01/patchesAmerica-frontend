"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ServicesShowcase({ services = [] }) {
  const [visible, setVisible] = useState(6);

  return (
    <section className="py-32 bg-[var(--color-bg-secondary)]" aria-labelledby="services-heading">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20 max-w-7xl mx-auto px-6"
      >
        <h2 id="services-heading" className="text-5xl md:text-6xl font-extrabold mb-4">
          Premium Patch Services
        </h2>
        <p className="text-[var(--color-text-secondary)] text-xl max-w-3xl mx-auto">
          Discover our range of high-quality custom patches, crafted with expert precision and premium materials for durability and style.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {services.slice(0, visible).map((s, i) => (
          <motion.div
            key={s.slug}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            className="glass overflow-hidden rounded-3xl shadow-lg group"
          >
            <div className="relative h-64 md:h-72">
              <Image
                src={s.image_url}
                alt={`${s.title} – custom embroidered or PVC patch example`}
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-semibold mb-4">{s.title}</h3>
              <p className="text-[var(--color-text-secondary)] mb-6 line-clamp-4">{s.description}</p>
              <Link
                href={`/services/${s.slug}`}
                className="inline-block text-[var(--color-accent)] font-semibold hover:text-[var(--color-accent-dark)] transition-colors"
              >
                Explore Service →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {visible < services.length && (
        <div className="text-center mt-16">
          <button
            onClick={() => setVisible((v) => v + 6)}
            className="btn-primary px-10 py-4 text-lg"
          >
            Load More Services
          </button>
        </div>
      )}
    </section>
  );
}