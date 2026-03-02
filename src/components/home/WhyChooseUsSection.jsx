"use client";
import { motion } from "framer-motion";
import { FiStar, FiClock, FiTruck, FiLayers, FiShield, FiAward } from "react-icons/fi";

export default function WhyChooseUsSection() {
  const items = [
    { icon: FiStar, title: "Premium Quality", desc: "Handcrafted with top-grade materials for lasting durability." },
    { icon: FiShield, title: "Durable Materials", desc: "Weather-resistant and fade-proof designs." },
    { icon: FiClock, title: "Fast Turnaround", desc: "Quick production and USA-wide shipping." },
    { icon: FiAward, title: "Expert Craftsmanship", desc: "Years of experience in custom designs." },
    { icon: FiTruck, title: "Worldwide Shipping", desc: "Reliable delivery to your doorstep." },
    { icon: FiLayers, title: "Fully Customizable", desc: "Tailor every detail to your vision." },
  ];

  return (
    <section className="py-32 bg-[var(--color-bg-secondary)]" aria-labelledby="why-choose-us-heading">
      <motion.h2
        id="why-choose-us-heading"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 text-center mb-20 max-w-7xl mx-auto px-6"
      >
        Why Choose Northern Patches
      </motion.h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-6">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.04, transition: { duration: 0.3 } }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="glass p-10 text-center rounded-3xl shadow-lg"
            >
              <Icon className="mx-auto text-5xl text-[var(--color-accent)] mb-6" />
              <h3 className="text-2xl font-semibold mb-4 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">{item.title}</h3>
              <p className="text-[var(--color-text-secondary)] text-base">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}