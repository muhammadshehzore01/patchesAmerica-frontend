"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  const scrollYProgress = useSpring(scrollY, { stiffness: 100, damping: 20 });
  const particleY = useTransform(scrollYProgress, [0, 500], [0, 50]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NavLink = ({ href, children, onClick }) => (
    <motion.div
      className="relative perspective-1000"
      whileHover={{ rotateX: 10, rotateY: 5 }}
      initial="rest"
      animate="rest"
    >
      <Link
        href={href}
        onClick={onClick}
        className="relative z-10 px-3 py-1 font-semibold text-white/90 transition-colors bg-clip-text bg-gradient-to-r from-white via-white/80 to-white hover:text-transparent hover:bg-gradient-to-r hover:from-[#FF0000] hover:via-[#FF5555] hover:to-[#FF0000]"
      >
        {children}
      </Link>
      <motion.span
        className="absolute left-0 bottom-0 h-[2px] rounded blur-sm bg-gradient-to-r from-[#FF0000] via-[#FF5555] to-[#FF0000]"
        variants={{
          rest: { width: 0, opacity: 0 },
          hover: { width: "100%", opacity: 1 },
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
    </motion.div>
  );

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-gradient-to-r from-brand-900/90 via-brand-800/80 to-brand-700/80 backdrop-blur-md shadow-2xl"
          : "bg-gradient-to-r from-brand-900/70 via-brand-800/60 to-brand-700/60 backdrop-blur-sm"
      }`}
      style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }}
    >
      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`w-24 h-24 rounded-full bg-[#FF0000]/20 absolute blur-2xl`}
            style={{
              top: `${20 + i * 10}%`,
              left: `${i * 15}%`,
            }}
            animate={{ y: [0, 10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 12 + i * 2,
              ease: "easeInOut",
              delay: i,
            }}
          />
        ))}
        <motion.div
          className="w-32 h-32 bg-[#FF5555]/20 rounded-full blur-3xl absolute top-10 left-1/2 -translate-x-1/2"
          style={{ y: particleY }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between z-20">
        {/* Logo + Brand */}
        <div className="flex items-center gap-2 sm:gap-3 z-10 relative">
          <div className="w-10 h-10 sm:w-12 sm:h-12 relative rounded-full overflow-hidden ring-2 ring-white/30 shadow-lg">
            <Image
              src="/usa-flag.jpg"
              alt="United States Of America Flag Logo"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <Link href="/" className="text-base sm:text-lg md:text-2xl font-bold leading-none">
              <span className="text-[#FF0000]">Northern</span>
              <span className="text-white">-Patches</span>
              <span className="text-[#FF0000]">-America</span>
            </Link>
            {/* Hidden on mobile */}
            <div className="text-[9px] sm:text-xs text-white/70 hidden sm:block">
              Made for United States Of America | Premium Quality
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 md:gap-8 text-sm font-medium z-10 relative">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/services">Services</NavLink>
          <NavLink href="/contact">Contact</NavLink>
          <motion.div whileHover={{ scale: 1.1, rotate: 1 }}>
            <Link
              href="/quote"
              className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#FF0000]/90 text-white font-semibold shadow-2xl hover:bg-[#FF0000]/100 transition-all text-xs sm:text-sm"
              style={{
                boxShadow: "0 8px 20px rgba(255,0,0,0.4), 0 4px 10px rgba(0,0,0,0.2)",
              }}
            >
              Get-Quotation
            </Link>
          </motion.div>
        </nav>

        {/* Mobile Button */}
        <div className="lg:hidden z-10 relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 shadow-md transition"
            aria-label="Toggle Menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden absolute top-full left-0 w-full bg-gradient-to-b from-brand-900/95 to-brand-700/95 backdrop-blur-xl border-t border-white/10 shadow-2xl z-20"
            style={{ boxShadow: "0 15px 40px rgba(0,0,0,0.35)" }}
          >
            <ul className="flex flex-col p-5 sm:p-6 space-y-3 sm:space-y-4 text-base sm:text-lg font-semibold text-white/90">
              {["/", "About", "Services", "Contact"].map((item) => (
                <motion.li
                  key={item}
                  whileHover={{ x: 10, color: "#FF5555", textShadow: "0 0 8px #FF0000" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link href={`/${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>
                    {item}
                  </Link>
                </motion.li>
              ))}
              <motion.li whileHover={{ scale: 1.05 }}>
                <Link
                  href="/quote"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 rounded-full bg-[#FF0000] text-white shadow-2xl text-center hover:scale-105 transition-transform"
                  style={{ boxShadow: "0 8px 20px rgba(255,0,0,0.4), 0 4px 10px rgba(0,0,0,0.2)" }}
                >
                  Get-Quotation
                </Link>
              </motion.li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
