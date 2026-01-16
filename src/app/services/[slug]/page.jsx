// frontend/src/app/services/[slug]/page.js
// src/app/services/[slug]/page.js
import { notFound } from "next/navigation";
import ServiceDetailClient from "./ServiceDetailClient";
import { getMediaUrl } from "@/lib/media";

/* ---------------- SAFE FETCH ---------------- */
async function safeFetchService(slug) {
  try {
    const API_BASE =
      process.env.DOCKER_ENV === "true"
        ? "http://django_backend:8000/api"
        : process.env.NEXT_PUBLIC_API_BASE || "https://northernpatches.com/api";

    const res = await fetch(`${API_BASE}/services/${slug}/`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/* ---------------- SEO METADATA ---------------- */
export async function generateMetadata({ params }) {
  const service = await safeFetchService(params.slug);
  if (!service) {
    return {
      title: "Service Not Found | Northern Patches",
      robots: "noindex",
    };
  }

  const description =
    service.meta_description ||
    service.description?.replace(/<[^>]+>/g, "").slice(0, 160);

  return {
    title: `${service.title} | Northern Patches`,
    description,
    alternates: {
      canonical: `https://northernpatches.com/services/${params.slug}`,
    },
    openGraph: {
      title: service.title,
      description,
      images: [getMediaUrl(service.image || service.image_url)],
    },
  };
}

/* ---------------- PAGE ---------------- */
export default async function ServicePage({ params }) {
  const service = await safeFetchService(params.slug);
  if (!service) notFound();

  return (
    <main className="relative z-10 text-white pt-20 md:pt-24 lg:pt-28">
      <ServiceDetailClient
        service={{
          ...service,
          gallery: Array.isArray(service.gallery) ? service.gallery : [],
          image_url: getMediaUrl(
            service.image || service.image_url || service.thumbnail
          ),
        }}
      />
    </main>
  );
}
