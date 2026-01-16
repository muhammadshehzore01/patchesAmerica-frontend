"use client";

import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import Head from "next/head";

// ------------------
// Hero animation wrapper (unchanged)
// ------------------
function HeroAnimated({ children }) {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  return <motion.div style={{ y: heroY }}>{children}</motion.div>;
}

// ------------------
// Stats animation wrapper (unchanged)
// ------------------
function StatsAnimated({ stats }) {
  const { scrollYProgress } = useScroll();
  const statsY = useTransform(scrollYProgress, [0.2, 0.5], [50, 0]);

  return (
    <motion.div
      style={{ y: statsY }}
      className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.3 }}
          className="bg-brand-800/80 rounded-3xl p-10 shadow-lg hover:scale-105 transition-transform duration-500 backdrop-blur-md"
        >
          <p className="text-4xl font-extrabold text-brand-50">{stat.value}</p>
          <p className="text-brand-100 mt-2">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ------------------
// Feature card component (unchanged)
// ------------------
function FeatureCard({ icon, title, desc, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.5 }}
      className="bg-brand-800/90 rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform duration-500 backdrop-blur-md flex flex-col items-center text-center"
    >
      <div className="text-brand-400 text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-brand-50 mb-2">{title}</h3>
      <p className="text-brand-100">{desc}</p>
    </motion.div>
  );
}

// ------------------
// FAQ Accordion Component (unchanged)
// ------------------
function FAQAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="mt-32 max-w-5xl mx-auto px-6">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-brand-50">
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
              className="bg-brand-800/90 rounded-2xl shadow-lg p-6 cursor-pointer border border-white/10 hover:shadow-blue-500/30 transition-all"
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-brand-50">{faq.question}</h3>
                <span className="text-2xl text-brand-400">{isOpen ? "−" : "+"}</span>
              </div>
              <AnimatePresence>
                {isOpen && (
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
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ------------------
// Main About Page — UPDATED FOR USA PATCHES BUSINESS
// ------------------
export default function AboutPage({ aboutData }) {
  // Updated fallback data tailored to Northern Patches (USA custom patches)
  aboutData = aboutData || {
    title: "About Northern Patches",
    description:
      "Premium custom patches handcrafted for USA — embroidered, PVC, chenille, woven, leather, and more. Fast production, no minimums on many orders, and nationwide shipping for teams, brands, clubs, and individuals.",
    image_url: "/usa-flag.jpg", // ← Replace with your actual hero image (e.g., American flag with patches, workshop, or product showcase)
    features: [
      { icon: "🧵", title: "Premium Craftsmanship", desc: "Expert embroidery and detailing using top-tier materials for lasting durability." },
      { icon: "🎨", title: "Fully Customizable", desc: "Bring any design to life — logos, text, artwork, shapes, and backing options." },
      { icon: "🚀", title: "Fast USA Turnaround", desc: "Quick production times with fast shipping across the United States." },
      { icon: "🇺🇸", title: "Made in the USA", desc: "Proudly crafted in America with quality you can trust." },
    ],
    stats: [
      { value: "10,000+", label: "Patches Delivered" },
      { value: "500+", label: "Happy Clients" },
      { value: "4.9/5", label: "Customer Rating" },
    ],
    partners: ["/partner1.png", "/partner2.png", "/partner3.png", "/partner4.png"], // ← Update or remove if no real partners
    faqs: [
      { question: "What types of custom patches do you offer?", answer: "We specialize in embroidered, PVC, chenille, woven, leather, and sublimation patches — all fully customizable with iron-on, sew-on, Velcro, or adhesive backing." },
      { question: "Where are Northern Patches located?", answer: "We are proudly based in the United States, crafting and shipping from America to customers nationwide and worldwide." },
      { question: "Do you have minimum order quantities?", answer: "Many of our patch types have no minimums — perfect for small runs, samples, or personal projects. Contact us for details." },
      { question: "How fast is production and shipping?", answer: "Most orders ship in 1–3 weeks (often faster), with express options available. We offer fast USA-wide shipping." },
      { question: "How can I get a quote or place an order?", answer: "Submit your design and details via our quote form, email us at info@northernpatches.com, or use the live chat. We're here to help!" },
    ],
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Northern Patches",
    url: "https://northernpatches.com/",
    logo: "https://northernpatches.com/logo.png", // ← Update to your real logo URL
    sameAs: [
      "https://www.facebook.com/northernpatches", // ← Update social links
      "https://www.instagram.com/northernpatches",
      "https://www.linkedin.com/company/northernpatches",
    ],
    description: "Northern Patches provides premium USA-made custom embroidered, PVC, chenille, woven, and leather patches with fast shipping for brands, teams, and individuals nationwide.",
    address: { "@type": "PostalAddress", addressCountry: "United States" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "info@northernpatches.com", // ← Use your actual email
      telephone: "+1-XXX-XXX-XXXX",     // ← Add your real US phone number
      availableLanguage: ["English"],
    },
  };

  return (
    <>
      <Head>
        <title>About Us | Northern Patches – USA Custom Patches</title>
        <meta name="description" content="Discover Northern Patches — premium USA-made custom patches, embroidery, PVC, chenille & more. Fast shipping, no minimums, trusted quality." />
        <link rel="canonical" href="https://northernpatches.com/about" />
      </Head>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />

      <BreadcrumbBar current="About" />

      <main className="relative min-h-screen bg-gradient-to-b from-brand-900 via-brand-800 to-brand-700 text-brand-50 overflow-hidden">
        {/* Background Glows (unchanged) */}
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
                <Image src={aboutData.image_url} alt={aboutData.title} fill style={{ objectFit: "cover" }} priority />
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

          {/* Partners (optional — remove section if not needed) */}
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
                To deliver premium, USA-crafted custom patches that bring your vision to life with unmatched quality, fast production, and outstanding customer service — every stitch made with pride in America.
              </p>
            </motion.div>
          </section>

          {/* FAQ */}
          <FAQAccordion faqs={aboutData.faqs} />
        </section>
      </main>
    </>
  );
}