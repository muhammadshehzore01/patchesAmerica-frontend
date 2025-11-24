"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiStar, FiShield } from "react-icons/fi";
import axios from "axios";

const reasons = [
  {
    icon: <FiStar />,
    title: "Premium Quality",
    description: "Top-grade materials with expert embroidery and precision craftsmanship.",
  },
  {
    icon: <FiShield />,
    title: "Durable & Reliable",
    description: "Built to last with strong materials and flawless stitching.",
  },
  {
    icon: <FiCheckCircle />,
    title: "Fast Turnaround",
    description: "Quick production without compromising the quality of your order.",
  },
];

export default function WhyChooseUs() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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

  // Confetti particles
  const Confetti = () =>
    Array.from({ length: 35 }).map((_, i) => (
      <motion.span
        key={i}
        className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
        animate={{
          x: Math.random() * 300 - 150,
          y: Math.random() * -300,
          opacity: 0,
          scale: 0.6 + Math.random() * 0.4,
          rotate: Math.random() * 360,
        }}
        transition={{ duration: 1 + Math.random() * 0.8, ease: "easeOut" }}
        style={{ left: "50%", top: "50%" }}
      />
    ));

  return (
    <section className="relative z-10 py-20 px-6 md:px-12 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 text-white overflow-hidden">
      {/* ✨ Background Neon Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-[1px] h-[1px] bg-cyan-400 rounded-full opacity-30"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * 800 }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * 800,
              opacity: [0.1, 0.6, 0.1],
            }}
            transition={{ repeat: Infinity, duration: 10 + Math.random() * 10, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* 🌌 Section Title */}
      <motion.h2
        className="text-5xl md:text-6xl font-extrabold text-center mb-16 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 text-transparent bg-clip-text tracking-wide"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Why Choose Us
      </motion.h2>

      {/* 🔹 Reasons Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
        {reasons.map((r, idx) => (
          <motion.div
            key={idx}
            className="relative bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-900/30 backdrop-blur-xl rounded-3xl p-10 flex flex-col items-center text-center shadow-[0_0_40px_rgba(0,255,255,0.2)] hover:shadow-[0_0_80px_rgba(0,255,255,0.5)] transition-all duration-500"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-6xl mb-5 text-cyan-400 animate-pulse">{r.icon}</div>
            <h3 className="font-bold text-2xl mb-3">{r.title}</h3>
            <p className="text-blue-200 text-center">{r.description}</p>

            <div className="absolute -top-5 -left-5 w-16 h-16 bg-gradient-to-tr from-cyan-400/20 to-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-5 -right-5 w-16 h-16 bg-gradient-to-tr from-indigo-500/20 via-cyan-400/10 to-blue-400/5 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* 🔹 Futuristic Contact Form */}
      <motion.div
        className="relative max-w-3xl mx-auto bg-blue-900/50 backdrop-blur-xl border border-cyan-400 rounded-3xl p-10 shadow-[0_0_50px_rgba(0,255,255,0.3)] overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Glow overlays */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-tr from-cyan-400/30 to-blue-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-tr from-indigo-500/20 via-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {["name", "email", "subject"].map((field) => (
            <div key={field}>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                required
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-800/50 via-blue-700/30 to-blue-800/50 border border-cyan-400 placeholder-cyan-300 text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none backdrop-blur-md shadow-inner-glow transition-all"
              />
            </div>
          ))}
          <div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message"
              required
              rows={5}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-800/50 via-blue-700/30 to-blue-800/50 border border-cyan-400 placeholder-cyan-300 text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none backdrop-blur-md shadow-inner-glow transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 shadow-[0_0_50px_rgba(0,255,255,0.5)] hover:shadow-[0_0_80px_rgba(0,255,255,0.7)] transition-all duration-300 hover:scale-105"
          >
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>

          {status === "error" && (
            <p className="text-red-400 text-center pt-2">❌ Something went wrong</p>
          )}
        </form>
      </motion.div>

      {/* ✅ Success Modal */}
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-[999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Confetti />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-blue-900/90 border border-cyan-400 rounded-3xl shadow-2xl text-center p-10 max-w-sm mx-4 relative overflow-hidden"
            >
              <motion.div className="flex justify-center mb-6">
                <FiCheckCircle className="text-cyan-400 text-6xl drop-shadow-[0_0_20px_rgba(0,255,255,0.9)]" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-3 text-cyan-400">Message Sent!</h3>
              <p className="text-blue-200 mb-6">Thank you for contacting us. We will get back to you shortly.</p>
              <button
                onClick={() => setStatus(null)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 font-bold hover:scale-105 transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
