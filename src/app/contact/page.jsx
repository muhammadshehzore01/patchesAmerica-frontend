"use client";

import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiInstagram,
  FiLinkedin,
  FiTwitter,
  FiCheckCircle,
  FiChevronDown,
} from "react-icons/fi";
import Head from "next/head";
import LuxuryOverlay from "@/components/LuxuryOverlay";
import GlowFade from "@/components/GlowFade";

export default function ContactPremium() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await axios.post(`${API_BASE}/contact/`, formData);
      if (res.status === 201 || res.status === 200) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  // Confetti
  const Confetti = () => {
    const particles = Array.from({ length: 25 });
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{
              x: Math.random() * 300 - 150,
              y: Math.random() * -300,
              opacity: 0,
              scale: 0.8,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 1.2 + Math.random() * 0.8,
              ease: "easeOut",
            }}
            style={{ left: "50%", top: "50%" }}
          />
        ))}
      </div>
    );
  };

  const faqs = [
    {
      question: "How can I contact Northren Patches?",
      answer:
        "You can contact us via our contact form, email at contact@northrenpatches.com, or phone +61 123 456 789.",
    },
    {
      question: "What services do you provide?",
      answer:
        "We provide custom embroidery, patch design, and manufacturing services for individuals and businesses.",
    },
    {
      question: "How long does it take to get a response?",
      answer:
        "Our team typically responds within a few hours during business hours, Monday to Friday.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship our patches and embroidery products worldwide. Shipping times may vary by location.",
    },
  ];

  // Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Northren Patches",
        url: "https://northrenpatches.com",
        logo: "https://northrenpatches.com/logo.png",
        sameAs: [
          "https://www.facebook.com/NorthrenPatches",
          "https://www.instagram.com/NorthrenPatches",
          "https://twitter.com/NorthrenPatches",
          "https://www.linkedin.com/company/northrenpatches",
        ],
      },
      {
        "@type": "LocalBusiness",
        name: "Northren Patches",
        image: "https://northrenpatches.com/logo.png",
        "@id": "https://northrenpatches.com",
        url: "https://northrenpatches.com",
        telephone: "+61-123-456-789",
        address: {
          "@type": "PostalAddress",
          streetAddress: "123 Premium St",
          addressLocality: "North Carolina",
          addressRegion: "NC",
          postalCode: "12345",
          addressCountry: "US",
        },
        geo: { "@type": "GeoCoordinates", latitude: 35.7596, longitude: -79.0193 },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
          },
        ],
        priceRange: "$$",
        contactPoint: [
          { "@type": "ContactPoint", telephone: "+61-123-456-789", contactType: "Customer Service", email: "contact@northrenpatches.com" },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Contact Us | Northren Patches</title>
        <meta
          name="description"
          content="Contact Northren Patches for premium embroidery, patch design, and manufacturing services. Experience responsive support and high-end craftsmanship."
        />
        <link rel="canonical" href="https://northrenpatches.com/contact" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </Head>

      <main className="relative min-h-screen text-white overflow-hidden bg-gradient-to-b from-brand-950 via-brand-900 to-brand-800">
        <LuxuryOverlay
          layers={[
            { from: "from-white/5", via: "via-transparent", to: "to-transparent" },
            { from: "from-brand-600/10", via: "via-brand-700/5", to: "to-transparent" },
          ]}
        />
        <GlowFade layers={[{ from: "from-brand-500/25", via: "via-brand-600/15", to: "to-transparent", height: "h-72" }]} />

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto text-center py-24 px-6 relative z-10"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-brand-100 to-brand-400 bg-clip-text text-transparent">
            Contact Northren Patches
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-brand-100 leading-relaxed">
            Reach out for custom embroidery, patches, or design consultation. Our expert team will respond promptly to your inquiry.
          </p>
        </motion.section>

        {/* Contact Form + Info */}
        <section className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start px-6 pb-16 relative z-10">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-[0_0_40px_rgba(0,0,0,0.3)]"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {["name", "email", "subject"].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-sm text-brand-200 mb-2 font-medium">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    id={field}
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={`Enter your ${field}`}
                    required={field !== "subject"}
                    className="w-full p-4 rounded-2xl bg-brand-800/70 border border-brand-700 text-white placeholder-brand-300 focus:ring-2 focus:ring-brand-500 focus:outline-none transition"
                  />
                </div>
              ))}

              <div>
                <label htmlFor="message" className="block text-sm text-brand-200 mb-2 font-medium">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message"
                  required
                  rows={6}
                  className="w-full p-4 rounded-2xl bg-brand-800/70 border border-brand-700 text-white placeholder-brand-300 focus:ring-2 focus:ring-brand-500 focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-[#FF0000] via-[#FF5555] to-[#FF0000] shadow-[0_0_20px_rgba(255,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,85,85,0.6)] transition-all duration-300 hover:scale-105"
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
              {status === "error" && <p className="text-red-400 text-center pt-2">❌ Something went wrong. Try again.</p>}
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-[0_0_40px_rgba(0,0,0,0.3)] flex flex-col justify-between"
          >
            <div>
              <h2 className="text-3xl font-bold mb-6 text-brand-50">Contact Details</h2>
              <div className="space-y-5 text-brand-100">
                <div className="flex items-center gap-4"><FiMapPin className="text-2xl text-brand-400"/> <p>123 Premium St, North Carolina, USA</p></div>
                <div className="flex items-center gap-4"><FiPhone className="text-2xl text-brand-400"/> <p>+61 123 456 789</p></div>
                <div className="flex items-center gap-4"><FiMail className="text-2xl text-brand-400"/> <p>contact@northrenpatches.com</p></div>
              </div>
              <div className="flex gap-6 mt-8">{[FiInstagram,FiLinkedin,FiTwitter].map((Icon,i)=>(<Icon key={i} className="text-2xl text-brand-300 hover:text-brand-100 transition cursor-pointer"/>))}</div>
            </div>
            <p className="text-brand-200 mt-10 text-sm leading-relaxed">Whether it’s custom patch production or design consultation, our team is ready to collaborate with precision and care.</p>
          </motion.div>
        </section>

        {/* 🔹 FAQ Section - Futuristic */}
        <section className="max-w-5xl mx-auto px-6 pb-32 relative z-10">
          <h2 className="text-4xl font-bold text-white mb-10 text-center tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden cursor-pointer group hover:shadow-[0_0_40px_cyan]/50 transition-shadow duration-500"
                  onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                >
                  {/* Glow Header */}
                  <div className="flex justify-between items-center p-5 bg-gradient-to-r from-[#0033FF]/20 to-transparent group-hover:from-[#00F0FF]/40 group-hover:to-transparent transition-colors duration-500">
                    <h3 className="text-white font-medium text-lg md:text-xl">{faq.question}</h3>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      className="text-white"
                    >
                      <FiChevronDown />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-5 text-white/80 bg-gradient-to-t from-[#0033FF]/10 to-transparent"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Success Modal */}
        <AnimatePresence>
          {status === "success" && (
            <motion.div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-[999]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Confetti />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.4 }}
                className="bg-gradient-to-b from-brand-800 to-brand-900 border border-brand-600 rounded-3xl shadow-2xl text-center p-10 max-w-sm mx-4 relative overflow-hidden"
              >
                <motion.div initial={{ rotate: -15, scale: 0.5 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 300 }} className="flex justify-center mb-6">
                  <FiCheckCircle className="text-green-400 text-6xl drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]"/>
                </motion.div>
                <h3 className="text-2xl font-bold mb-3 text-brand-50">Message Sent!</h3>
                <p className="text-brand-200 mb-6">Thank you for contacting us. Our team will get back to you shortly.</p>
                <button onClick={() => setStatus(null)} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF0000] via-[#FF5555] to-[#FF0000] font-bold hover:scale-105 transition-all">Close</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
