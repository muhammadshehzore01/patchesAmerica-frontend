import { fetchJson } from "@/lib/api";
import { getMediaUrl } from "@/lib/media";
import { notFound } from "next/navigation";
import BlogDetailClient from "./BlogDetailClient";
import LuxuryOverlay from "@/components/LuxuryOverlay";
import GlowFade from "@/components/GlowFade";

// metadata
export async function generateMetadata({ params }) {
  const { slug } = await params; // ✅ FIXED: await params

  if (!slug) return { title: "Blog Not Found | Northren-Patches AU" };

  const blog = await fetchJson(`${process.env.NEXT_PUBLIC_API_BASE}/blogs/${slug}/`);
  if (!blog) return { title: "Blog Not Found | Northren-Patches AU" };

  const description =
    blog.excerpt ||
    blog.content?.replace(/<[^>]+>/g, "").slice(0, 160) ||
    "";

  const imageUrl = getMediaUrl(blog.cover_image_url || blog.image_url);

  return {
    title: `${blog.title} | Northren-Patches AU`,
    description,
    openGraph: {
      title: blog.title,
      description,
      url: `https://northren-patches.au/blog/${slug}`,
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
      images: [imageUrl],
    },
  };
}

// page
export default async function BlogDetail({ params }) {
  const { slug } = await params; // ✅ FIXED: await params

  if (!slug) return notFound();

  const blog = await fetchJson(`${process.env.NEXT_PUBLIC_API_BASE}/blogs/${slug}/`);
  if (!blog) return notFound();

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      <LuxuryOverlay
        layers={[
          {
            from: "from-brand-900/90",
            via: "via-brand-800/70",
            to: "to-transparent",
          },
          {
            from: "from-[#0033FF]/20",
            via: "via-[#0600AB]/10",
            to: "to-transparent",
          },
        ]}
      />

      <GlowFade
        layers={[
          {
            from: "from-brand-700/30",
            via: "via-brand-600/20",
            to: "to-transparent",
            height: "h-64",
          },
        ]}
      />

      <div className="relative z-10">
        <BlogDetailClient
          blog={{
            ...blog,
            image_url: getMediaUrl(blog.cover_image_url || blog.image_url),
          }}
        />
      </div>
    </main>
  );
}
