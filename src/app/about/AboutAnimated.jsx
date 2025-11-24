"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import BreadcrumbBar from "@/components/BreadcrumbBar";

// ------------------
// Hero animation wrapper
// ------------------
function HeroAnimated({ children }) {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  return (
    <motion.div
      style={{ y: heroY }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
}

// ------------------
// Stats animation wrapper
// ------------------
function StatsAnimated({ stats }) {
  const { scrollYProgress } = useScroll();
  const statsY = useTransform(scrollYProgress, [0.2, 0.5], [50, 0]);

  return (
    <motion.div
      style={{ y: statsY }}
      className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { delay: i * 0.3 } },
          }}
          className="bg-brand-700/80 rounded-3xl p-10 shadow-lg hover:scale-105 transition-transform duration-500 backdrop-blur-md"
        >
          <p className="text-4xl font-extrabold text-brand-50">{stat.value}</p>
          <p className="text-brand-100 mt-2">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ------------------
// Feature card component
// ------------------
function FeatureCard({ icon, title, desc, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-brand-800/90 rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform duration-500 backdrop-blur-md flex flex-col items-center text-center"
    >
      <div className="text-brand-400 text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-brand-50 mb-2">{title}</h3>
      <p className="text-brand-100">{desc}</p>
    </motion.div>
  );
}

// ------------------
// FAQ Accordion Component
// ------------------
function FAQAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="mt-32 max-w-5xl mx-auto px-6">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-brand-50">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            layout
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="bg-brand-800/90 rounded-2xl shadow-lg p-6 cursor-pointer border border-white/10 hover:shadow-blue-500/30 transition-all"
          >
            <div
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex justify-between items-center"
            >
              <h3 className="text-xl font-semibold text-brand-50">{faq.question}</h3>
              <span className="text-2xl text-brand-400">
                {openIndex === i ? "−" : "+"}
              </span>
            </div>
            {openIndex === i && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-4 text-brand-100"
              >
                {faq.answer}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ------------------
// Main About Page
// ------------------
export default function AboutPage({ aboutData }) {
  // Fallback data
  aboutData = aboutData || {
    title: "About Northren-Patches United States Of America",
    description:
      "We deliver ultra-premium United States Of American solutions, driven by innovation, sustainability, and precision engineering.",
    image_url: "/usa-flag.jpg",
    features: [
      { icon: "🏆", title: "Excellence", desc: "Top-tier quality in every project." },
      { icon: "💡", title: "Innovation", desc: "Cutting-edge solutions for modern industries." },
      { icon: "🌱", title: "Sustainability", desc: "Eco-conscious practices in all operations." },
      { icon: "🤝", title: "Trust", desc: "Proudly United States Of American, globally connected." },
    ],
    stats: [
      { value: "10+", label: "Years Experience" },
      { value: "500+", label: "Projects Delivered" },
      { value: "100%", label: "Client Satisfaction" },
    ],
    partners: ["/partner1.png", "/partner2.png", "/partner3.png", "/partner4.png"],
    faqs: [
      {
        question: "What services does Northren-Patches provide?",
        answer:
          "We specialize in premium patch design, embroidery, insulation solutions, and industrial manufacturing across the United States and globally.",
      },
      {
        question: "Where is Northren-Patches located?",
        answer:
          "Our headquarters are in North Carolina, United States, with a global client base.",
      },
      {
        question: "How long has Northren-Patches been in business?",
        answer: "We have over 10 years of experience delivering ultra-premium solutions.",
      },
      {
        question: "How can I contact Northren-Patches?",
        answer:
          "You can reach us via our contact page, email at contact@northrenpatches.com, or phone at +61 123 456 789.",
      },
      {
        question: "Do you serve clients globally?",
        answer:
          "Yes! While based in the United States, we work with clients worldwide.",
      },
    ],
  };

  // Schema for SEO
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Northren-Patches United States Of America",
    url: "https://northren-patches.au",
    logo: "https://northren-patches.au/logo.png",
    sameAs: [
      "https://www.facebook.com/northrenpatches",
      "https://www.instagram.com/northrenpatches",
      "https://www.linkedin.com/company/northrenpatches",
    ],
    description:
      "Northren-Patches US provides premium patching, insulation, and industrial services across the United States and globally.",
    address: { "@type": "PostalAddress", addressCountry: "United States Of America" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "info@northren-patches.au",
      availableLanguage: ["English"],
    },
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-brand-900 via-brand-800 to-brand-700 text-brand-50 overflow-hidden">
      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />

      {/* Breadcrumb */}
      <BreadcrumbBar current="About" />

      {/* Background Glows */}
      <motion.div className="absolute w-80 h-80 rounded-full opacity-10 top-20 left-10 bg-gradient-to-tr from-brand-500 to-brand-600 blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />
      <motion.div className="absolute w-96 h-96 rounded-full opacity-15 -bottom-20 right-20 bg-gradient-to-tr from-brand-600 to-brand-500 blur-3xl animate-[pulse_12s_ease-in-out_infinite]" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 lg:py-32 relative z-10">
        <HeroAnimated>
          <div className="grid lg:grid-cols-2 gap-12 items-center bg-brand-800/90 rounded-3xl p-8 shadow-xl backdrop-blur-md">
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-brand-50">{aboutData.title}</h1>
              <p className="text-lg md:text-xl text-brand-100 mb-8 leading-relaxed">{aboutData.description}</p>
            </div>
            <div className="relative w-full h-80 lg:h-[480px] rounded-3xl overflow-hidden shadow-lg">
              <Image src={aboutData.image_url} alt={aboutData.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 1024px) 100vw, 50vw" priority />
            </div>
          </div>
        </HeroAnimated>

        {/* Stats */}
        <StatsAnimated stats={aboutData.stats} />

        {/* Features */}
        <section className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {aboutData.features.map((f, i) => (
            <FeatureCard key={i} icon={f.icon} title={f.title} desc={f.desc} delay={i * 0.2} />
          ))}
        </section>

        {/* Partners */}
        <section className="mt-32 text-center">
          <h2 className="text-4xl font-extrabold text-brand-50 mb-10">Our Partners</h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {aboutData.partners.map((p, i) => (
              <div key={i} className="w-32 h-16 relative">
                <Image src={p} alt={`Partner ${i + 1}`} fill style={{ objectFit: "contain" }} />
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="mt-32 bg-gradient-to-b from-brand-800 to-brand-700 py-24 relative overflow-hidden rounded-3xl p-10 shadow-lg">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-50 mb-6">Our Mission</h2>
            <p className="text-lg md:text-xl text-brand-100 leading-relaxed">
              We aim to deliver ultra-premium US quality combining modern design, sustainability, and excellence. Every project reflects care, innovation, and luxury aesthetics.
            </p>
          </motion.div>
        </section>

        {/* FAQ */}
        <FAQAccordion faqs={aboutData.faqs} />
      </section>
    </main>
  );
}
