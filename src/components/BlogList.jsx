// project/frontend/src/components/BlogList.jsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getBlogImage } from "@/lib/media";

export default function BlogList({ posts = [] }) {
  if (!posts.length) {
    return (
      <section className="py-24 md:py-32 text-center bg-gradient-to-b from-[hsl(42,8%,97%)] via-[hsl(42,8%,95%)] to-[hsl(42,8%,93%)]">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-extrabold text-[hsl(210,90%,55%)] drop-shadow-md"
        >
          Latest Blogs
        </motion.h2>
        <p className="mt-4 text-[hsl(210,12%,20%)] text-base md:text-lg">
          No posts available right now. Fresh insights coming soon.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 text-[hsl(210,12%,20%)] relative">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-extrabold mb-12 text-center text-[hsla(0, 0%, 99%, 1.00)] drop-shadow-sm"
      >
        Latest Insights
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, idx) => (
          <motion.article
            key={post.id || idx}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15, duration: 0.7 }}
            whileHover={{
              scale: 1.03,
              y: -6,
              boxShadow: "0 25px 60px rgba(0,140,255,0.2)",
            }}
            className="relative rounded-3xl overflow-hidden backdrop-blur-xl glass border border-white/10 shadow-[0_12px_40px_rgba(0,140,255,0.05)] transition-all duration-500"
          >
            {/* Image */}
            <div className="relative h-56 sm:h-60 md:h-64 w-full overflow-hidden rounded-t-3xl">
              <Image
                src={getBlogImage(post)}
                alt={post.title}
                fill
                style={{ objectFit: "contain" }}
                className="transition-transform duration-500 hover:scale-105"
                placeholder="blur"
                blurDataURL="/placeholder-blog.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-white/10 to-transparent rounded-t-3xl pointer-events-none" />
              {/* Radial glow */}
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400/20 via-purple-400/10 to-pink-400/5 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-tr from-pink-400/15 via-purple-400/10 to-cyan-400/5 blur-3xl pointer-events-none" />
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col justify-between h-full relative z-10">
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-[hsl(210,12%,10%)] drop-shadow-sm">
                {post.title}
              </h3>
              <p className="text-[hsl(210,12%,20%)] text-sm md:text-base line-clamp-3 mb-4 drop-shadow-sm">
                {post.excerpt || post.description}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center justify-center mt-auto px-6 py-2 rounded-full text-sm md:text-base font-semibold
                           bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-black shadow-xl hover:scale-105 transition-transform"
              >
                Read More →
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
