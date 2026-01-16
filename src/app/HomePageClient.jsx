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
      Loading premium patches experience...
    </div>
  );
}

export default function HomePageClient() {
  const { 
    sliders, 
    services = [], 
    hero, 
    blogs = [], 
    galleryImages = [], 
    isLoading, 
    isError 
  } = useHomeData();

  const [showAllServices, setShowAllServices] = useState(false);
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [showAllGallery, setShowAllGallery] = useState(false);

  const initialServices = 6;
  const initialBlogs = 6;
  const initialGallery = 12;

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
        {/* Hero Slider */}
        <HeroSlider slides={sliders} />

        {/* Services */}
        <ServicesShowcase 
          services={services}
          initialCount={initialServices}
          showAll={showAllServices}
        />
        {services.length > initialServices && (
          <div className="text-center py-12">
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

        {/* Steps */}
        <StepsSection steps={hero?.steps || []} />

        {/* Why Choose Us */}
        <WhyChooseUsSection />

        {/* Blogs Section – Light Background */}
        <div className="bg-gradient-to-b from-[var(--color-bg-light)] via-white to-gray-50 text-[hsl(210,12%,10%)]">
          <BlogList 
            posts={blogs}
            initialCount={initialBlogs}
            showAll={showAllBlogs}
          />
          {blogs.length > initialBlogs && (
            <div className="text-center py-12">
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
        </div>

        {/* Gallery */}
        <FuturisticGallery 
          services={services}
          initialCount={initialGallery}
          showAll={showAllGallery}
        />
        {galleryImages.length > initialGallery && (
          <div className="text-center py-12">
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

        {/* CTA */}
        <CTAStrip />
      </main>
    </Suspense>
  );
}