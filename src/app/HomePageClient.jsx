"use client";

import { useHomeData } from "@/hooks/useApiHooks";
import HeroSlider from "@/components/HeroSlider";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/effect-fade";
import { FiArrowRight } from "react-icons/fi";
import Particles from "react-tsparticles";
import Lenis from "@studio-freight/lenis";
import { useEffect, useRef, useState, useMemo } from "react";
import CountUp from "react-countup";
import { useGlobalModal } from "@/components/GlobalModalProvider";
import PatchRequestWizard from "@/components/PatchRequestWizard";

// Helper utilities
function chunkArray(arr = [], size = 3) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export default function HomePageClient() {
  const { sliders, features, services, blogs, isLoading } = useHomeData();
  const { openModal, closeModal } = useGlobalModal();

  useEffect(() => {
    const lenis = new Lenis({ smooth: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis && typeof lenis.destroy === "function" && lenis.destroy();
  }, []);

  const [hoveredService, setHoveredService] = useState(null);
  const servicesContainerRef = useRef(null);

  const serviceRows = useMemo(() => chunkArray(services || [], 3), [services]);
  const [visibleServiceRowsCount, setVisibleServiceRowsCount] = useState(1);
  const rowsPerLoadServices = 1;
  const visibleServiceRows = serviceRows.slice(0, visibleServiceRowsCount);

  const allGalleryItems = useMemo(() => {
    const items = [];
    (services || []).forEach((s) => {
      if (s.gallery && s.gallery.length > 0) {
        s.gallery.forEach((g) => {
          items.push({
            id: `${s.id}-${g.id}`,
            image_url: g.image_url || "/placeholder.png",
            serviceTitle: s.title,
          });
        });
      }
    });
    return items;
  }, [services]);

  const [galleryRowsCount, setGalleryRowsCount] = useState(1);
  const rowsPerLoadGallery = 2;
  const galleryRows = useMemo(() => chunkArray(allGalleryItems, 3), [allGalleryItems]);
  const visibleGalleryRows = galleryRows.slice(0, galleryRowsCount);
  const handleLoadMoreGallery = () => {
    setGalleryRowsCount((prev) => clamp(prev + rowsPerLoadGallery, 0, galleryRows.length));
  };

  const [visibleBlogsCount, setVisibleBlogsCount] = useState(3);
  const handleLoadMoreBlogs = () => {
    setVisibleBlogsCount((prev) => Math.min(prev + 3, blogs.length));
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <main className="relative bg-background text-foreground overflow-x-hidden">

      {/* --------------------------- HERO SLIDER --------------------------- */}
      {sliders && sliders.length > 0 ? (
        <HeroSlider slides={sliders} />
      ) : (
        <div className="h-screen flex items-center justify-center text-white text-2xl">
          No slides available.
        </div>
      )}

      {/* --------------------------- FEATURES / STATS --------------------------- */}
      {features && features.length > 0 && (
        <section className="relative z-10 py-20 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={feat.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12 }}
              className="bg-white/6 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-md"
            >
              <h3 className="text-xl md:text-2xl font-bold mb-2">{feat.title}</h3>
              <p className="text-gray-300 mb-4">{feat.description}</p>
              <div className="text-4xl md:text-5xl font-extrabold text-cyan-400">
                <CountUp start={0} end={feat.metric} duration={2} decimals={feat.decimals || 0} />
                <span className="text-lg text-gray-200 ml-2">{feat.unit || ""}</span>
              </div>
            </motion.div>
          ))}
        </section>
      )}

      {/* --------------------------- SERVICES --------------------------- */}
      {services && services.length > 0 && (
        <section className="relative z-10 py-24 px-6 bg-black/5 overflow-visible">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-gradient-x">
            Our Connected Services
          </h2>

          <Particles
            className="absolute inset-0 -z-10"
            options={{
              background: { color: { value: "transparent" } },
              particles: {
                number: { value: 40 },
                color: { value: ["#00f6ff", "#ff00f6"] },
                links: { enable: true, distance: 220, color: "#00f6ff", opacity: 0.12, width: 1 },
                move: { enable: true, speed: 0.25 },
                size: { value: 3 },
              },
            }}
          />

          <div ref={servicesContainerRef} className="max-w-7xl mx-auto space-y-8">
            {visibleServiceRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-wrap justify-center gap-8">
                {row.map((s, i) => (
                  <motion.article
                    key={s.id}
                    onMouseEnter={() => setHoveredService(s.id)}
                    onMouseLeave={() => setHoveredService(null)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: rowIndex * 0.08 + i * 0.06 }}
                    className="w-full max-w-[360px] min-w-[260px] group relative rounded-3xl p-5 bg-white/4 backdrop-blur-md border border-white/8 shadow-xl flex flex-col hover:shadow-[0_0_25px_cyan]"
                  >
                    <div className="w-full h-44 rounded-xl overflow-hidden mb-4 relative shadow-[0_8px_30px_rgba(0,255,255,0.06)]">
                      <Image
                        src={s.image_url || "/placeholder.png"}
                        alt={s.title}
                        fill
                        loading="lazy"
                        className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105 rounded-xl"
                      />
                    </div>

                    <h3 className="text-lg md:text-2xl font-bold mb-2">{s.title}</h3>
                    <p className="text-gray-300 line-clamp-3 mb-4">{s.description}</p>

                    <div className="mt-auto flex items-center gap-3">
                      <a
                        href={`/services/${s.slug}`}
                        className="flex-1 px-4 py-2 text-center rounded-xl font-semibold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-black shadow-md hover:scale-[1.02] transition-transform"
                      >
                        View Details
                      </a>

                      <button
                        onClick={() =>
                          openModal(
                            <PatchRequestWizard
                              initialService={{
                                title: s.title,
                                description: s.description,
                                image: s.image_url || "/placeholder.png",
                              }}
                              onClose={closeModal}
                            />
                          )
                        }
                        className="px-4 py-2 rounded-xl border border-white/10 text-white hover:bg-white/6 transition-colors"
                      >
                        Get Quote
                      </button>
                    </div>

                    <AnimatePresence>
                      {hoveredService === s.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 rounded-3xl pointer-events-none"
                          style={{
                            boxShadow: "0 0 40px rgba(0,255,255,0.18), 0 0 80px rgba(255,0,255,0.08)",
                            border: "1px solid rgba(0,255,255,0.06)",
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.article>
                ))}
              </div>
            ))}

            {visibleServiceRowsCount < serviceRows.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() =>
                    setVisibleServiceRowsCount((prev) =>
                      Math.min(prev + rowsPerLoadServices, serviceRows.length)
                    )
                  }
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-black font-bold shadow-lg hover:scale-105 transition-transform"
                >
                  Load More Services
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* --------------------------- GALLERY --------------------------- */}
      {allGalleryItems.length > 0 && (
        <section className="relative z-10 py-24 px-6 bg-black/10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 animate-gradient-x">
            Our Work Gallery
          </h2>

          <div className="max-w-6xl mx-auto space-y-6">
            {visibleGalleryRows.map((row, rIdx) => (
              <div key={rIdx} className="flex justify-center gap-6 flex-wrap">
                {row.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="relative w-[320px] h-[220px] rounded-xl overflow-hidden shadow-lg bg-black/20"
                  >
                    <Image
                      src={item.image_url || "/placeholder.png"}
                      alt={item.serviceTitle}
                      fill
                      loading="lazy"
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                      <span className="text-white font-semibold text-sm">{item.serviceTitle}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}

            {galleryRowsCount < galleryRows.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMoreGallery}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-black font-bold shadow-lg hover:scale-105 transition-transform"
                >
                  Load More Gallery
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* --------------------------- BLOGS --------------------------- */}
      {blogs && blogs.length > 0 && (
        <section className="relative py-32 px-6 overflow-hidden">
          <h2 className="text-4xl md:text-6xl font-extrabold text-center mb-14 gradient-heading animate-pulse">
            Latest Insights
          </h2>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            {blogs.slice(0, visibleBlogsCount).map((b, i) => {
              const imgSrc = b?.cover_image_url ?? b?.image_url ?? "/placeholder.png";
              return (
                <motion.article
                  key={b.id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative rounded-2xl p-[2px] bg-gradient-to-br from-purple-500/40 via-pink-500/40 to-yellow-400/30
                             shadow-[0_0_25px_rgba(120,60,255,0.25)] hover:shadow-[0_0_45px_rgba(140,80,255,0.4)]
                             transition-all duration-300 tilt-card"
                >
                  <div className="bg-brand-950/40 backdrop-blur-xl rounded-2xl p-6 sheen relative overflow-hidden">
                    <div className="w-full h-48 relative rounded-xl overflow-hidden mb-5">
                      <Image
                        src={imgSrc}
                        alt={b.title}
                        fill
                        loading="lazy"
                        className="object-contain rounded-xl"
                      />
                    </div>
                    <h4 className="font-bold text-xl mb-2">{b.title}</h4>
                    <p className="text-gray-300 text-sm line-clamp-3">{b.excerpt}</p>
                    <a
                      href={`/blogs/${b.slug}`}
                      className="mt-4 inline-block font-bold text-cyan-400 hover:text-purple-400 transition-colors"
                    >
                      Read More →
                    </a>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {visibleBlogsCount < blogs.length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleLoadMoreBlogs}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-black font-bold shadow-lg hover:scale-105 transition-transform"
              >
                Load More Blogs
              </button>
            </div>
          )}
        </section>
      )}

      {/* --------------------------- CTA --------------------------- */}
      <section className="relative z-10 py-24 px-6 bg-gradient-to-r from-purple-800 via-pink-700 to-yellow-500 rounded-3xl mx-6 md:mx-20 mb-20 text-white text-center shadow-xl">
        <h3 className="text-4xl md:text-5xl font-extrabold mb-6">Ready to Upgrade Your Patches?</h3>
        <p className="text-lg md:text-xl mb-8">
          Contact us today and join the future of custom embroidered patches with seamless digital integration.
        </p>
        <a
          href="/contact"
          className="px-8 py-4 rounded-full bg-black/20 backdrop-blur-md font-bold hover:scale-105 transition-transform"
        >
          Get in Touch
        </a>
      </section>

    </main>
  );
}
