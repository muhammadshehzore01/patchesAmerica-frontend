// src/components/home/CTAStrip.jsx
"use client";

import Link from "next/link";

export default function CTAStrip() {
  const handleQuoteClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "quote_click", {
        event_category: "CTA",
        event_label: "Footer CTA Strip",
        page_path: window.location.pathname,
        value: 1,
      });
    }
  };

  return (
    <section className="py-32 bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-indigo-900/80 text-center">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 mb-8 tracking-tight">
          Ready to Create Your Custom Patch Masterpiece USA?
        </h2>

        <p className="text-[var(--color-text-secondary)] text-xl mb-10 max-w-3xl mx-auto">
          Get started with a free quote and bring your design to life with premium quality USA-made
          custom embroidered patches, PVC patches no minimum, and fast US shipping.
        </p>

        <Link
          href="/quote"
          onClick={handleQuoteClick}
          className="btn-primary inline-block text-xl px-12 py-6"
        >
          Request Free Quote Now
        </Link>
      </div>
    </section>
  );
}