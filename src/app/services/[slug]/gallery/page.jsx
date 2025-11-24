"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useService } from "@/hooks/useApiHooks";
import { getGalleryImage } from "@/lib/media";

export default function ServiceGalleryPage() {
  const { slug } = useParams();
  const { service, isLoading, isError } = useService(slug);

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin h-8 w-8 text-red-500" />
      </div>
    );

  if (isError || !service)
    return (
      <div className="text-center text-gray-400 py-20">
        Service not found.
      </div>
    );

  const images = service.gallery || [];

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-black to-brand-900 text-white relative overflow-hidden py-24"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Background Animation */}
      <motion.div
        className="absolute -top-40 -left-20 w-96 h-96 bg-red-700/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-40 -right-20 w-[32rem] h-[32rem] bg-orange-600/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-4xl md:text-6xl font-bold mb-16 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent"
        >
          {service.title} Gallery
        </motion.h1>

        {/* Masonry Layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance] w-full">
          {images.map((img, i) => {
            const imgSrc = getGalleryImage(img);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="mb-5 relative rounded-2xl overflow-hidden group break-inside-avoid-column shadow-[0_0_25px_rgba(239,68,68,0.2)]"
              >
                <div className="relative w-full">
                  <Image
                    src={imgSrc}
                    alt={`${service.title} image ${i + 1}`}
                    width={800}
                    height={600}
                    className="w-full object-contain rounded-2xl transition-transform duration-700 group-hover:scale-105 select-none"
                  />
                </div>

                {/* Glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Caption */}
                <div className="absolute bottom-3 left-3 right-3 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Image {i + 1}
                </div>
              </motion.div>
            );
          })}
        </div>

        {images.length === 0 && (
          <p className="text-center text-gray-400 mt-20">
            No images available for this service.
          </p>
        )}
      </div>
    </main>
  );
}
