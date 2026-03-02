// src/app/api/sitemap.xml/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getUSStates } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://northernpatches.com";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cachedSitemap = null;
let lastGenerated = 0;

// Helper: format date to YYYY-MM-DD
function formatDate(dateStr) {
  if (!dateStr) return new Date().toISOString().split("T")[0];
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date().toISOString().split("T")[0] : d.toISOString().split("T")[0];
}

// Helper: slugify city/state names
function slugify(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export async function GET() {
  const now = Date.now();

  // Serve cached sitemap if valid
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
    // 1️⃣ Static root pages
    const staticPages = [
      { loc: `${BASE_URL}/custom-patches/`, lastmod: formatDate(), priority: "1.0", changefreq: "daily" },
      { loc: `${BASE_URL}/custom-embroidered-patches-usa/`, lastmod: formatDate(), priority: "1.0", changefreq: "daily" },
    ];

    // 2️⃣ Fetch US states + cities from updated API
    const states = await getUSStates();
    const geoPages = [];

    states.forEach(state => {
      if (!state.name) return;

      const stateSlug = slugify(state.name);

      // State-level pages
      geoPages.push({
        loc: `${BASE_URL}/custom-patches/${stateSlug}/`,
        lastmod: formatDate(),
        priority: "0.9",
        changefreq: "weekly",
      });
      geoPages.push({
        loc: `${BASE_URL}/custom-embroidered-patches-usa/${stateSlug}/`,
        lastmod: formatDate(),
        priority: "0.9",
        changefreq: "weekly",
      });

      // City-level pages
      const cities = Array.isArray(state.cities) ? state.cities : [];
      cities.forEach(city => {
        if (!city) return;
        const citySlug = slugify(city);

        geoPages.push({
          loc: `${BASE_URL}/custom-patches/${stateSlug}/${citySlug}/`,
          lastmod: formatDate(),
          priority: "0.8",
          changefreq: "weekly",
        });
        geoPages.push({
          loc: `${BASE_URL}/custom-embroidered-patches-usa/${stateSlug}/${citySlug}/`,
          lastmod: formatDate(),
          priority: "0.8",
          changefreq: "weekly",
        });
      });
    });

    // 3️⃣ Combine & deduplicate
    const allUrlsMap = new Map();
    [...staticPages, ...geoPages].forEach(u => allUrlsMap.set(u.loc, u));
    const allUrls = Array.from(allUrlsMap.values());

    // 4️⃣ Generate XML
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`)
  .join("\n")}
</urlset>`;

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