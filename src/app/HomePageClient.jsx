"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useHomeData } from "@/hooks/useApiHooks";

import HeroSlider from "@/components/HeroSlider";
import ServicesShowcase from "@/components/home/ServicesShowcase";
import StepsSection from "@/components/home/StepsSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import CTAStrip from "@/components/home/CTAStrip";
import BlogList from "@/components/BlogList";
import FuturisticGallery from "./services/ServicesGalleryGrid";


/* ================= Skeletons ================= */

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


/* ================= Component ================= */

export default function HomePageClient() {

  const {
    sliders = [],
    services = [],
    blogs = [],
    isLoading,
    isError,
    mutate,
  } = useHomeData();


  const [showAllServices, setShowAllServices] = useState(false);
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [fetchTimedOut, setFetchTimedOut] = useState(false);


  const initialServices = 6;
  const initialBlogs = 6;
  const initialGallery = 12;

  const publishedBlogs = useMemo(
    () => blogs?.filter(b => b?.published) ?? [],
    [blogs]
  );

  useEffect(() => {

    if (!isLoading) return;

    const timer = setTimeout(() => {

      if (
        sliders.length === 0 &&
        services.length === 0 &&
        publishedBlogs.length === 0
      ) {
        console.warn("Timeout triggered");
        setFetchTimedOut(true);
      }

    }, 15000);

    return () => clearTimeout(timer);

  }, [isLoading, sliders.length, services.length, publishedBlogs.length]);


  useEffect(() => {

    if (
      sliders.length > 0 ||
      services.length > 0 ||
      publishedBlogs.length > 0
    ) {
      setFetchTimedOut(false);
    }

  }, [sliders.length, services.length, publishedBlogs.length]);


  /* ✅ retry */
  const handleRetry = async () => {
    setFetchTimedOut(false);
    await mutate(undefined, { revalidate: true });
  };


  /* ================= ERROR ================= */

  if (isError) {
    return (
      <ErrorScreen
        message="Failed to load homepage content."
        onRetry={handleRetry}
      />
    );
  }


  /* ================= TIMEOUT ================= */

  if (fetchTimedOut) {
    return (
      <ErrorScreen
        message="Server took too long to respond."
        onRetry={handleRetry}
      />
    );
  }


  /* ================= MAIN UI ================= */

  return (

    <main className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-x-hidden">


      {/* HERO */}

      {isLoading && sliders.length === 0
        ? <ServicesSkeleton />
        : <HeroSlider slides={sliders} />
      }


      {/* SERVICES */}

      {isLoading && services.length === 0
        ? <ServicesSkeleton />
        : (
          <>
            <ServicesShowcase
              services={
                showAllServices
                  ? services
                  : services.slice(0, initialServices)
              }
            />

            {services.length > initialServices && (
              <ButtonMore
                showAll={showAllServices}
                setShowAll={setShowAllServices}
                more="View More Services"
                less="View Less Services"
              />
            )}
          </>
        )
      }


      <StepsSection />

      <WhyChooseUsSection />


      {/* BLOGS */}

      <div className="bg-gradient-to-b from-[hsl(42,8%,97%)] via-[hsl(42,8%,95%)] to-[hsl(42,8%,93%)] text-[hsl(210,12%,10%)]">

        {isLoading && publishedBlogs.length === 0
          ? <BlogsSkeleton />
          : (
            <>
              <BlogList
                posts={
                  showAllBlogs
                    ? publishedBlogs
                    : publishedBlogs.slice(0, initialBlogs)
                }
              />

              {publishedBlogs.length > initialBlogs && (
                <ButtonMore
                  showAll={showAllBlogs}
                  setShowAll={setShowAllBlogs}
                  more="View More Blogs"
                  less="View Less Blogs"
                />
              )}
            </>
          )
        }

      </div>


      {/* GALLERY */}

      {isLoading && services.length === 0
        ? <GallerySkeleton />
        : (
          <>
            <FuturisticGallery
              services={
                showAllGallery
                  ? services
                  : services.slice(0, initialGallery)
              }
            />

            {services.length > initialGallery && (
              <ButtonMore
                showAll={showAllGallery}
                setShowAll={setShowAllGallery}
                more="View More Gallery"
                less="View Less Gallery"
              />
            )}
          </>
        )
      }


      <CTAStrip />

    </main>

  );
}


/* ================= reusable components ================= */

function ButtonMore({ showAll, setShowAll, more, less }) {

  return (
    <div className="text-center py-12">

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setShowAll(!showAll)}
        className="btn-primary px-10 py-4 rounded-full"
      >
        {showAll ? less : more}
      </motion.button>

    </div>
  );
}


function ErrorScreen({ message, onRetry }) {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-6 text-center">

      <h1 className="text-5xl font-bold text-red-500 mb-6">
        Oops!
      </h1>

      <p className="text-xl mb-8">
        {message}
      </p>

      <button
        onClick={onRetry}
        className="px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full font-bold"
      >
        Retry
      </button>

    </div>
  );
}