"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function OtherServicesGrid({ services = [], currentSlug }) {
  const [showAll, setShowAll] = useState(false);

  const filteredServices = useMemo(
    () => services.filter((s) => s.slug !== currentSlug),
    [services, currentSlug]
  );

  const visibleServices = showAll ? filteredServices : filteredServices.slice(0, 6);

  return (
    <section className="relative py-12 sm:py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0018FF]/10 via-transparent to-[#0600AB]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-12 tracking-tight"
        >
          Explore Other Services
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
                className="relative rounded-3xl overflow-hidden bg-white/10 border border-white/10 backdrop-blur-md hover:border-[#0033FF]/50 shadow-md hover:shadow-blue-600/30 transition-all duration-500 group"
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#0033FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                <Link href={`/services/${service.slug}`} className="block">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-3xl">
                    <Image
                      src={service.thumbnail || "/placeholder-service.jpg"}
                      alt={`${service.title} - Premium Patch Service in USA`}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform duration-700"
                      priority={index < 4}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition" />
                  </div>
                  <div className="p-4 md:p-5 text-left">
                    <h3 className="text-white font-semibold text-base md:text-lg mb-2 group-hover:text-[#00A6FF] transition">
                      {service.title}
                    </h3>
                    <p className="text-white/70 text-sm line-clamp-2">
                      {service.description || "Learn more about this premium patch service offered in the USA."}
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
            <p className="text-gray-400 text-sm">No other services available.</p>
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
            >
              {filteredServices.map((service, i) => (
                <SwiperSlide key={service.slug}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative bg-white/5 hover:bg-white/10 p-4 rounded-xl shadow-md border border-white/10 hover:border-blue-600 transition-all duration-300"
                  >
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg mb-3">
                      <Image
                        src={service.thumbnail || "/placeholder-service.jpg"}
                        alt={service.title}
                        fill
                        style={{ objectFit: "contain" }}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-1 text-white">{service.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                      {service.description || "Learn more about this premium patch service offered in the USA."}
                    </p>
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      View Details →
                    </Link>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {filteredServices.length > 6 && (
          <motion.button
            onClick={() => setShowAll(!showAll)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-[#0033FF] via-[#0600AB] to-[#00033D] text-white font-medium shadow-lg hover:shadow-blue-500/40 hover:scale-105 transition-all duration-500 relative overflow-hidden group"
          >
            <span className="relative z-10">{showAll ? "Show Less" : "Show All"}</span>
            <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
          </motion.button>
        )}
      </div>
    </section>
  );
}
