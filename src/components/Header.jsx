"use client";
import { useState, useEffect, forwardRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { useHomeData } from "@/hooks/useApiHooks";

const Header = forwardRef((props, ref) => {
  const { services } = useHomeData();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const galleryHref =
    services.length > 0 && services[0]?.slug
      ? `/services/${services[0].slug}/gallery`
      : "/gallery";

  const { scrollY } = useScroll();
  const scrollYProgress = useSpring(scrollY, { stiffness: 100, damping: 20 });
  const particleY = useTransform(scrollYProgress, [0, 500], [0, 50]);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setScrolled(currentY > 40);
          setHidden(currentY > lastY && currentY > 120);
          lastY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ----------------------
  // Navigation Items
  // ----------------------
  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Gallery", href: galleryHref, prefetch: false }, // prefetch disabled
    { label: "Blog", href: "/blog", prefetch: false }, // prefetch disabled
    { label: "Contact", href: "/contact" },
  ];

  // ----------------------
  // NavLink component
  // ----------------------
  const NavLink = ({ href, children, prefetch = true }) => (
    <motion.div className="relative group" whileHover={{ y: -1 }}>
      <Link
        href={href}
        prefetch={prefetch}
        className="px-2 sm:px-3 py-[2px] sm:py-1 text-xs sm:text-sm md:text-base font-medium sm:font-semibold text-foreground/90 hover:text-primary transition-colors truncate max-w-[120px] sm:max-w-[140px]"
      >
        {children}
      </Link>
      <motion.span
        className="absolute left-0 bottom-0 h-[2px] bg-primary rounded-full"
        variants={{ rest: { width: 0 }, hover: { width: "100%" } }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );

  // ----------------------
  // Header JSX
  // ----------------------
  return (
    <motion.header
      ref={ref}
      initial={{ y: 0 }}
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 backdrop-blur-md transition-all duration-500
        ${scrolled ? "bg-background/95 shadow-lg" : "bg-background/70"}`}
    >
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/20 absolute blur-2xl"
            style={{ top: `${20 + i * 12}%`, left: `${i * 15}%` }}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 10 + i * 2, ease: "easeInOut", delay: i }}
          />
        ))}
        <motion.div
          className="w-24 h-24 sm:w-28 sm:h-28 bg-primary/30 rounded-full blur-3xl absolute top-8 left-1/2 -translate-x-1/2"
          style={{ y: particleY }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between h-16 sm:h-20 z-10">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 relative rounded-full overflow-hidden ring-2 ring-foreground/30 shadow-lg">
            <Image src="/usa-flag.jpg" alt="USA Flag" fill className="object-cover" priority />
          </div>
          <div className="flex flex-col leading-tight">
            <Link href="/" className="text-sm sm:text-base md:text-lg font-bold truncate">
              <span className="text-primary">Northern</span>
              <span className="text-foreground">-Patches</span>
              <span className="text-primary">-America</span>
            </Link>
            <span className="text-[9px] sm:text-xs text-muted-foreground hidden sm:block truncate">
              Made for United States | Premium Quality
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-2 sm:gap-4 md:gap-6 flex-shrink">
          {navItems.map((item) => (
            <NavLink key={item.label} href={item.href} prefetch={item.prefetch}>
              {item.label}
            </NavLink>
          ))}
          <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
            <Link
              href="/quote"
              className="px-3 sm:px-4 py-1 sm:py-2 rounded-full btn-primary text-primary-foreground font-semibold shadow-lg transition text-xs sm:text-sm truncate max-w-[120px]"
            >
              Get Quote
            </Link>
          </motion.div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex-shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg glass border border-foreground/20 text-foreground hover:bg-foreground/10 transition"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-t border-foreground/10 z-20"
          >
            <ul className="flex flex-col p-4 sm:p-6 gap-2 sm:gap-3 text-base sm:text-lg font-semibold text-foreground/90">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    prefetch={item.prefetch}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded hover:bg-primary/20 truncate"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/quote"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 rounded-full btn-primary text-primary-foreground font-semibold hover:bg-primary/90 transition truncate"
                >
                  Get Quote
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
});

Header.displayName = "Header";
export default Header;
