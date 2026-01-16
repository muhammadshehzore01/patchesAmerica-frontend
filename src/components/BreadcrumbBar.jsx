// frontend\src\components\BreadcrumbBar.jsx
"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { motion } from "framer-motion";
import Head from "next/head";

/**
 * Dynamic breadcrumb bar with built-in SEO (JSON-LD)
 * @param {string} current - Current page name
 * @param {string} gradient - Tailwind gradient (e.g., 'from-sky-700 via-sky-800 to-sky-900')
 * @param {string} baseUrl - Optional base site URL for schema generation
 */
export default function BreadcrumbBar({
  current,
  gradient = "from-brand-800 via-brand-700 to-brand-900",
  baseUrl = "https://northren-patches.au",
}) {
  // ✅ Dynamic breadcrumb schema for Google
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: current,
        item: `${baseUrl}/${current.toLowerCase()}`,
      },
    ],
  };

  return (
    <>
      {/* ✅ SEO Structured Data */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      {/* ✅ Gradient Breadcrumb Bar */}
      <motion.nav
        aria-label="Breadcrumb"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full bg-gradient-to-r ${gradient} py-4 shadow-md`}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center gap-2 text-sm md:text-base text-brand-100">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-brand-50 transition-colors"
          >
            <Home className="w-4 h-4 md:w-5 md:h-5" />
            Home
          </Link>
          <span className="text-brand-300">›</span>
          <span className="text-brand-50 font-semibold">{current}</span>
        </div>
      </motion.nav>
    </>
  );
}
