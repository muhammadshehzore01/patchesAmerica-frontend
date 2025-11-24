'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PatchRequestWizard from '@/components/PatchRequestWizard';
import { useGlobalModal } from '@/components/GlobalModalProvider';
import { useServices } from '@/hooks/useApiHooks';
import { useEffect, useState } from 'react';

const getServiceImage = (item) => item?.url || item?.image || item?.image_url || '/default-service-image.jpg';

export default function ServiceDetailClient({ service }) {
  const { services: allServices = [], isLoading } = useServices();
  const { openModal, closeModal } = useGlobalModal();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleGetQuote = () => {
    openModal(
      <PatchRequestWizard
        initialService={{
          title: service.title,
          description: service.description,
          image: getServiceImage(service),
        }}
        onClose={closeModal}
      />
    );
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="px-3 sm:px-4 py-6 sm:py-8 space-y-6 w-full">

        {/* Slider with larger arrows */}
        <div className="relative w-full group">
          <button className="prev-arrow absolute left-1 top-1/2 -translate-y-1/2 z-30 bg-black/50 text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="next-arrow absolute right-1 top-1/2 -translate-y-1/2 z-30 bg-black/50 text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg">
            <ChevronRight className="w-6 h-6" />
          </button>

          <Swiper
            modules={[Navigation]}
            navigation={{ nextEl: '.next-arrow', prevEl: '.prev-arrow' }}
            spaceBetween={12}
            slidesPerView={1}
            className="rounded-xl overflow-hidden"
          >
            {(service.gallery?.length ?? 0) > 0
              ? service.gallery.map((img, i) => (
                  <SwiperSlide key={i}>
                    <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] flex items-center justify-center bg-black/10 rounded-xl overflow-hidden">
                      <Image
                        src={getServiceImage(img)}
                        alt={service.image_alt || service.title}
                        fill
                        style={{ objectFit: 'contain' }}
                        priority={i === 0}
                      />
                    </div>
                  </SwiperSlide>
                ))
              : (
                  <SwiperSlide>
                    <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] flex items-center justify-center bg-black/10 rounded-xl overflow-hidden">
                      <Image
                        src={getServiceImage(service)}
                        alt={service.image_alt || service.title}
                        fill
                        style={{ objectFit: 'contain' }}
                        priority
                      />
                    </div>
                  </SwiperSlide>
                )}
          </Swiper>
        </div>

        {/* Title & Description */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-xl sm:text-2xl font-bold">{service.title}</h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{service.description}</p>
        </div>

        {/* Get Quote Button */}
        <button
          onClick={handleGetQuote}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all rounded-full font-bold shadow-lg hover:shadow-[0_0_40px_cyan,0_0_60px_blue]"
        >
          Get Quotation <ArrowRight className="w-5 h-5" />
        </button>

        {/* Other Services */}
        <section className="mt-6 sm:mt-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Other Services</h2>
          {isLoading ? (
            <p>Loading other services...</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {allServices.filter((s) => s.slug !== service.slug).map((s, i) => (
                <motion.div
                  key={s.slug}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative bg-white/5 hover:bg-white/10 p-4 rounded-xl shadow-md border border-white/10 hover:border-blue-600 transition-all duration-300"
                >
                  <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] overflow-hidden rounded-lg mb-3">
                    <Image
                      src={getServiceImage(s)}
                      alt={s.title}
                      fill
                      style={{ objectFit: 'contain' }}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-2">{s.description}</p>
                  <a
                    href={`/services/${s.slug}`}
                    title={`View details for ${s.title}`}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    View Details →
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  // Desktop Layout (>=768px)
  return (
    <div className="relative px-4 sm:px-6 md:px-12 py-12 space-y-10">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Slider */}
        <div className="relative w-full group">
          <button className="prev-arrow absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 backdrop-blur-md text-white w-9 h-9 flex items-center justify-center rounded-full transition opacity-100 md:opacity-0 md:group-hover:opacity-100">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="next-arrow absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 backdrop-blur-md text-white w-9 h-9 flex items-center justify-center rounded-full transition opacity-100 md:opacity-0 md:group-hover:opacity-100">
            <ChevronRight className="w-5 h-5" />
          </button>

          <Swiper
            modules={[Navigation]}
            navigation={{ nextEl: '.next-arrow', prevEl: '.prev-arrow' }}
            spaceBetween={12}
            slidesPerView={1}
            className="rounded-2xl overflow-hidden"
          >
            {(service.gallery?.length ?? 0) > 0
              ? service.gallery.map((img, i) => (
                  <SwiperSlide key={i}>
                    <div className="relative w-full h-[250px] sm:h-[300px] md:h-[420px] flex items-center justify-center bg-black/10 rounded-xl overflow-hidden">
                      <Image
                        src={getServiceImage(img)}
                        alt={service.image_alt || service.title}
                        fill
                        style={{ objectFit: 'contain' }}
                        className="transition-transform duration-500"
                        priority={i === 0}
                      />
                    </div>
                  </SwiperSlide>
                ))
              : (
                  <SwiperSlide>
                    <div className="relative w-full h-[250px] sm:h-[300px] md:h-[420px] flex items-center justify-center bg-black/10 rounded-xl overflow-hidden">
                      <Image
                        src={getServiceImage(service)}
                        alt={service.image_alt || service.title}
                        fill
                        style={{ objectFit: 'contain' }}
                        className="transition-transform duration-500"
                        priority
                      />
                    </div>
                  </SwiperSlide>
                )}
          </Swiper>
        </div>

        {/* Details */}
        <div className="flex flex-col justify-start space-y-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold break-words">{service.title}</h1>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">{service.description}</p>

          <button
            onClick={handleGetQuote}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all rounded-full font-bold shadow-lg hover:shadow-[0_0_40px_cyan,0_0_60px_blue]"
          >
            Get Quotation <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Other Services */}
      <section className="mt-16">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">Other Services</h2>
        {isLoading ? (
          <p>Loading other services...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allServices.filter((s) => s.slug !== service.slug).map((s, i) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-white/5 hover:bg-white/10 p-5 rounded-2xl shadow-md border border-white/10 hover:border-blue-600 transition-all duration-300"
              >
                <div className="relative w-full h-40 md:h-48 overflow-hidden rounded-xl mb-4">
                  <Image
                    src={getServiceImage(s)}
                    alt={s.title}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-3">{s.description}</p>
                <a
                  href={`/services/${s.slug}`}
                  title={`View details for ${s.title}`}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  View Details →
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
