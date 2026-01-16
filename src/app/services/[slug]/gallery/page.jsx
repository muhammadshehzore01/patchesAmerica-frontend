import { notFound } from "next/navigation";
import ServiceGalleryClient from "./ServiceGalleryClient";

export const dynamic = "force-dynamic";

/* ---------------- SAFE FETCH ALL SERVICES ---------------- */
async function safeFetchAllServices() {
  try {
    const API_BASE =
      process.env.DOCKER_ENV === "true"
        ? "http://django_backend:8000/api"
        : process.env.NEXT_PUBLIC_API_BASE || "https://northernpatches.com/api";

    const res = await fetch(`${API_BASE}/services/`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("safeFetchAllServices error:", err);
    return [];
  }
}

export async function generateMetadata() {
  return {
    title: `All Services Gallery | Northern Patches`,
    robots: { index: true, follow: true },
    alternates: { canonical: `https://northernpatches.com/services/gallery` },
  };
}

export default async function ServiceGalleryPage() {
  const services = await safeFetchAllServices();

  if (!services || services.length === 0) {
    notFound();
  }

  return <ServiceGalleryClient services={services} />;
}
