// src/app/blog/page.jsx
import BlogGridClient from "./BlogGridClient";

export const revalidate = 86400; // 24 hours

async function getBlogs() {
  const API_BASE =
    process.env.DOCKER_ENV === "true"
      ? process.env.DOCKER_INTERNAL_API_BASE || "http://django_backend:8000/api"
      : process.env.NEXT_PUBLIC_API_BASE || "https://northernpatches.com/api";

  try {
    const res = await fetch(`${API_BASE}/blogs/`, {
      cache: "no-store", // 🔹 ensures SSR fetch always works
    });

    if (!res.ok) {
      console.error("API fetch failed with status:", res.status);
      return [];
    }

    const blogs = await res.json();
    // Return featured if exists
    const featured = blogs.filter((blog) => blog.featured);
    return featured.length > 0 ? featured : blogs;
  } catch (err) {
    console.error("Failed to fetch blogs:", err.message);
    return [];
  }
}



export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <main className="relative z-10 bg-[#0f0f18] min-h-screen">
      {blogs.length === 0 ? (
        <div className="text-center py-32 text-blue-100/60">
          <p className="text-2xl font-semibold">No blogs available yet.</p>
          <p className="mt-4 text-base">Check back soon for updates from Northern Patches.</p>
        </div>
      ) : (
        <BlogGridClient blogs={blogs} />
      )}
    </main>
  );
}
