// src/components/BlogList.jsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getBlogImage } from "@/lib/media";
import { useEffect, useState } from "react";

export default function BlogList({ posts = [], initialCount = 6, showAll = false }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  const displayedPosts = showAll ? posts : posts.slice(0, initialCount);

  if (posts.length === 0) {
    return (
      <section
        className="py-24 md:py-32 text-center bg-gradient-to-b from-[hsl(42,8%,97%)] via-[hsl(42,8%,95%)] to-[hsl(42,8%,93%)]"
        aria-labelledby="blog-heading-empty"
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          id="blog-heading-empty"
          className="text-4xl md:text-5xl font-extrabold text-[hsl(210,90%,55%)] drop-shadow-md"
        >
          Latest Blogs on Custom Patches USA
        </motion.h2>
        <p className="mt-4 text-[hsl(210,12%,20%)] text-base md:text-lg">
          No posts available right now. Fresh insights on custom embroidered patches USA, custom PVC patches no minimum coming soon.
        </p>
      </section>
    );
  }

  // Skeleton for loading state
  if (posts.length > 0 && displayedPosts.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32" aria-hidden="true">
        <div className="text-4xl md:text-5xl text-center font-extrabold bg-gray-300 animate-pulse h-14 w-64 mx-auto mb-12 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: initialCount }).map((_, idx) => (
            <div
              key={idx}
              className="relative rounded-3xl overflow-hidden backdrop-blur-xl glass border border-white/10 shadow-[0_12px_40px_rgba(0,140,255,0.05)] h-[480px] animate-pulse bg-gray-200/50"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      className="max-w-7xl mx-auto px-6 py-24 md:py-32 text-[hsl(210,12%,20%)] relative"
      aria-labelledby="blog-heading"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        id="blog-heading"
        className="text-4xl md:text-5xl text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 mb-12 drop-shadow-sm"
      >
        Latest Insights on Custom Patches USA
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedPosts.map((post, idx) => (
          <motion.article
            key={post.id || idx}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15, duration: 0.7 }}
            whileHover={
              prefersReducedMotion
                ? {}
                : { scale: 1.03, y: -6, boxShadow: "0 25px 60px rgba(0,140,255,0.2)" }
            }
            className="relative rounded-3xl overflow-hidden backdrop-blur-xl glass border border-white/10 shadow-[0_12px_40px_rgba(0,140,255,0.05)] transition-all duration-500"
          >
            <div className="relative h-56 sm:h-60 md:h-64 w-full overflow-hidden rounded-t-3xl">
              <Image
                src={getBlogImage(post)}
                alt={`${post.title} – Custom embroidered patches USA, no minimum order insights`}
                fill
                className="object-contain transition-transform duration-500 hover:scale-105"
                placeholder="blur"
                blurDataURL="/placeholder-blog.jpg"
                loading={idx < 3 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={idx < 3 ? "high" : "low"}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-white/10 to-transparent rounded-t-3xl pointer-events-none" />
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400/20 via-purple-400/10 to-pink-400/5 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-tr from-pink-400/15 via-purple-400/10 to-cyan-400/5 blur-3xl pointer-events-none" />
            </div>
            <div className="p-6 flex flex-col justify-between h-full relative z-10">
              <h3 className="text-xl md:text-2xl font-semibold mb-3 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
                {post.title}
              </h3>
              <p className="text-[hsl(210,12%,20%)] text-sm md:text-base line-clamp-3 mb-4 drop-shadow-sm">
                {post.excerpt || post.description}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center justify-center mt-auto px-6 py-2 rounded-full text-sm md:text-base font-semibold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-black shadow-xl hover:scale-105 transition-transform focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)]"
              >
                Read More →
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
      {/* Reserve space for Load More – prevents CLS */}
      <div className="min-h-[80px] mt-12" />
    </section>
  );
}