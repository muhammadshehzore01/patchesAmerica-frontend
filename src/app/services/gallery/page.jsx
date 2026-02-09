// src/app/services/gallery/page.jsx
import ServiceGalleryClient from "./ServiceGalleryClient";

// Force dynamic rendering – this page depends on live backend data
export const dynamic = 'force-dynamic';

async function safeFetchAllServices() {
  try {
    const API_BASE =
      process.env.DOCKER_ENV === "true"
        ? "http://django_backend:8000/api"
        : process.env.NEXT_PUBLIC_API_BASE || "https://northernpatches.com/api";

    if (!API_BASE) {
      console.warn("[Gallery] No API_BASE defined – returning empty array");
      return [];
    }

    const url = `${API_BASE}/services/`;
    console.log("[Gallery Runtime] Fetching:", url);

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent": "NorthernPatches-Gallery/1.0",
      },
    });

    if (!res.ok) {
      console.warn(`[Gallery] Fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();

    // Extra safety: handle any non-array response
    const servicesArray = Array.isArray(data) ? data : data?.results || data?.data || [];

    console.log(`[Gallery] Received ${servicesArray.length} services`);
    return servicesArray;
  } catch (err) {
    console.error("[Gallery] Fetch error:", err.message);
    return [];
  }
}

export default async function ServiceGalleryPage() {
  const services = (await safeFetchAllServices()) ?? [];

  // Safe flatMap – will never throw even if services is malformed
  const galleryItems = services.flatMap((service) =>
    (service?.gallery || []).map((img) => ({
      id: img?.id || `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      image: img?.image_url || img?.image || "/placeholder-service.jpg",
      serviceTitle: service?.title || "Custom Patch",
      serviceSlug: service?.slug || "",
      alt: `${service?.title || "Custom Patch"} – Premium USA-made custom patch example by Northern Patches`,
    }))
  );

  return <ServiceGalleryClient items={galleryItems} />;
}

// src/app/services/gallery/page.jsx (metadata export only – keep the rest unchanged)
export const metadata = {
  title: "Custom Patches Gallery | Northern Patches – USA Made",
  description:
    "Browse real examples of premium custom patches: embroidered, PVC, chenille, woven & leather. No minimum order, fast USA production, high-quality craftsmanship by Northern Patches.",
  keywords:
    "custom patches gallery, embroidered patches examples, PVC patches USA, chenille patches designs, woven patches showcase, leather patches gallery, custom patches no minimum, USA made patches",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://northernpatches.com/services/gallery",
  },
  openGraph: {
    title: "Custom Patches Gallery | Northern Patches – USA Made",
    description:
      "View high-resolution photos of real custom embroidered, PVC, chenille, woven & leather patches. Premium quality, no minimum order, fast production.",
    url: "https://northernpatches.com/services/gallery",
    siteName: "Northern Patches",
    images: [
      {
        url: "/og-gallery.jpg",          
        width: 1200,
        height: 630,
        alt: "Gallery of premium custom patches made in USA by Northern Patches",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Patches Gallery | Northern Patches USA",
    description:
      "Real examples of custom embroidered, PVC, chenille, woven & leather patches – no minimum order.",
    images: ["/og-gallery.jpg"],
  },
};