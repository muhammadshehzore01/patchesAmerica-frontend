"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import Head from "next/head";
import React from "react";

// ------------------
// FAQ Accordion Component
// ------------------
function FAQAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = React.useState(null);

  return (
    <section className="mt-32 max-w-5xl mx-auto px-6">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-brand-100 to-brand-400 bg-clip-text text-transparent">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-brand-800/90 rounded-2xl shadow-lg p-6 cursor-pointer border border-white/10 hover:shadow-[0_0_30px_rgba(255,85,85,0.5)] transition-all duration-500"
            >
              <div
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex justify-between items-center"
              >
                <h3 className="text-xl font-semibold text-brand-50">{faq.question}</h3>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  className="text-2xl bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent"
                >
                  +
                </motion.span>
              </div>
              {isOpen && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 text-brand-100 leading-relaxed"
                >
                  {faq.answer}
                </motion.p>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ------------------
// Main About Page
// ------------------
export default function AboutPage() {
  const aboutData = {
    title: "About Northren-Patches United States Of America",
    description:
      "We deliver ultra-premium United States Of American solutions, driven by innovation, sustainability, and precision engineering. Trusted locally and globally — every project reflects our commitment to excellence and care.",
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
    partners: [
      "/partner1.png",
      "/partner2.png",
      "/partner3.png",
      "/partner4.png",
    ],
    faqs: [
      {
        question: "What services does Northren-Patches offer?",
        answer:
          "We specialize in premium patching, embroidery, insulation, and industrial engineering solutions across the USA and globally.",
      },
      {
        question: "Where is Northren-Patches located?",
        answer:
          "Our headquarters are in North Carolina, USA, but we work with clients worldwide.",
      },
      {
        question: "How can I request a custom patch design?",
        answer:
          "You can contact us through our Contact page, fill out the form, and our team will respond within a few hours.",
      },
      {
        question: "Does Northren-Patches offer international shipping?",
        answer:
          "Yes, we ship our premium products globally, with careful packaging and tracking.",
      },
    ],
  };

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
      "Northren-Patches United States Of America provides premium patching, insulation, and industrial engineering services across the USA and global markets.",
    address: { "@type": "PostalAddress", addressCountry: "United States Of America" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "info@northren-patches.au",
      availableLanguage: ["English"],
    },
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>About Us | Northren-Patches United States Of America</title>
        <meta
          name="description"
          content="Discover Northren-Patches USA — premium patching, embroidery, and industrial engineering solutions trusted worldwide."
        />
        <meta
          name="keywords"
          content="Northren-Patches, About Northren-Patches, USA Patching, Industrial Solutions, Premium Embroidery"
        />
        <link rel="canonical" href="https://northren-patches.au/about" />

        {/* Open Graph */}
        <meta property="og:title" content="About Northren-Patches USA" />
        <meta
          property="og:description"
          content="Discover Northren-Patches USA — premium patching, embroidery, and industrial engineering solutions trusted worldwide."
        />
        <meta property="og:url" content="https://northren-patches.au/about" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-banner.jpg" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Northren-Patches USA" />
        <meta
          name="twitter:description"
          content="Discover Northren-Patches USA — premium patching, embroidery, and industrial engineering solutions trusted worldwide."
        />
        <meta name="twitter:image" content="/og-banner.jpg" />
      </Head>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      {/* Breadcrumb */}
      <BreadcrumbBar current="About" />

      <main className="relative min-h-screen bg-gradient-to-b from-brand-900 via-brand-800 to-brand-700 text-brand-50 overflow-hidden">
        {/* Background Glow */}
        <motion.div className="absolute w-96 h-96 rounded-full bg-brand-600/30 blur-3xl top-32 left-10 animate-[pulse_10s_ease-in-out_infinite]" />
        <motion.div className="absolute w-[30rem] h-[30rem] rounded-full bg-brand-500/25 blur-3xl -bottom-32 right-10 animate-[pulse_12s_ease-in-out_infinite]" />

        {/* Hero Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-12 items-center bg-brand-800/90 rounded-3xl p-8 shadow-xl backdrop-blur-md">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-brand-50">
              {aboutData.title}
            </h1>
            <p className="text-lg md:text-xl text-brand-100 mb-8 leading-relaxed">
              {aboutData.description}
            </p>
          </div>
          <div className="relative w-full h-80 lg:h-[480px] rounded-3xl overflow-hidden shadow-lg">
            <Image
              src={aboutData.image_url}
              alt={aboutData.title}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </section>

        {/* Stats Section */}
        <section className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center max-w-5xl mx-auto px-6">
          {aboutData.stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-brand-800/80 rounded-2xl p-8 shadow-md hover:scale-105 transition-transform duration-500 backdrop-blur-md"
            >
              <p className="text-4xl font-extrabold text-brand-50">{stat.value}</p>
              <p className="text-brand-200 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </section>

        {/* Features Section */}
        <section className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
          {aboutData.features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-brand-700/80 rounded-2xl p-8 shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-500 backdrop-blur-md"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold text-brand-50 mb-2">{f.title}</h3>
              <p className="text-brand-200">{f.desc}</p>
            </motion.div>
          ))}
        </section>


        {/* Mission Section */}
        <section className="mt-32 bg-gradient-to-b from-brand-800 to-brand-700 py-24 relative overflow-hidden rounded-3xl p-10 shadow-lg max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-50 mb-6">
              Our Mission
            </h2>
            <p className="text-lg md:text-xl text-brand-100 leading-relaxed">
              We aim to bring ultra-premium United States Of American quality to every client,
              combining modern design, sustainability, and excellence in execution.
              Every project is delivered with care, innovation, and luxury aesthetics.
            </p>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <FAQAccordion faqs={aboutData.faqs} />
      </main>
    </>
  );
}
