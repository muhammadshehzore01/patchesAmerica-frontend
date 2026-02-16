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
    const res = await fetch(url, {
      cache: "no-store",
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return {
      ...data,
      gallery: Array.isArray(data.gallery) ? data.gallery : [],
      image_url: getMediaUrl(data.image_url || data.image || data.thumbnail || "/default-service.jpg"),
    };
  } catch (error) {
    console.error(`Failed to fetch service ${slug}:`, error);
    return null;
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 60;

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
    title: service.meta_title || `${service.title} | Northern Patches USA – Custom Patches No Minimum`,
    description:
      service.meta_description ||
      service.excerpt?.slice(0, 160) ||
      "Premium custom patches – no minimum order, fast USA shipping.",
    keywords: service.meta_keywords || "custom patches USA, no minimum patches, embroidered patches, PVC patches",
    alternates: {
      canonical: `https://northernpatches.com/services/${slug}/`,
    },
    openGraph: {
      title: service.meta_title || service.title,
      description: service.meta_description || service.excerpt?.slice(0, 160),
      url: `https://northernpatches.com/services/${slug}/`,
      images: service.image_url ? [{ url: service.image_url, width: 1200, height: 630, alt: service.title }] : [],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: service.meta_title || service.title,
      description: service.meta_description || service.excerpt?.slice(0, 160),
      images: service.image_url ? [service.image_url] : [],
    },
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: service.title,
        provider: {
          "@type": "Organization",
          name: "Northern Patches USA",
          url: "https://northernpatches.com",
        },
        areaServed: "US",
        description: service.description?.slice(0, 300),
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "Contact for quote",
          itemOffered: { "@type": "Service", name: service.title },
        },
      }),
    },
  };
}

export default async function ServicePage({ params }) {
  const service = await safeFetchService(params.slug);
  if (!service) notFound();

  return (
    <main className="relative z-10 min-h-screen text-white pt-20 md:pt-24 lg:pt-28">
      <ServiceDetailClient service={service} />

      {service.related_blogs?.length > 0 && (
        <section
          aria-labelledby="related-blogs-heading"
          className="mt-16 border-t border-gray-800 pt-12 px-6 md:px-12 bg-gradient-to-b from-transparent to-black/30"
        >
          <h2
            id="related-blogs-heading"
            className="text-2xl md:text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400"
          >
            Related Blog Posts
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {service.related_blogs.map((blog) => (
              <Link
                key={blog.slug}
                href={`/blog/${blog.slug}`}
                className="group block p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-blue-600 transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 focus-visible:ring-offset-black outline-none"
                aria-label={`Read blog post: ${blog.title}`}
              >
                <h3 className="font-semibold text-lg mb-3 group-hover:text-blue-400 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-3">
                  {blog.excerpt || "Read more about custom patches..."}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}