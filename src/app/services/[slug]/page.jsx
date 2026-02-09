// src/app/services/[slug]/page.jsx
import { notFound } from "next/navigation";
import ServiceDetailClient from "./ServiceDetailClient";
import { getMediaUrl } from "@/lib/media";

async function safeFetchService(slug) {
  try {
    const API_BASE =
      process.env.DOCKER_ENV === "true"
        ? "http://django_backend:8000/api"
        : process.env.NEXT_PUBLIC_API_BASE || "https://northernpatches.com/api";
    if (!slug) return null;
    const url = `${API_BASE}/services/${slug}/`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  if (!slug) {
    return {
      title: "Service Not Found | Northern Patches USA",
      description: "The requested custom patch service could not be found.",
      robots: "noindex",
    };
  }

  const service = await safeFetchService(slug);
  if (!service) {
    return {
      title: "Service Not Found | Northern Patches USA",
      description: "The requested custom patch service could not be found.",
      robots: "noindex",
    };
  }

  return {
    title: service.meta_title,
    description: service.meta_description,
    keywords: service.meta_keywords,
    alternates: { canonical: `https://northernpatches.com/services/${slug}/` },
    openGraph: {
      title: service.meta_title,
      description: service.meta_description,
      url: `https://northernpatches.com/services/${slug}/`,
      images: service.image_url ? [{ url: service.image_url, width: 1200, height: 630 }] : [],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: service.meta_title,
      description: service.meta_description,
      images: service.image_url ? [service.image_url] : [],
    },
    other: {
      "application/ld+json": JSON.stringify(service.schema),
    },
  };
}

export default async function ServicePage({ params }) {
  const service = await safeFetchService(params.slug);
  if (!service) notFound();

  return (
    <main className="relative z-10 min-h-screen text-white pt-20 md:pt-24 lg:pt-28">
      {/* Structured data is already in generateMetadata – no duplicate needed */}

      <ServiceDetailClient
        service={{
          ...service,
          gallery: Array.isArray(service.gallery) ? service.gallery : [],
          image_url: getMediaUrl(
            service.image_url || service.image || service.thumbnail || "/default-og-image.jpg"
          ),
        }}
      />

      {/* Related Blogs Section – new */}
      {service.related_blogs?.length > 0 && (
        <section className="mt-16 border-t border-gray-800 pt-12 px-6 md:px-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Related Blog Posts
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {service.related_blogs.map((blog) => (
              <a
                key={blog.slug}
                href={`/blog/${blog.slug}`}
                className="group block p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-blue-600 transition-all"
              >
                <h3 className="font-semibold text-lg group-hover:text-blue-400">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-400 mt-3 line-clamp-3">
                  {blog.excerpt}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
} 