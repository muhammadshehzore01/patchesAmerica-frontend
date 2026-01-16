"use client";
import { motion } from "framer-motion";

export default function StepsSection({ steps = [] }) {
  if (!steps.length) return null;

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto" aria-labelledby="how-it-works-heading">
      <motion.h2
        id="how-it-works-heading"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-extrabold text-center mb-20"
      >
        How It Works
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            transition={{ duration: 0.7, delay: i * 0.15 }}
            className="glass p-8 text-center rounded-3xl shadow-lg"
          >
            <div className="text-5xl mb-6 text-[var(--color-accent)]">{s.icon}</div>
            <h3 className="text-2xl font-semibold mb-4">{s.title}</h3>
            <p className="text-[var(--color-text-secondary)] text-base">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}