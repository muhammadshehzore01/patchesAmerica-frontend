// src/app/blog/[slug]/page.jsx
import { notFound } from "next/navigation";
import BlogDetailClient from "./BlogDetailClient";
import { getMediaUrl } from "@/lib/media";

async function safeFetchBlog(slug) {
  try {
    const API_BASE =
      process.env.DOCKER_ENV === "true"
        ? "http://django_backend:8000/api"
        : process.env.NEXT_PUBLIC_API_BASE || "https://northernpatches.com/api";
    if (!slug) return null;
    const url = `${API_BASE}/blogs/${slug}/`;
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
      title: "Blog Not Found | Northern Patches",
      robots: "noindex",
    };
  }

  const blog = await safeFetchBlog(slug);
  if (!blog) {
    return {
      title: "Blog Not Found | Northern Patches",
      robots: "noindex",
    };
  }

  return {
    title: blog.meta_title,
    description: blog.meta_description,
    keywords: blog.meta_keywords,
    alternates: { canonical: `https://northernpatches.com/blog/${slug}` },
    openGraph: {
      title: blog.meta_title,
      description: blog.meta_description,
      url: `https://northernpatches.com/blog/${slug}`,
      images: blog.cover_image_url ? [{ url: blog.cover_image_url, width: 1200, height: 630 }] : [],
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: blog.meta_title,
      description: blog.meta_description,
      images: blog.cover_image_url ? [blog.cover_image_url] : [],
    },
    other: {
      "application/ld+json": JSON.stringify(blog.schema || {}),
    },
  };
}

export default async function BlogDetail({ params }) {
  const slug = params?.slug;
  if (!slug) notFound();
  const blog = await safeFetchBlog(slug);
  if (!blog) notFound();

  const imageUrl = getMediaUrl(blog.cover_image_url || blog.image_url || "/og-default-blog.jpg");

  return (
    <main className="relative z-10 min-h-screen text-white pt-20 md:pt-24 lg:pt-28">
      {/* Structured data already in generateMetadata – no duplicate */}

      <BlogDetailClient blog={{ ...blog, image_url: imageUrl }} />

      {/* Related Services Section – new */}
      {blog.related_services?.length > 0 && (
        <section className="mt-16 border-t border-gray-800 pt-12 px-6 md:px-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Related Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {blog.related_services.map((service) => (
              <a
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group block p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-blue-600 transition-all"
              >
                <h3 className="font-semibold text-lg group-hover:text-blue-400">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-400 mt-3 line-clamp-3">
                  {service.description}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
} 