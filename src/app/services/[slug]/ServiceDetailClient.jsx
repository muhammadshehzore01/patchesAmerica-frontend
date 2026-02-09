"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import PatchRequestWizard from "@/components/PatchRequestWizard";
import { useServices } from "@/hooks/useApiHooks";
import DOMPurify from 'isomorphic-dompurify';

const getServiceImage = (item) =>
  item?.url || item?.image || item?.image_url || "/default-service-image.jpg";

export default function ServiceDetailClient({ service }) {
  const { services: allServices = [], isLoading } = useServices();
  const [windowWidth, setWindowWidth] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [showQuotationForm, setShowQuotationForm] = useState(false);

  // Sanitize description once (safe against XSS)
  const cleanDescription = useMemo(() => {
    return DOMPurify.sanitize(service?.description || "");
  }, [service?.description]);

  useEffect(() => {
    const resize = () => setWindowWidth(window.innerWidth);
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const isMobile = windowWidth <= 767;

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--color-text-secondary)]">
        Loading premium custom patch details...
      </div>
    );
  }

  const gallery = Array.isArray(service.gallery) ? service.gallery : [];
  const filteredServices = useMemo(
    () => allServices.filter((s) => s.slug !== service.slug),
    [allServices, service.slug]
  );
  const visibleServices = showAll ? filteredServices : filteredServices.slice(0, 6);

  // ────────────────────────────────────────────────
  // MOBILE VIEW
  // ────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="pt-20 px-4 pb-12 space-y-8 text-[var(--color-text-primary)]">
        {/* Gallery Slider */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <Swiper
            modules={[Pagination]}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              bulletClass: "np-swiper-bullet",
              bulletActiveClass: "np-swiper-bullet-active",
            }}
            spaceBetween={12}
            slidesPerView={1.15}
            centeredSlides
            grabCursor
            className="rounded-2xl"
          >
            {(gallery.length ? gallery : [service]).map((img, i) => (
              <SwiperSlide key={i}>
                <div className="relative h-[240px] bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md flex items-center justify-center">
                  <Image
                    src={getServiceImage(img)}
                    alt={`${service.title} – Custom ${service.title} Patch USA | No Minimum Order by Northern Patches`}
                    fill
                    className="object-contain p-4"
                    priority={i === 0}
                    decoding="async"
                    sizes="(max-width: 640px) 100vw, 80vw"
                    quality={75}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Service Info */}
        <div className="space-y-6 bg-[var(--color-bg-secondary)]/40 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {service.title} USA – Custom Patches No Minimum Order
          </h1>

          {/* FIXED: Render rich HTML description */}
          <div
            className="prose prose-invert prose-sm sm:prose-base max-w-none text-[var(--color-text-secondary)] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: cleanDescription }}
          />

          {/* Get Quotation Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowQuotationForm(!showQuotationForm)}
            className="w-full btn-primary py-5 text-lg font-semibold flex items-center justify-center gap-3 shadow-xl rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)]"
          >
            {showQuotationForm ? "Close Form" : "Get Your Custom Quote Now"}
            <ArrowRight size={20} />
          </motion.button>

          {/* Inline Quotation Form */}
          <AnimatePresence>
            {showQuotationForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden mt-4"
              >
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">
                      Custom Quote for {service.title} USA
                    </h3>
                    <button
                      onClick={() => setShowQuotationForm(false)}
                      className="text-[var(--color-text-secondary)] hover:text-white transition p-2 rounded-full hover:bg-white/10"
                      aria-label="Close quotation form"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <PatchRequestWizard
                    initialService={{
                      title: service.title,
                      description: service.description,
                      image: getServiceImage(service),
                    }}
                    onClose={() => setShowQuotationForm(false)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Other Services */}
        <section className="pt-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Explore More Custom Patch Services USA
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {visibleServices.map((s) => (
              <div
                key={s.slug}
                className="glass p-5 rounded-2xl hover:scale-[1.02] transition-transform duration-300 shadow-lg focus-within:ring-2 focus-within:ring-[var(--color-accent)] focus-within:ring-offset-2"
              >
                <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                  <Image
                    src={getServiceImage(s)}
                    alt={`${s.title} – Custom Patches USA | No Minimum Order by Northern Patches`}
                    fill
                    className="object-contain p-4"
                    decoding="async"
                    sizes="100vw"
                    quality={75}
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title} USA</h3>
                <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 mb-3">
                  {s.description?.replace(/<[^>]+>/g, ' ') || "Premium custom patch service – no minimum order."}
                </p>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-[var(--color-accent)] font-medium hover:text-[var(--color-accent-dark)] transition-colors flex items-center gap-2 focus-visible:underline"
                >
                  View {s.title} →
                </Link>
              </div>
            ))}
          </div>
          {filteredServices.length > 6 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAll(!showAll)}
                className="btn-primary px-8 py-3 text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)]"
              >
                {showAll ? "Show Less" : "View More Services"}
              </button>
            </div>
          )}
        </section>
      </div>
    );
  }

  // ────────────────────────────────────────────────
  // DESKTOP VIEW
  // ────────────────────────────────────────────────
  return (
    <div className="relative max-w-7xl mx-auto px-6 py-16 space-y-16 text-[var(--color-text-primary)]">
      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Gallery */}
        <div className="relative group rounded-3xl overflow-hidden shadow-2xl">
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".next-arrow-desktop",
              prevEl: ".prev-arrow-desktop",
            }}
            slidesPerView={1}
            spaceBetween={0}
            className="rounded-3xl"
          >
            {(gallery.length ? gallery : [service]).map((img, i) => (
              <SwiperSlide key={i}>
                <div className="relative h-[520px] bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl flex items-center justify-center">
                  <Image
                    src={getServiceImage(img)}
                    alt={`${service.title} – Custom ${service.title} Patch USA | No Minimum Order by Northern Patches`}
                    fill
                    className="object-contain p-8"
                    priority={i === 0}
                    decoding="async"
                    quality={75}
                    sizes="(max-width: 1024px) 100vw, 80vw"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Desktop Arrows */}
          <button className="prev-arrow-desktop absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-black/40 backdrop-blur-md text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-cyan-400">
            <ChevronLeft size={28} />
          </button>
          <button className="next-arrow-desktop absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-black/40 backdrop-blur-md text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-cyan-400">
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Details & CTA */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 sticky top-24"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-accent)] to-purple-500 bg-clip-text text-transparent">
            {service.title} USA – Custom Patches No Minimum Order
          </h1>

          {/* FIXED: Render rich HTML description */}
          <div
            className="prose prose-invert prose-lg max-w-none leading-relaxed text-[var(--color-text-secondary)]"
            dangerouslySetInnerHTML={{ __html: cleanDescription }}
          />

          {/* Get Quotation Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowQuotationForm(!showQuotationForm)}
            className="w-full md:w-auto btn-primary px-12 py-6 text-xl font-semibold flex items-center justify-center gap-3 shadow-2xl rounded-full transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)]"
          >
            {showQuotationForm ? "Close Form" : "Get Your Custom Quote Now"}
            <ArrowRight size={24} className={showQuotationForm ? "" : "animate-pulse"} />
          </motion.button>

          {/* Inline Quotation Form */}
          <AnimatePresence>
            {showQuotationForm && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: 20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: 20 }}
                transition={{ duration: 0.6 }}
                className="overflow-hidden mt-8 rounded-3xl border border-[var(--color-accent)]/30 bg-gradient-to-b from-[var(--color-bg-secondary)] to-[var(--color-bg-primary)] backdrop-blur-xl shadow-2xl"
              >
                <div className="p-8 md:p-10">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-accent)] to-purple-500 bg-clip-text text-transparent">
                      Custom Quote for {service.title} USA
                    </h3>
                    <button
                      onClick={() => setShowQuotationForm(false)}
                      className="text-[var(--color-text-secondary)] hover:text-white transition p-2 rounded-full hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-cyan-400"
                      aria-label="Close quotation form"
                    >
                      <X size={28} />
                    </button>
                  </div>
                  <PatchRequestWizard
                    initialService={{
                      title: service.title,
                      description: service.description,
                      image: getServiceImage(service),
                    }}
                    onClose={() => setShowQuotationForm(false)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Other Services */} 
      <section className="pt-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
          Explore More Premium Custom Patch Services USA
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {visibleServices.map((s) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass p-6 rounded-3xl hover:scale-[1.02] transition-transform duration-300 shadow-xl focus-within:ring-2 focus-within:ring-[var(--color-accent)] focus-within:ring-offset-2"
              >
                <div className="relative h-56 rounded-2xl overflow-hidden mb-5">
                  <Image
                    src={getServiceImage(s)}
                    alt={`${s.title} – Custom Patches USA | No Minimum Order by Northern Patches`}
                    fill
                    className="object-contain p-6"
                    decoding="async"
                    quality={75}
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
                  {s.title} USA
                </h3>
                <p className="text-[var(--color-text-secondary)] line-clamp-3 mb-4">
                  {s.description?.replace(/<[^>]+>/g, ' ') || "Premium custom patch service – no minimum order."}
                </p>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-[var(--color-accent)] font-medium hover:text-[var(--color-accent-dark)] transition-colors flex items-center gap-2 focus-visible:underline"
                >
                  View {s.title} Details →
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {filteredServices.length > 6 && (
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowAll(!showAll)}
              className="btn-primary px-10 py-5 text-lg font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)]"
            >
              {showAll ? "Show Fewer Services" : "View More Custom Services"}
            </motion.button>
          </div>
        )}
      </section>
    </div>
  );
}