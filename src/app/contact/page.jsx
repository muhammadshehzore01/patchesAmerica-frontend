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
import BreadcrumbBar from "@/components/BreadcrumbBar";

/* ---------------- FAQ Accordion ---------------- */
function FAQAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="mt-28 mb-32 max-w-5xl mx-auto px-4 sm:px-6">
      <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-brand-200 to-brand-400 bg-clip-text font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div
              key={i}
              layout
              className="rounded-2xl bg-brand-800/60 border border-white/10 p-6 cursor-pointer hover:border-brand-500/40 transition"
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-semibold text-brand-50">
                  {faq.question}
                </h3>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  className="text-brand-400 text-xl"
                >
                  <FiChevronDown />
                </motion.span>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 text-brand-200 leading-relaxed"
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

/* ---------------- Main Page ---------------- */
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await axios.post(`${API_BASE}/contact/`, formData);
      if (res.status === 200 || res.status === 201) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const faqs = [
    {
      question: "How can I contact Northern Patches?",
      answer: "You can contact us via this form, email, or phone. Our team responds quickly.",
    },
    {
      question: "Do you offer custom patch design?",
      answer: "Yes, we design and manufacture premium custom patches.",
    },
    {
      question: "Do you ship worldwide?",
      answer: "Yes, we ship internationally with tracking.",
    },
  ];

  return (
    <>
      <Head>
        <title>Contact Us | Northern Patches</title>
        <meta
          name="description"
          content="Contact Northern Patches for custom embroidered patches, woven patches, and premium patch manufacturing services."
        />
        <link rel="canonical" href="https://northrenpatches.com/contact" />

        {/* ✅ SEO Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Northern Patches",
              url: "https://northrenpatches.com",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "000-0000-000",
                contactType: "customer service",
              },
            }),
          }}
        />
      </Head>

      <BreadcrumbBar current="Contact" />

      <main className="relative min-h-screen bg-gradient-to-b from-brand-900 via-brand-800 to-brand-700 text-brand-50">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-24 text-center">
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
            Contact Northern Patches
          </h1>
          <p className="mt-6 text-brand-200 text-base md:text-lg">
            Have a question or custom patch requirement? Our team is ready to help.
          </p>
        </section>

        {/* Form + Info */}
        <section className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 px-4 sm:px-6 pb-32">
          {/* Form */}
          <div className="bg-brand-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {["name", "email", "subject"].map((field) => (
                <div key={field}>
                  <label className="text-sm text-brand-200 mb-1 block capitalize">
                    {field}
                  </label>
                  <input
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={`Enter your ${field}`}
                    className="w-full rounded-xl bg-brand-900/60 border border-brand-700 px-4 py-3 text-brand-50 placeholder-brand-400 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              ))}

              <div>
                <label className="text-sm text-brand-200 mb-1 block">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  className="w-full rounded-xl bg-brand-900/60 border border-brand-700 px-4 py-3 text-brand-50 placeholder-brand-400 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-brand-500 to-brand-600 hover:opacity-90 transition"
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="bg-brand-800/50 border border-white/10 rounded-3xl p-6 md:p-10">
            <h2 className="text-2xl font-bold mb-6">Contact Details</h2>
            <div className="space-y-4 text-brand-200">
              <p className="flex gap-3 items-center"><FiMapPin /> USA</p>
              <p className="flex gap-3 items-center"><FiPhone /> +61 123 456 789</p>
              <p className="flex gap-3 items-center"><FiMail /> contact@northrenpatches.com</p>
            </div>
          </div>
        </section>

        <FAQAccordion faqs={faqs} />

        {/* Success Modal */}
        <AnimatePresence>
          {status === "success" && (
            <motion.div className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-[999]">
              <motion.div className="bg-brand-900 border border-brand-600 rounded-3xl p-8 text-center max-w-sm w-full mx-4">
                <FiCheckCircle className="text-brand-400 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Message Sent</h3>
                <p className="text-brand-200 mb-6">We will contact you shortly.</p>
                <button
                  onClick={() => setStatus(null)}
                  className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 transition"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
