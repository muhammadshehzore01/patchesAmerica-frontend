"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getBlogImage } from "@/lib/media";

export default function BlogList({ posts = [] }) {
  if (!posts.length) {
    return (
      <section className="py-24 text-center text-white bg-gradient-to-b from-black/10 via-black/20 to-black/10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400"
        >
          Latest Blogs
        </motion.h2>
        <p className="mt-4 text-gray-300">No posts available right now. New insights coming soon.</p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 text-white">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-extrabold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400"
      >
        Latest Insights
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.map((post, idx) => (
          <motion.div
            key={post.id || idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.7 }}
            whileHover={{ scale: 1.03 }}
            className="relative bg-black/30 rounded-3xl overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(255,0,255,0.3)] transition-shadow duration-500"
          >
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src={getBlogImage(post)}
                alt={post.title}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-t-3xl"
                placeholder="blur"
                blurDataURL="/placeholder-blog.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-t-3xl" />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-300 text-sm line-clamp-3">{post.excerpt || post.description}</p>
              <a
                href={`/blog/${post.slug}`}
                className="inline-block mt-4 px-5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 shadow-[0_0_15px_rgba(255,0,255,0.3)] hover:shadow-[0_0_30px_rgba(255,0,255,0.5)] transition-all"
              >
                Read More
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
