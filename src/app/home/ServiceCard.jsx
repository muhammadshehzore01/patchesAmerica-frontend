// frontend\src\app\home\ServiceCard.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/**
 * ServiceCard
 * - Angled layered card shape using rotated accent element
 * - Glassy gradient background (theme colors)
 * - Hover lift, glow, subtle shine
 * - Expects `service.gallery[0].image` as the cover (normalized by your api util)
 */
export default function ServiceCard({ service }) {
  const cover = service?.gallery?.[0]?.image ?? service?.image_url ?? "/placeholder.png";

  return (
    <motion.article
      whileHover={{ translateY: -8, scale: 1.01 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative will-change-transform"
      aria-labelledby={`svc-${service?.slug ?? service?.id}-title`}
    >
      {/* Angled accent & layered background */}
      <div className="relative z-0 overflow-visible">
        {/* rotated accent behind card */}
        <div
          aria-hidden
          className="absolute -inset-0.5 -translate-y-6 left-6 right-6 rounded-3xl transform rotate-[-2deg] blur-[14px] opacity-30"
          style={{
            background:
              "linear-gradient(90deg, rgba(2,6,58,0.55) 0%, rgba(3,12,255,0.25) 40%, rgba(47,102,255,0.15) 100%)",
            zIndex: 0,
          }}
        />

        {/* Main card */}
        <div className="relative rounded-3xl overflow-hidden border border-brand-700/20 bg-gradient-to-b from-brand-900/60 to-brand-800/40 shadow-[0_12px_40px_rgba(3,12,255,0.14)]">
          {/* media */}
          <div className="relative h-56 md:h-48 lg:h-56">
            <Image
              src={cover}
              alt={service?.title ?? "Service image"}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
            />
            {/* subtle top gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 to-transparent" />
            {/* service tag top-left */}
            <div className="absolute left-4 top-4 px-3 py-1 rounded-full bg-brand-700/80 text-white text-sm font-semibold backdrop-blur-sm ring-1 ring-brand-900/30">
              {service?.category ?? "Service"}
            </div>
            {/* angled highlight */}
            <div
              aria-hidden
              className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full opacity-40"
              style={{ background: "radial-gradient(circle at 30% 30%, rgba(47,102,255,0.25), rgba(6,0,171,0.05))" }}
            />
          </div>

          {/* content */}
          <div className="p-6 relative z-10">
            <h3 id={`svc-${service?.slug ?? service?.id}-title`} className="text-xl md:text-2xl font-extrabold text-white tracking-tight mb-2">
              {service?.title}
            </h3>

            <p className="text-sm text-white/75 line-clamp-3 mb-4">
              {service?.description ?? service?.summary ?? "Premium engineered solutions for industrial insulation & patching."}
            </p>

            <div className="flex items-center justify-between gap-4">
              <Link
                href={`/services/${service?.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-300 hover:text-white transition-colors"
                aria-label={`Explore details for ${service?.title}`}
              >
                Explore Details
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="#quotes"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-700 text-white text-sm font-semibold shadow-md hover:bg-brand-600 transition"
              >
                Get Quote
              </Link>
            </div>
          </div>
        </div>

        {/* glass top border for depth */}
        <div className="absolute -top-6 left-8 right-8 h-2 transform rotate-[-2deg] rounded-full bg-gradient-to-r from-brand-700/60 to-brand-500/30 opacity-80" />
      </div>
    </motion.article>
  );
}
