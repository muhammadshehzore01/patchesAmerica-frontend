"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getMediaUrl } from "@/lib/media";

export default function BlogDetailClient({ blog }) {
  const imageUrl = getMediaUrl(blog.cover_image_url || blog.cover_image);
 
  return (
    <main className="relative max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-16 md:py-20">
      {/* Motion container with staggered children */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.15, ease: "easeOut" },
          },
        }}
        className="relative flex flex-col gap-12 bg-white/10 backdrop-blur-3xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/20 overflow-hidden"
      >
        {/* Light shimmer overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 w-[60%] h-[50%] -translate-x-1/2 bg-gradient-to-br from-brand-500/10 via-white/5 to-transparent blur-3xl rounded-full"></div>
        </div>

        {/* Title */}
        <motion.h1
          variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg leading-tight"
        >
          {blog.title}
        </motion.h1>

        {/* Published Date */}
        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className="text-sm md:text-base text-gray-300 tracking-wide"
        >
          {new Date(blog.published_at).toLocaleDateString("en-AU", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </motion.p>

        {/* Featured Image with hover zoom & parallax */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          whileHover={{ scale: 1.02 }}
          className="relative w-full h-64 sm:h-80 md:h-[480px] rounded-3xl overflow-hidden shadow-2xl"
        >
          <Image
            src={imageUrl}
            alt={blog.title}
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none"></div>
          {/* Animated glow ring */}
          <div className="absolute -top-10 left-1/2 w-[120%] h-[120%] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-400/10 via-white/5 to-transparent blur-3xl pointer-events-none animate-pulse-slow"></div>
        </motion.div>

        {/* Blog Content */}
        <motion.article
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="prose prose-invert max-w-none text-gray-100 prose-img:rounded-2xl prose-headings:text-white prose-a:text-brand-400 hover:prose-a:text-brand-300"
        >
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </motion.article>

        {/* Subtle bottom glow line */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent"
        ></motion.div>
      </motion.div>
    </main>
  );
}
