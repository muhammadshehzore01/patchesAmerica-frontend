// src/components/home/OtherServicesGrid.jsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Helper: Strip HTML tags safely
const stripHtml = (html = "") => {
  if (typeof window === "undefined") return html;
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

// Helper: Get image URL with fallback
const getImage = (service) => {
  return service.thumbnail || service.image || service.image_url || "/images/placeholder-service.jpg";
};

export default function OtherServicesGrid({ services = [], currentSlug }) {
  const [showAll, setShowAll] = useState(false);

  // Filter out current service
  const filteredServices = useMemo(
    () => services.filter((s) => s.slug !== currentSlug),
    [services, currentSlug]
  );

  const visibleServices = showAll ? filteredServices : filteredServices.slice(0, 6);

  return (
    <section className="relative py-12 sm:py-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0018FF]/10 via-transparent to-[#0600AB]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 mb-12 tracking-tight"
        >
          Explore More Custom Patch Services USA
        </motion.h2>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
          <AnimatePresence>
            {visibleServices.map((service, index) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="group relative rounded-3xl overflow-hidden bg-white/10 border border-white/10 backdrop-blur-md hover:border-[#0033FF]/50 shadow-md hover:shadow-blue-600/30 transition-all duration-500 focus-within:ring-2 focus-within:ring-cyan-400 focus-within:ring-offset-2 block"
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#0033FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

                  {/* Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-3xl">
                    <Image
                      src={getImage(service)}
                      alt={`${service.title} – Custom Patch USA | No Minimum by Northern Patches`}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform duration-700"
                      priority={index < 4}
                      quality={75}
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  {/* Text */}
                  <div className="p-4 md:p-5 text-left">
                    <h3 className="text-white font-semibold text-base md:text-lg mb-2 group-hover:text-[#00A6FF] transition">
                      {service.title} USA – No Minimum
                    </h3>
                    <p className="text-white/70 text-sm line-clamp-2">
                      {stripHtml(service.description) ||
                        "Premium custom patch service in USA with no minimum order & fast shipping."}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Mobile Swiper */}
        <div className="md:hidden">
          {filteredServices.length === 0 ? (
            <p className="text-gray-400 text-sm">No other custom patch services available.</p>
          ) : (
            <Swiper
              modules={[Navigation]}
              spaceBetween={12}
              slidesPerView={1.2}
              breakpoints={{
                480: { slidesPerView: 1.5 },
                640: { slidesPerView: 1.8 },
                768: { slidesPerView: 2.2 },
              }}
              navigation={{
                nextEl: ".swiper-button-next-mobile",
                prevEl: ".swiper-button-prev-mobile",
              }}
              className="pb-10"
            >
              {filteredServices.map((service, i) => (
                <SwiperSlide key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group relative bg-white/5 hover:bg-white/10 p-4 rounded-xl shadow-md border border-white/10 hover:border-blue-600 transition-all duration-300 focus-within:ring-2 focus-within:ring-cyan-400 focus-within:ring-offset-2 block"
                  >
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg mb-3">
                      <Image
                        src={getImage(service)}
                        alt={`${service.title} – Custom Patch USA | No Minimum by Northern Patches`}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                        quality={75}
                        sizes="100vw"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-1 text-white">{service.title} USA</h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                      {stripHtml(service.description) ||
                        "Premium custom patch service in USA with no minimum."}
                    </p>
                  </Link>
                </SwiperSlide>
              ))}

              {/* Custom mobile arrows */}
              <div className="swiper-button-prev-mobile absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 backdrop-blur-md text-white p-3 rounded-full opacity-90 hover:opacity-100 transition shadow-lg" />
              <div className="swiper-button-next-mobile absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 backdrop-blur-md text-white p-3 rounded-full opacity-90 hover:opacity-100 transition shadow-lg" />
            </Swiper>
          )}
        </div>

        {/* Show All / Less Button */}
        {filteredServices.length > 6 && (
          <motion.button
            onClick={() => setShowAll(!showAll)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-[#0033FF] via-[#0600AB] to-[#00033D] text-white font-medium shadow-lg hover:shadow-blue-500/40 hover:scale-105 transition-all duration-500 relative overflow-hidden group focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400"
          >
            <span className="relative z-10">{showAll ? "Show Less" : "Show All Services"}</span>
            <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
          </motion.button>
        )}
      </div>
    </section>
  );
}
