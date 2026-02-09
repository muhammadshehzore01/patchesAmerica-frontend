// src/components/Header.jsx
"use client";

import { useState, useEffect, forwardRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

const Header = forwardRef(function Header(_, ref) {
  const pathname = usePathname();

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const { scrollY } = useScroll();
  const scrollYSpring = useSpring(scrollY, { stiffness: 120, damping: 20 });
  const particleY = useTransform(scrollYSpring, [0, 500], [0, 50]);

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

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Gallery", href: "/services/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  const handleQuoteClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "quote_click", {
        event_category: "Header",
        event_label: "Get Quote Button",
        page_path: window.location.pathname,
        value: 1,
      });
    }
  };

  const NavLink = ({ href, children, prefetch = true }) => {
    const isActive =
      pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

    return (
      <motion.div className="relative group" whileHover={{ y: -1 }}>
        <Link
          href={href}
          prefetch={prefetch}
          className={`px-2 sm:px-3 py-1 text-sm md:text-base font-semibold transition-colors ${
            isActive
              ? "text-white underline underline-offset-4 decoration-blue-400 decoration-2"
              : "text-blue-300 hover:text-white"
          }`}
        >
          {children}
        </Link>
        <motion.span
          className="absolute left-0 bottom-0 h-[2px] bg-blue-400 rounded-full"
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    );
  };

  return (
    <motion.header
      ref={ref}
      role="banner"
      aria-label="Main Navigation"
      initial={{ y: 0 }}
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 backdrop-blur-md transition-all duration-500 ${
        scrolled ? "bg-background/95 shadow-lg" : "bg-background/70"
      }`}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="w-16 h-16 rounded-full bg-primary/20 absolute blur-2xl"
            style={{ top: `${20 + i * 15}%`, left: `${i * 20}%` }}
            animate={{ y: [0, 10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 10 + i * 2,
              ease: "easeInOut",
            }}
          />
        ))}

        <motion.div
          className="w-24 h-24 bg-primary/30 rounded-full blur-3xl absolute top-8 left-1/2 -translate-x-1/2"
          style={{ y: particleY }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 relative rounded-full overflow-hidden ring-2 ring-foreground/30">
            <Image
              src="/usa-flag.jpg"
              alt="USA Flag"
              fill
              className="object-cover"
              priority
            />
          </div>

          <Link
            href="/"
            className="font-bold text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400"
          >
            <span className="text-primary">Northern</span>
            <span className="text-foreground"> Patches</span>
            <span className="text-primary"> America</span>
          </Link>
        </div>

        <nav
          className="hidden lg:flex items-center gap-6"
          aria-label="Primary Navigation"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              href={item.href}
              prefetch={item.label !== "Gallery"}
            >
              {item.label}
            </NavLink>
          ))}

          <Link
            href="/quote"
            onClick={handleQuoteClick}
            className="px-4 py-2 rounded-full bg-blue-700 text-white font-semibold shadow-lg hover:bg-blue-800 transition-colors"
          >
            Get Quote
          </Link>
        </nav>

        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="lg:hidden p-2 rounded-lg glass border border-foreground/20"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-foreground/10"
            aria-label="Mobile Navigation"
          >
            <ul className="flex flex-col p-4 gap-3 text-base font-semibold">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="block px-3 py-2 rounded hover:bg-primary/20"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  href="/quote"
                  onClick={handleQuoteClick}
                  className="block text-center px-4 py-2 rounded-full bg-blue-700 text-white font-semibold hover:bg-blue-800 transition-colors"
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

export default Header;