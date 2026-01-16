"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { getGalleryImage } from "@/lib/media";

export default function ServiceGalleryClient({ services }) {
  const [selectedImage, setSelectedImage] = useState(null);

  // Flatten all images from all services
  const allImages = services.flatMap(service =>
    Array.isArray(service.gallery)
      ? service.gallery.map(img => ({ src: getGalleryImage(img), title: service.title }))
      : []
  );

  if (!allImages.length) {
    return (
      <div className="text-center text-white/50 py-24">
        No images found for any service.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#0600AB] to-[#0033FF] text-white relative overflow-hidden py-24 font-sans safe-mobile">
      <div className="aurora-effect" />
      <div className="grain" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <h1 className="text-center text-4xl md:text-6xl font-extrabold mb-16 gradient-heading hero-soft-shadow">
          All Services Gallery
        </h1>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 w-full">
          {allImages.map((img, i) => (
            <div
              key={i}
              className="mb-6 relative rounded-2xl overflow-hidden group cursor-pointer"
              onClick={() => setSelectedImage(img)}
            >
              <Image
                src={img.src}
                alt={`${img.title} image`}
                width={800}
                height={600}
                className="w-full object-contain rounded-2xl transition-transform duration-700 group-hover:scale-105 select-none"
                priority={i < 4}
              />
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={() => setSelectedImage(null)}
          >
            <X size={30} />
          </button>
          <div className="max-w-5xl max-h-[90vh] w-full relative rounded-2xl p-2">
            <Image
              src={selectedImage.src}
              alt={selectedImage.title}
              width={1200}
              height={900}
              className="w-full h-auto rounded-2xl object-contain"
            />
            <p className="mt-2 text-center text-white/70">{selectedImage.title}</p>
          </div>
        </div>
      )}
    </main>
  );
}
