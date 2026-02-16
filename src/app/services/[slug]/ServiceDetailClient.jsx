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
import DOMPurify from "isomorphic-dompurify";
import OtherServicesGrid from "./OtherServicesGrid";
const getServiceImage = (item) =>
  item?.url || item?.image || item?.image_url || "/default-service-image.jpg";
export default function ServiceDetailClient({ service }) {
  const { services: allServices = [], isLoading } = useServices();
  // States
  const [windowWidth, setWindowWidth] = useState(0);
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [showAllRelated, setShowAllRelated] = useState(false);
  // Clean description safely
  const cleanDescription = useMemo(() => {
    if (!service?.description) return "";
    return DOMPurify.sanitize(service.description, {
      ADD_TAGS: [],
      ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
    });
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
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading premium custom patch details...
      </div>
    );
  }
  const gallery = Array.isArray(service.gallery) ? service.gallery : [];
  const relatedServices = useMemo(
    () => allServices.filter((s) => s.slug !== service.slug),
    [allServices, service.slug]
  );
  const visibleRelated = showAllRelated
    ? relatedServices
    : relatedServices.slice(0, 6);
  /* ================= MOBILE ================= */
  if (isMobile) {
    return (
      <div className="pt-20 px-4 pb-16 space-y-10">
        {/* Hero Slider */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true, dynamicBullets: true }}
            spaceBetween={12}
            slidesPerView={1.12}
            centeredSlides
            grabCursor
            className="rounded-2xl"
          >
            {(gallery.length ? gallery : [service]).map((img, i) => (
              <SwiperSlide key={i}>
                <div className="relative h-[260px] bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl flex items-center justify-center overflow-hidden">
                  <Image
                    src={getServiceImage(img)}
                    alt={`${service.title} – Custom Patch USA | No Minimum Order`}
                    fill
                    className="object-contain p-6"
                    priority={i === 0}
                    quality={80}
                    sizes="100vw"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* Main Content */}
        <div className="space-y-8 bg-gradient-to-b from-gray-900/40 to-black/60 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {service.title} – USA Custom Patches No Minimum
          </h1>
          <div
            className="prose prose-invert prose-sm sm:prose-base max-w-none leading-relaxed text-gray-300 [&_a]:text-cyan-400 [&_a:hover]:underline [&_table]:border-collapse [&_th]:bg-gray-800/70 [&_th]:p-3 [&_th]:border [&_th]:border-gray-700 [&_td]:p-3 [&_td]:border [&_td]:border-gray-700"
            dangerouslySetInnerHTML={{ __html: cleanDescription }}
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowQuotationForm(!showQuotationForm)}
            className="w-full py-5 px-6 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-3 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-black"
          >
            {showQuotationForm ? "Close Quote Form" : "Get Custom Quote Now"}
            <ArrowRight size={20} />
          </motion.button>
          <AnimatePresence>
            {showQuotationForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden mt-4 rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl shadow-2xl"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">
                      Custom Quote – {service.title}
                    </h3>
                    <button
                      onClick={() => setShowQuotationForm(false)}
                      className="text-gray-400 hover:text-white transition p-2 rounded-full hover:bg-white/10"
                      aria-label="Close form"
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
          {/* Other Services – Mobile */}
          {relatedServices.length > 0 && (
            <section className="pt-6">
              <h2 className="text-2xl font-bold mb-6 text-center text-white">
                More Custom Patch Services
              </h2>
              <div className="space-y-6">
                {visibleRelated.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="block bg-gray-900/40 backdrop-blur-lg p-5 rounded-2xl border border-white/10 hover:border-cyan-500/50 transition-all shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={getServiceImage(s)}
                          alt={s.title}
                          fill
                          className="object-contain p-2"
                          quality={75}
                          sizes="96px"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-white mb-1">
                          {s.title}
                        </h3>
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {s.description?.replace(/<[^>]+>/g, " ") ||
                            "Premium custom patch service"}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {relatedServices.length > 6 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowAllRelated(!showAllRelated)}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-medium hover:shadow-lg transition-all"
                  >
                    {showAllRelated ? "Show Less" : "View All Services"}
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    );
  }
  /* ================= DESKTOP ================= */
  return (
    <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20 space-y-20 text-white">
      {/* First Row: Two Columns - Slider and Title */}
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-gray-900/80 to-black/80 min-h-[520px] group">
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".next-arrow-desktop",
              prevEl: ".prev-arrow-desktop",
            }}
            slidesPerView={1}
            spaceBetween={0}
            className="h-full rounded-3xl"
          >
            {(gallery.length ? gallery : [service]).map((img, i) => (
              <SwiperSlide key={i}>
                <div className="relative h-full flex items-center justify-center">
                  <Image
                    src={getServiceImage(img)}
                    alt={`${service.title} – Custom Patch USA | No Minimum Order`}
                    fill
                    className="object-contain p-12"
                    priority={i === 0}
                    quality={80}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button className="prev-arrow-desktop absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-black/50 backdrop-blur-md text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg">
            <ChevronLeft size={28} />
          </button>
          <button className="next-arrow-desktop absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-black/50 backdrop-blur-md text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg">
            <ChevronRight size={28} />
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-10"
        >
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            {service.title} – USA Custom Patches No Minimum
          </h1>
        </motion.div>
      </div>
      {/* Second Row: Description Full Line */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-10"
      >
        <div
          className="prose prose-invert prose-lg lg:prose-xl max-w-none leading-relaxed text-gray-200"
          dangerouslySetInnerHTML={{ __html: cleanDescription }}
        />
        <motion.button
          whileHover={{
            scale: 1.03,
            boxShadow: "0 20px 40px rgba(34, 211, 238, 0.3)",
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowQuotationForm(!showQuotationForm)}
          className="w-full lg:w-auto px-10 py-6 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-bold text-xl rounded-full shadow-2xl hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-3"
        >
          {showQuotationForm ? "Close Quote Form" : "Get Your Custom Quote Now"}
          <ArrowRight size={24} />
        </motion.button>
        <AnimatePresence>
          {showQuotationForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl shadow-2xl"
            >
              <div className="p-8 lg:p-10">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white">
                    Custom Quote – {service.title}
                  </h3>
                  <button
                    onClick={() => setShowQuotationForm(false)}
                    className="text-gray-400 hover:text-white transition p-3 rounded-full hover:bg-white/10"
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
      {/* Third Row: Other Services */}
      {relatedServices.length > 0 && (
        <section className="pt-16 lg:pt-24 border-t border-gray-800">
          <OtherServicesGrid
            services={relatedServices}
            currentSlug={service.slug}
          />
        </section>
      )}
    </div>
  );
}