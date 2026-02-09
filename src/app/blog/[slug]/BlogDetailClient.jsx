"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getMediaUrl } from "@/lib/media";

/* ===============================
   SHARED MOTION VARIANTS
================================ */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ===============================
   BLOG DETAIL CLIENT
================================ */
export default function BlogDetailClient({ blog }) {
  const imageUrl = getMediaUrl(blog.cover_image_url || blog.cover_image || blog.image_url);

  return (
    <main className="relative max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-16 md:py-20 text-white">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-12"
      >
        {/* Title */}
        <motion.h1
          variants={fadeUpVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400"
        >
          {blog.title}
        </motion.h1>

        {/* Published Date */}
        <motion.p
          variants={fadeUpVariants}
          className="text-sm md:text-base text-blue-100/70 tracking-wide"
        >
          {new Date(blog.published_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </motion.p>

        {/* Featured Image */}
        <motion.div
          variants={fadeUpVariants}
          whileHover={{ scale: 1.02 }}
          className="relative w-full h-64 sm:h-80 md:h-[480px] rounded-3xl overflow-hidden shadow-lg"
        >
          <Image
            src={imageUrl}
            alt={blog.title}
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
            className="object-contain transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(42,8%,97%)/40] via-[hsl(42,8%,97%)/10] to-transparent pointer-events-none"></div>
        </motion.div>

        {/* Blog Content */}
        <motion.article
          variants={fadeUpVariants}
          className="prose max-w-none text-blue-100/80 prose-headings:text-white prose-img:rounded-2xl prose-a:text-blue-400 hover:prose-a:text-white"
        >
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </motion.article>
      </motion.div>
    </main>
  );
}
