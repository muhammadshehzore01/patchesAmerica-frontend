// src/app/HomePageClient.jsx
"use client";

import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { useHomeData } from "@/hooks/useApiHooks";
import HeroSlider from "@/components/HeroSlider";
import ServicesShowcase from "@/components/home/ServicesShowcase";
import StepsSection from "@/components/home/StepsSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import CTAStrip from "@/components/home/CTAStrip";
import BlogList from "@/components/BlogList";
import FuturisticGallery from "./services/ServicesGalleryGrid";

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center text-[var(--color-text-primary)] text-xl">
      Loading premium USA-made custom patches experience...
    </div>
  );
}

function ServicesSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="glass rounded-3xl shadow-lg overflow-hidden h-[420px] animate-pulse bg-gray-200/50"
        />
      ))}
    </div>
  );
}

function BlogsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-96 bg-gray-200/50 animate-pulse rounded-2xl" />
      ))}
    </div>
  );
}

function GallerySkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="aspect-square bg-gray-200/50 animate-pulse rounded-xl" />
      ))}
    </div>
  );
}

export default function HomePageClient() {
  const { sliders, services = [], blogs = [], isError, mutate } = useHomeData();
  const [showAllServices, setShowAllServices] = useState(false);
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [showAllGallery, setShowAllGallery] = useState(false);

  const initialServices = 6;
  const initialBlogs = 6;
  const initialGallery = 12;

  const publishedBlogs = blogs.filter((blog) => blog.published);

  if (isError) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center text-red-400 text-xl">
        Something went wrong. Please refresh the page.
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <main className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-x-hidden">
        <HeroSlider slides={sliders} />

        <Suspense fallback={<ServicesSkeleton />}>
          <ServicesShowcase services={services} />
          {services.length > initialServices && (
            <div className="text-center py-12 min-h-[80px] flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAllServices(!showAllServices)}
                className="btn-primary px-10 py-4 text-lg font-medium rounded-full shadow-lg transition-all"
              >
                {showAllServices ? "View Less Services" : "View More Services"}
              </motion.button>
            </div>
          )}
        </Suspense>

        <StepsSection />
        <WhyChooseUsSection />

        <div className="bg-gradient-to-b from-[hsl(42,8%,97%)] via-[hsl(42,8%,95%)] to-[hsl(42,8%,93%)] text-[hsl(210,12%,10%)]">
          <Suspense fallback={<BlogsSkeleton />}>
            {publishedBlogs.length > 0 ? (
              <>
                <BlogList posts={publishedBlogs} />
                {publishedBlogs.length > initialBlogs && (
                  <div className="text-center py-12 min-h-[80px] flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAllBlogs(!showAllBlogs)}
                      className="btn-primary px-10 py-4 text-lg font-medium rounded-full shadow-lg transition-all bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)]"
                    >
                      {showAllBlogs ? "View Less Blogs" : "View More Blogs"}
                    </motion.button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-32 text-blue-100/60">
                <p className="text-2xl font-semibold">No published blogs yet.</p>
                <p className="mt-4 text-base">
                  Check back soon for updates on custom patches USA, embroidered patches no minimum, and more.
                </p>
              </div>
            )}
          </Suspense>
        </div>

        <Suspense fallback={<GallerySkeleton />}>
          <FuturisticGallery services={services} />
          {services.length > initialGallery && (
            <div className="text-center py-12 min-h-[80px] flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAllGallery(!showAllGallery)}
                className="btn-primary px-10 py-4 text-lg font-medium rounded-full shadow-lg transition-all"
              >
                {showAllGallery ? "View Less Gallery" : "View More Gallery"}
              </motion.button>
            </div>
          )}
        </Suspense>

        <CTAStrip />
      </main>
    </Suspense>
  );
}