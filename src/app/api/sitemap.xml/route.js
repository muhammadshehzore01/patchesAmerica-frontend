// src/app/api/sitemap.xml/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // Ensures fresh data on each request (important for sitemap)

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://northernpatches.com";
const API_BASE = process.env.DOCKER_ENV === "true"
  ? "http://django_backend:8000/api"
  : process.env.NEXT_PUBLIC_API_BASE || `${BASE_URL}/api`;

// Cache config – balance freshness vs performance
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes – good for most sites
let cachedSitemap = null;
let lastGenerated = 0;

function formatDate(dateStr) {
  if (!dateStr) return new Date().toISOString().split("T")[0];
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date().toISOString().split("T")[0] : d.toISOString().split("T")[0];
}

async function fetchJson(url) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data?.results || data?.data || [];
  } catch (err) {
    console.error(`[Sitemap] Fetch error for ${url}:`, err.message);
    return [];
  }
}

export async function GET() {
  const now = Date.now();

  // Serve cache if fresh
  if (cachedSitemap && now - lastGenerated < CACHE_TTL) {
    return new Response(cachedSitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  try {
    // 1. Static pages (high priority)
    const staticPages = [
      { loc: `${BASE_URL}/`, lastmod: formatDate(), priority: "1.0", changefreq: "daily" },
      { loc: `${BASE_URL}/about/`, lastmod: formatDate(), priority: "0.8", changefreq: "monthly" },
      { loc: `${BASE_URL}/contact/`, lastmod: formatDate(), priority: "0.8", changefreq: "monthly" },
      { loc: `${BASE_URL}/services/`, lastmod: formatDate(), priority: "0.9", changefreq: "weekly" },
      { loc: `${BASE_URL}/quote/`, lastmod: formatDate(), priority: "0.7", changefreq: "monthly" },
      // Gallery is dynamic – add only if you want it indexed separately
      // { loc: `${BASE_URL}/services/gallery/`, lastmod: formatDate(), priority: "0.7", changefreq: "weekly" },
    ];

    // 2. Services detail pages
    const services = await fetchJson(`${API_BASE}/services/`);
    const servicePages = services
      .filter(s => s?.slug && s?.published !== false)
      .map(s => ({
        loc: `${BASE_URL}/services/${s.slug}/`,
        lastmod: formatDate(s.updated_at || s.created_at),
        priority: "0.8",
        changefreq: "weekly",
      }));

    // 3. Blog detail pages (only published)
    const blogsData = await fetchJson(`${API_BASE}/blogs/`);
    const blogPages = blogsData
      .filter(b => b?.slug && b?.published)
      .map(b => ({
        loc: `${BASE_URL}/blog/${b.slug}/`,
        lastmod: formatDate(b.published_at || b.updated_at),
        priority: "0.7",
        changefreq: "monthly",
      }));

    const allUrls = [...staticPages, ...servicePages, ...blogPages];

    // Generate clean XML
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

    // Update cache
    cachedSitemap = sitemapXml;
    lastGenerated = now;

    return new Response(sitemapXml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("[Sitemap] Generation failed:", err);
    return new Response("Sitemap generation error", { status: 500 });
  }
}