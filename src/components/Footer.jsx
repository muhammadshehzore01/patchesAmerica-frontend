"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiLinkedin, FiTwitter } from "react-icons/fi";

const SOCIALS = [
  { icon: FiInstagram, href: "https://instagram.com/northernpatches", label: "Instagram" },
  { icon: FiLinkedin, href: "https://linkedin.com/company/northernpatches", label: "LinkedIn" },
  { icon: FiTwitter, href: "https://x.com/northernpatches", label: "X (Twitter)" },
];

const QUICK_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] pt-20 pb-12">
      {/* Subtle decorative glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-10 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand / About Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center md:items-start text-center md:text-left"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden ring-2 ring-[var(--color-accent)]/30 shadow-lg">
                <Image
                  src="/usa-flag.jpg"
                  alt="USA Flag - Northern Patches"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-2xl font-bold tracking-tight">
                Northern Patches
              </h4>
            </div>
            <p className="text-[var(--color-text-secondary)] text-base leading-relaxed max-w-xs">
              Premium custom embroidered, PVC, chenille & woven patches — handcrafted with pride for the USA teams, brands, and individuals.
            </p>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col items-center md:items-start text-center md:text-left"
          >
            <h5 className="text-xl font-semibold mb-5">Quick Links</h5>
            <ul className="space-y-3 text-[var(--color-text-secondary)]">
              {QUICK_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-[var(--color-accent)] transition-colors duration-300 hover:underline underline-offset-4"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Socials Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col items-center md:items-start text-center md:text-left"
          >
            <h5 className="text-xl font-semibold mb-5">Get in Touch</h5>

            <div className="space-y-4 text-[var(--color-text-secondary)] text-base">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <FiMapPin className="text-[var(--color-accent)] w-5 h-5" />
                <span>North Carolina, United States</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <FiPhone className="text-[var(--color-accent)] w-5 h-5" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <FiMail className="text-[var(--color-accent)] w-5 h-5" />
                <span>hello@northernpatches.us</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-8 flex gap-5 justify-center md:justify-start">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)] text-[var(--color-accent)] hover:text-white transition-all duration-300 shadow-sm"
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-10 border-t border-white/10 text-center text-sm text-[var(--color-text-secondary)]">
          <p>
            © {new Date().getFullYear()} <span className="font-medium text-[var(--color-text-primary)]">Northern Patches USA</span>  
            <span className="mx-3">•</span>
            Crafted with precision & shipped with pride
          </p>
        </div>
      </div>
    </footer>
  );
}