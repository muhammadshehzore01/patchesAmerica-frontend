// frontend/src/app/blog/page.jsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import LuxuryOverlay from "@/components/LuxuryOverlay";
import GlowFade from "@/components/GlowFade";
import { useBlogs } from "@/hooks/useApiHooks";

export default function BlogPage() {
  const { blogs, isLoading, isError } = useBlogs();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  if (isLoading) {
    return (
      <section className="py-24 text-center text-white text-lg">
        Loading blogs...
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-24 text-center text-red-400 text-lg">
        Failed to load blogs. Please try again later.
      </section>
    );
  }

  if (!blogs.length) {
    return (
      <section className="py-24 text-center text-gray-300 text-lg">
        No blog posts found. Please check back later.
      </section>
    );
  }

  return (
    <main className="relative max-w-7xl mx-auto px-6 py-16 text-white">
      {/* Background overlays */}
      <LuxuryOverlay layers={[{ from: "from-white/5", via: "via-transparent", to: "to-transparent" }]} />
      <GlowFade
        layers={[{ from: "from-[#0033FF]/30", via: "via-[#0600AB]/15", to: "to-transparent", height: "h-48" }]}
      />

      {/* Page title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold mb-12 text-center"
      >
        Our Blog
      </motion.h1>

      {/* Blog grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10"
      >
        {blogs.map((post, idx) => (
          <motion.article
            key={post.id ?? idx}
            variants={cardVariants}
            className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-md hover:shadow-2xl transition overflow-hidden group"
          >
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src={post.cover_image_url || post.image_url || "/placeholder-blog.jpg"}
                alt={post.title}
                fill
                sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                className="object-contain group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
            </div>

            <div className="p-6">
              <h2 className="text-xl font-bold mb-2 line-clamp-2 text-white">{post.title}</h2>
              <p className="text-white/80 line-clamp-3 mb-4">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="text-brand-300 font-semibold hover:underline"
              >
                Read More →
              </Link>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </main>
  );
}
