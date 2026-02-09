// project/frontend/src/app/services/gallery/ServiceGalleryClient.jsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react"; // ← FIXED: added useMemo
import Image from "next/image";
import { X } from "lucide-react";
import { getGalleryImage } from "@/lib/media";

export default function ServiceGalleryClient({ items = [] }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Memoize flattened images – prevents re-computation on every render
  const allImages = useMemo(() => {
    return items.map((img, index) => ({
      ...img,
      index,
      src: img.image || img.src || "/placeholder-service.jpg",
      alt:
        img.alt ||
        `${img.serviceTitle || "Custom Patch"} – Premium USA-made custom patch example by Northern Patches`,
    }));
  }, [items]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (e) => {
      if (!selectedImage) return;

      if (e.key === "Escape") {
        setSelectedImage(null);
      } else if (e.key === "ArrowRight" && selectedIndex < allImages.length - 1) {
        const next = selectedIndex + 1;
        setSelectedIndex(next);
        setSelectedImage(allImages[next]);
      } else if (e.key === "ArrowLeft" && selectedIndex > 0) {
        const prev = selectedIndex - 1;
        setSelectedIndex(prev);
        setSelectedImage(allImages[prev]);
      }
    },
    [selectedImage, selectedIndex, allImages]
  );

  useEffect(() => {
    if (selectedImage) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedImage, handleKeyDown]);

  if (!allImages.length) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0600AB] to-[#0033FF] text-white/70 text-xl font-medium">
        No gallery images available at the moment. Check back soon!
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#0600AB] to-[#0033FF] text-white relative overflow-hidden">
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-extrabold mb-12 md:mb-16 tracking-tight">
          <span className="bg-gradient-to-r from-blue-300 via-white to-blue-200 bg-clip-text text-transparent">
            Custom Patches Gallery – Premium USA-Made Designs
          </span>
        </h1>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
          {allImages.map((img) => (
            <button
              key={img.id || img.src}
              onClick={() => {
                setSelectedImage(img);
                setSelectedIndex(img.index);
              }}
              className="block w-full group rounded-2xl overflow-hidden shadow-xl shadow-black/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black"
              aria-label={`View ${img.serviceTitle} gallery image`}
            >
              <div className="relative aspect-[4/3] bg-black/30">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={75}
                  loading="lazy"
                  decoding="async"
                  placeholder="blur"
                  blurDataURL="/placeholder-service-lowres.jpg"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-sm font-medium text-white/90 line-clamp-2">
                    {img.serviceTitle}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-6xl w-full max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl shadow-blue-950/50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-blue-300 transition-colors z-10 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              aria-label="Close gallery image preview"
            >
              <X size={40} strokeWidth={2.5} />
            </button>

            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              fill
              priority
              quality={85}
              className="object-contain"
              decoding="async"
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => {
                    const prev = (selectedIndex - 1 + allImages.length) % allImages.length;
                    setSelectedIndex(prev);
                    setSelectedImage(allImages[prev]);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Previous image"
                >
                  ←
                </button>
                <button
                  onClick={() => {
                    const next = (selectedIndex + 1) % allImages.length;
                    setSelectedIndex(next);
                    setSelectedImage(allImages[next]);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Next image"
                >
                  →
                </button>
              </>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 pt-12">
              <p id="lightbox-title" className="text-lg md:text-xl font-medium text-white">
                {selectedImage.serviceTitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}