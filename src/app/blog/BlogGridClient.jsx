"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getMediaUrl } from "@/lib/media";

// Motion variants
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function BlogGridClient({ blogs }) {
  return (
    <main className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-white">
      {/* Page Heading */}
      <div className="text-center mb-16">
        <p className="text-sm uppercase tracking-widest text-blue-300 font-semibold">
          Insights & Updates
        </p>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
          Northern Patches Blog
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-blue-100/80">
          News, guides, and behind-the-scenes insights from our premium patch manufacturing journey.
        </p>
      </div>

      {/* Blog Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        {blogs.map((post) => {
          const image = post.cover_image_url || post.cover_image || post.image_url || "/placeholder-blog.jpg";

          return (
            <motion.article
              key={post.id}
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -4, boxShadow: "0 20px 60px rgba(0,140,255,0.2)" }}
              className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={getMediaUrl(image)}
                  alt={post.title}
                  fill
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                  className="object-contain transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold mb-3 line-clamp-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
                  {post.title}
                </h2>
                <p className="text-blue-100/70 line-clamp-3 mb-5">{post.excerpt || ""}</p>
                <Link
                  href={`/blog/${post.slug}/`}
                  className="inline-flex items-center gap-2 font-semibold text-blue-400 hover:text-white transition"
                >
                  Read More →
                </Link>
              </div>
            </motion.article>
          );
        })}
      </motion.div>
    </main>
  );
}
