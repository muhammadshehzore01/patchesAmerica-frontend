"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiInstagram,
  FiLinkedin,
  FiTwitter,
} from "react-icons/fi";
import { useServices } from '@/hooks/useApiHooks';

export default function Footer() {
  const { services, isLoading, isError } = useServices(); // ✅ SWR hook

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white pt-28 pb-10">
      {/* 🔹 Background Glow & Particles */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-brand-500/20 blur-[180px] animate-lightSweep" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-300/15 blur-[160px] animate-lightSweep" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03),transparent)] animate-pulse-slow"></div>
        </div>
      </div>

      {/* 🌊 Light Wave Divider */}
      <div className="absolute -top-[1px] left-0 w-full overflow-hidden leading-[0] opacity-40">
        <svg
          className="relative block w-full h-[60px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <path
            fill="white"
            fillOpacity="0.05"
            d="M0,64L48,53.3C96,43,192,21,288,21.3C384,21,480,43,576,48C672,53,768,43,864,32C960,21,1056,11,1152,21.3C1248,32,1344,64,1392,80L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* 💎 Footer Content */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl p-6 space-y-4 shadow-[0_0_20px_rgba(134,168,255,0.1)] hover:shadow-[0_0_40px_rgba(134,168,255,0.3)] transition-shadow duration-500 perspective-3d tilt-card"
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 relative rounded-full overflow-hidden ring-2 ring-white/20 shadow-lg tilt-card hover:scale-[1.05] transition-transform duration-400">
              <Image
                src="/usa-flag.jpg"
                alt="United States Of America Flag Logo"
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white gradient-heading">
                Northern-Patches United States Of America
              </h4>
              <p className="text-xs text-white/60">
                Proudly crafted in United States Of America
              </p>
            </div>
          </div>
          <p className="text-sm text-white/70 leading-relaxed max-w-sm">
            Delivering world-class patch, badge & apparel branding solutions —
            trusted across United States Of America for excellence and creativity.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-[0_0_20px_rgba(134,168,255,0.1)] hover:shadow-[0_0_40px_rgba(134,168,255,0.3)] transition-shadow duration-500"
        >
          <h5 className="font-semibold text-lg mb-3 gradient-heading">
            Quick Links
          </h5>
          <ul className="space-y-2 text-sm">
            {["Home", "About", "Blog", "Contact"].map((item) => (
              <li key={item}>
                <Link
                  href={`/${item.toLowerCase()}`}
                  className="text-white hover:text-brand-200 font-medium hover:pl-1 hover:drop-shadow-[0_0_8px_rgb(134,168,255)] transition-all duration-300"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Dynamic Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-[0_0_20px_rgba(134,168,255,0.1)] hover:shadow-[0_0_40px_rgba(134,168,255,0.3)] transition-shadow duration-500"
        >
          <h5 className="font-semibold text-lg mb-3 gradient-heading">
            Our Services
          </h5>
          <ul className="space-y-2 text-sm">
            {isLoading && <li className="text-white/50 italic">Loading services...</li>}
            {isError && <li className="text-red-500 italic">Failed to load services</li>}
            {!isLoading && !isError && services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-white font-medium hover:text-brand-200 hover:pl-1 hover:drop-shadow-[0_0_8px_rgb(134,168,255)] transition-all duration-300"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-[0_0_20px_rgba(134,168,255,0.1)] hover:shadow-[0_0_40px_rgba(134,168,255,0.3)] transition-shadow duration-500"
        >
          <h5 className="font-semibold text-lg mb-3 gradient-heading">
            Contact
          </h5>
          <div className="space-y-3 text-sm text-white/80">
            <div className="flex items-center gap-3">
              <FiMapPin className="text-brand-300 text-lg drop-shadow-[0_0_6px_rgb(134,168,255)]" />
              <p> North Carolina, America</p>
            </div>
            <div className="flex items-center gap-3">
              <FiPhone className="text-brand-300 text-lg drop-shadow-[0_0_6px_rgb(134,168,255)]" />
              <p>+61 2 0000 0000</p>
            </div>
            <div className="flex items-center gap-3">
              <FiMail className="text-brand-300 text-lg drop-shadow-[0_0_6px_rgb(134,168,255)]" />
              <p>info@northernpatches.au</p>
            </div>
          </div>

          {/* 🔥 Neon Animated Social Icons */}
          <div className="mt-5 flex gap-5">
            {[
              { Icon: FiInstagram, href: "#" },
              { Icon: FiLinkedin, href: "#" },
              { Icon: FiTwitter, href: "#" },
            ].map(({ Icon, href }, idx) => (
              <a
                key={idx}
                href={href}
                className="relative text-white/80 group w-8 h-8 flex items-center justify-center"
              >
                <Icon className="transition-all duration-300 group-hover:text-brand-200 group-hover:drop-shadow-[0_0_12px_rgb(134,168,255)]" size={22} />
                <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 bg-gradient-to-tr from-brand-400 via-brand-300 to-brand-500 blur-xl animate-pulse-slow"></span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Copyright */}
      <div className="mt-16 border-t border-white/10 pt-6 text-center text-xs text-white/70">
        © {new Date().getFullYear()}{" "}
        <span className="font-medium text-white drop-shadow-[0_0_6px_rgb(134,168,255)]">
          Northern-Patches America
        </span>{" "}
        — Crafted with Pride us
      </div>
    </footer>
  );
}
