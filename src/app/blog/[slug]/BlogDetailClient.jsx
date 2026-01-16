"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getMediaUrl } from "@/lib/media";

export default function BlogDetailClient({ blog }) {
  const imageUrl = getMediaUrl(blog.cover_image_url || blog.cover_image || blog.image_url);

  return (
    <main className="relative max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-16 md:py-20">
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
        className="relative flex flex-col gap-12 card p-6 sm:p-10 shadow-2xl rounded-3xl overflow-hidden border border-default"
      >
        {/* Light shimmer overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 w-[60%] h-[50%] -translate-x-1/2 bg-gradient-to-br from-[hsl(210,90%,55%)/10] via-white/5 to-transparent blur-3xl rounded-full"></div>
        </div>

        {/* Title */}
        <motion.h1
          variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-heading leading-tight gradient-heading"
        >
          {blog.title}
        </motion.h1>

        {/* Published Date */}
        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className="text-sm md:text-base text-muted tracking-wide"
        >
          {new Date(blog.published_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </motion.p>

        {/* Featured Image */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          whileHover={{ scale: 1.02 }}
          className="relative w-full h-64 sm:h-80 md:h-[480px] rounded-3xl overflow-hidden shadow-lg"
        >
          <Image
            src={imageUrl}
            alt={blog.title}
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
            className="object-contain transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(42,8%,97%)/40] via-[hsl(42,8%,97%)/10] to-transparent pointer-events-none"></div>
          <div className="absolute -top-10 left-1/2 w-[120%] h-[120%] -translate-x-1/2 rounded-full bg-gradient-to-r from-[hsl(210,90%,55%)/10] via-white/5 to-transparent blur-3xl pointer-events-none animate-pulse-slow"></div>
        </motion.div>

        {/* Blog Content */}
        <motion.article
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="prose max-w-none text-card-fg prose-headings:text-heading prose-img:rounded-2xl prose-a:text-primary hover:prose-a:text-secondary"
        >
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </motion.article>

        {/* Bottom gradient line */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[hsl(210,90%,55%)/50] to-transparent"
        />
      </motion.div>
    </main>
  );
}
