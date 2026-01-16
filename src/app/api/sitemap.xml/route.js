export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://northernpatches.com";

const API_BASE =
  process.env.DOCKER_ENV === "true"
    ? "http://django_backend:8000/api"
    : process.env.NEXT_PUBLIC_API_BASE || `${BASE_URL}/api`;

let cachedSitemap = null;
let lastGenerated = 0;
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

/* ---------------- Helpers ---------------- */
function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d.toISOString().split("T")[0];
}

function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (data?.results && Array.isArray(data.results)) return data.results;
  return [];
}

async function fetchJson(url) {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/* ---------------- GET ---------------- */
export async function GET() {
  const now = Date.now();

  if (cachedSitemap && now - lastGenerated < CACHE_TIME) {
    return new Response(cachedSitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  try {
    /* -------- Static URLs -------- */
    const staticUrls = [
      { loc: `${BASE_URL}/` },
      { loc: `${BASE_URL}/about/` },
      { loc: `${BASE_URL}/contact/` },
      { loc: `${BASE_URL}/services/` },
      { loc: `${BASE_URL}/blog/` }, // ✅ CORRECT
      { loc: `${BASE_URL}/quote/` },
    ];

    /* -------- Services -------- */
    const servicesData = await fetchJson(`${API_BASE}/services/`);
    const servicesList = normalizeList(servicesData);

    const services = servicesList
      .filter(s => s?.slug)
      .map(s => ({
        loc: `${BASE_URL}/services/${s.slug}/`,
        lastmod: s.updated_at || s.created_at || null,
      }));

    /* -------- Blogs (FIXED) -------- */
    const blogsData = await fetchJson(`${API_BASE}/blogs/`);
    const blogsList = normalizeList(blogsData);

    const blogs = blogsList
      .filter(b => b?.slug)
      .map(b => ({
        loc: `${BASE_URL}/blog/${b.slug}/`, // ✅ FIXED HERE
        lastmod: b.published_at || b.updated_at || null,
      }));

    /* -------- Merge & Deduplicate -------- */
    let urls = [...staticUrls, ...services, ...blogs];
    const seen = new Set();
    urls = urls.filter(u => u.loc && !seen.has(u.loc) && seen.add(u.loc));

    /* -------- XML -------- */
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, lastmod }) => `  <url>
    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${formatDate(lastmod)}</lastmod>` : ""}
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    cachedSitemap = sitemapXml;
    lastGenerated = Date.now();

    return new Response(sitemapXml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("Sitemap error", { status: 500 });
  }
}
