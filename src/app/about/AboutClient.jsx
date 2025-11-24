"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * AboutClient – Enhanced, animated, and SEO-friendly About section
 * - Lazy-loaded images (Next/Image)
 * - Responsive for all breakpoints
 * - Uses brand gradient and glow effects
 * - Semantic HTML for SEO (sections, headings, alt tags)
 */
export default function AboutClient({ aboutData }) {
  if (!aboutData) return null;

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-brand-900 via-brand-800 to-brand-700 text-brand-50 overflow-hidden">
      {/* 🔹 Background Glow Effects */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-brand-600/30 blur-3xl top-32 left-10 animate-[pulse_10s_ease-in-out_infinite]"
      />
      <motion.div
        className="absolute w-[30rem] h-[30rem] rounded-full bg-brand-500/25 blur-3xl -bottom-32 right-10 animate-[pulse_12s_ease-in-out_infinite]"
      />

      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-32">
        {/* 🌟 Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center bg-white/5 rounded-3xl p-8 md:p-12 shadow-lg backdrop-blur-lg border border-white/10"
        >
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-white">
              {aboutData.title}
            </h1>
            <p className="text-lg md:text-xl text-brand-100 leading-relaxed mb-6">
              {aboutData.description}
            </p>
          </div>

          {/* 🖼 Image */}
          <div className="relative w-full h-80 lg:h-[460px] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={aboutData.image_url}
              alt={aboutData.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* 📊 Stats Section */}
        <section
          aria-label="Company Statistics"
          className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center"
        >
          {aboutData.stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-brand-800/80 rounded-2xl p-8 shadow-md hover:scale-105 transition-transform duration-500 backdrop-blur-md"
            >
              <p className="text-4xl font-extrabold text-brand-50">{stat.value}</p>
              <p className="text-brand-200 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </section>

        {/* 🌟 Features Section */}
        <section
          aria-label="Company Strengths"
          className="mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {aboutData.features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-brand-700/80 rounded-2xl p-8 shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-500 backdrop-blur-md"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-brand-50 mb-2">{feature.title}</h3>
              <p className="text-brand-200">{feature.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* 🤝 Partners Section */}
        <section
          aria-label="Partners"
          className="mt-32 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-50 mb-10">
            Our Partners
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {aboutData.partners?.length > 0 ? (
              aboutData.partners.map((p, i) => (
                <div key={i} className="relative w-28 h-12 sm:w-32 sm:h-16">
                  <Image
                    src={p}
                    alt={`Partner logo ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 120px, 200px"
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
              ))
            ) : (
              <p className="text-brand-200">No partners available.</p>
            )}
          </div>
        </section>

        {/* 🎯 Mission Section */}
        <section
          aria-label="Company Mission"
          className="mt-32 bg-gradient-to-b from-brand-800 to-brand-700 rounded-3xl shadow-lg overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center px-6 py-20"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-50 mb-6">
              Our Mission
            </h2>
            <p className="text-lg md:text-xl text-brand-100 leading-relaxed">
              We aim to bring ultra-premium United States Of American quality to every client —
              combining design, sustainability, and precision. Every project we
              deliver reflects trust, excellence, and innovation.
            </p>
          </motion.div>
        </section>
      </section>
    </main>
  );
}
