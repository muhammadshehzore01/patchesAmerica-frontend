// project/frontend/src/app/blog/[slug]/page.jsx
import { getMediaUrl } from "@/lib/media";
import { notFound } from "next/navigation";
import BlogDetailClient from "./BlogDetailClient";

export const dynamic = "force-dynamic";
/* ===============================
   SAFE FETCH
================================ */
async function safeFetchBlog(slug) {
  try {
    const API_BASE =
      process.env.DOCKER_ENV === "true"
        ? "http://django_backend:8000/api"
        : process.env.NEXT_PUBLIC_API_BASE || "https://northernpatches.com/api";

    const res = await fetch(`${API_BASE}/blogs/${slug}/`, {
      cache: "no-store", // 🔴 CRITICAL for Next.js 15
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/* ===============================
   METADATA (SEO)
================================ */
export async function generateMetadata({ params }) {
  const slug = params?.slug;
  if (!slug) {
    return {
      title: "Blog Not Found | Northern Patches",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const blog = await safeFetchBlog(slug);
  if (!blog) {
    return {
      title: "Blog Not Found | Northern Patches",
      robots: "noindex",
    };
  }

  const description =
    blog.excerpt ||
    blog.content?.replace(/<[^>]+>/g, "").slice(0, 160) ||
    "";

  const imageUrl = getMediaUrl(blog.cover_image_url || blog.image_url);

  const canonical = `https://northernpatches.com/blog/${slug}`;

  return {
    title: `${blog.title} | Northern Patches`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: blog.title,
      description,
      url: canonical,
      images: imageUrl ? [imageUrl] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

/* ===============================
   PAGE
================================ */
export default async function BlogDetail({ params }) {
  const slug = params?.slug;
  if (!slug) notFound();

  const blog = await safeFetchBlog(slug);
  if (!blog) notFound(); // ✅ real 404

  const imageUrl = getMediaUrl(blog.cover_image_url || blog.image_url);

  /* ===============================
     BLOG SCHEMA (JSON-LD)
  ================================ */
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description:
      blog.excerpt ||
      blog.content?.replace(/<[^>]+>/g, "").slice(0, 160),
    image: imageUrl,
    author: {
      "@type": "Organization",
      name: "Northern Patches",
    },
    publisher: {
      "@type": "Organization",
      name: "Northern Patches",
      logo: {
        "@type": "ImageObject",
        url: "https://northernpatches.com/logo.png",
      },
    },
    datePublished: blog.published_at,
    dateModified: blog.updated_at || blog.published_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://northernpatches.com/blog/${slug}`,
    },
  };

  return (
    <main className="relative z-10 min-h-screen">
      {/* 🔥 STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogSchema),
        }}
      />

      <BlogDetailClient
        blog={{
          ...blog,
          image_url: imageUrl,
        }}
      />
    </main>
  );
}
