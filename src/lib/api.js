// src/lib/api.js
import { getMediaUrl, getBlogImage } from "./media";

/* =====================================================
   SLUG HELPERS
===================================================== */
export const slugify = (text) =>
  text?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

export const deslugify = (slug) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

/* =====================================================
   Environment detection
===================================================== */
const isServer = typeof window === "undefined";
const isDocker = process.env.DOCKER_ENV === "true";

/* =====================================================
   API BASE (ALWAYS includes /api)
===================================================== */
export const API_BASE = isServer
  ? isDocker
    ? process.env.DOCKER_INTERNAL_API_BASE || "http://django_backend:8000/api"
    : process.env.NEXT_PUBLIC_API_BASE || "https://northernpatches.com/api"
  : process.env.NEXT_PUBLIC_API_BASE || "https://northernpatches.com/api";

/* =====================================================
   Safe API URL builder
===================================================== */
function buildApiUrl(path = "") {
  if (!path) return API_BASE;
  if (path.startsWith("http")) return path;

  let cleanPath = path;
  if (cleanPath.startsWith("/api/")) cleanPath = cleanPath.replace(/^\/api/, "");
  if (!cleanPath.startsWith("/")) cleanPath = `/${cleanPath}`;

  const finalUrl = `${API_BASE}${cleanPath}`;
  if (typeof window !== "undefined") console.log("🌐 API Fetch:", finalUrl);

  return finalUrl;
}

/* =====================================================
   Unified fetch helper
===================================================== */
export async function fetchJson(path, options = {}) {
  const url = buildApiUrl(path);
  const isClient = typeof window !== "undefined";

  try {
    const fetchOptions = {
      ...options,
      headers: { ...(options.headers || {}), "Content-Type": "application/json" },
      ...(isClient
        ? {}
        : {
            next: {
              revalidate:
                path.includes("/home") ||
                path.includes("/services") ||
                path.includes("/blogs") ||
                path.includes("/us-states")
                  ? 3600
                  : 60,
            },
          }),
      cache: path.includes("/admin") || path.includes("/patch-requests") ? "no-store" : "force-cache",
    };

    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("❌ API Error:", { url, status: res.status, body: text });

      if (res.status === 401 && isClient) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminName");
        window.location.href = "/admin/login?expired=true";
      }

      throw new Error(`API ${res.status}: ${text || "Unknown error"}`);
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Fetch failed:", url, error);
    throw error;
  }
}

/* =====================================================
   US States Fetcher
===================================================== */
export async function getUSStates() {
  try {
    const data = await fetchJson("/us-states/");
    if (!Array.isArray(data)) return [];

    return data.map((state) => ({
      code: state.code,
      name: state.name,
      slug: slugify(state.name),
      cities: (state.cities ?? []).map(slugify),
    }));
  } catch (err) {
    console.error("Failed to fetch US states:", err);
    return [];
  }
}

/* =====================================================
   Single state fetcher
===================================================== */
export async function getStateByCode(codeOrSlug) {
  try {
    const states = await getUSStates();
    if (!states?.length) return null;

    const input = slugify(codeOrSlug);

    return (
      states.find(
        (state) => slugify(state.code) === input || state.slug === input
      ) || null
    );
  } catch (error) {
    console.error("getStateByCode error:", error);
    return null;
  }
}

/* =====================================================
   Services Fetcher
===================================================== */
export async function getServices() {
  try {
    const services = await fetchJson("/services/");
    if (!Array.isArray(services)) return [];
    return services.map(normalizeService).filter(Boolean);
  } catch (err) {
    console.error("Failed to fetch services:", err);
    return [];
  }
}

/* =====================================================
   Chenille Services Fetcher (NEW)
===================================================== */
export async function getChenilleServices() {
  const allServices = await getServices();
  return allServices.filter((s) =>
    s.title.toLowerCase().includes("chenille")
  );
}

/* =====================================================
   Normalizers
===================================================== */
export const normalizeSlide = (slide) =>
  slide
    ? {
        ...slide,
        image_url: getMediaUrl(slide.image_url || slide.image || slide.background_image, "/placeholder.png"),
      }
    : null;

export const normalizeService = (service) => {
  if (!service) return null;

  const gallery = (service.gallery ?? []).map((img) => ({
    ...img,
    image_url: getMediaUrl(img.image_url || img.image, "/placeholder-service.jpg"),
  }));

  return {
    ...service,
    slug: slugify(service.title), // ensure slug exists
    image_url: getMediaUrl(service.image_url || service.image || service.thumbnail || service.cover_image, "/placeholder-service.jpg"),
    gallery,
    created_at: service.created_at,
    updated_at: service.updated_at,
  };
};

export const normalizeBlog = (blog) =>
  blog
    ? { ...blog, cover_image_url: getBlogImage(blog) }
    : null;

export const normalizePatchArtwork = (artwork) =>
  artwork
    ? { ...artwork, file_url: getMediaUrl(artwork.file_url || artwork.image || artwork.path, "/placeholder.png") }
    : null;

export const normalizePatchRequest = (patch) =>
  patch
    ? { ...patch, artworks: (patch.artworks ?? []).map(normalizePatchArtwork).filter(Boolean) }
    : null;

/* =====================================================
   Admin Auth
===================================================== */
export async function loginAdmin(username, password) {
  if (typeof window === "undefined") throw new Error("Client-only");

  const res = await fetch(buildApiUrl("/admin-token/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.token) throw new Error(data.detail || "Invalid credentials");

  localStorage.setItem("adminToken", data.token);
  localStorage.setItem("adminName", username);

  return data;
}

export async function adminFetch(path, options = {}) {
  if (typeof window === "undefined") throw new Error("adminFetch must run on client");

  const token = localStorage.getItem("adminToken");
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(buildApiUrl(path), {
    ...options,
    headers: { ...(options.headers || {}), Authorization: `Token ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (res.status === 401) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    window.location.href = "/admin/login?expired=true";
    throw new Error("Session expired");
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Admin API ${res.status}: ${text}`);
  }

  return res.json();
}

/* =====================================================
   Blogs Fetchers
===================================================== */
export async function getBlogsByCity(stateCode, cityName) {
  try {
    const blogs = await fetchJson(`/blogs/?state=${encodeURIComponent(stateCode)}&city=${encodeURIComponent(cityName)}`);
    if (!Array.isArray(blogs)) return [];
    return Array.from(new Map(blogs.map((b) => [b.id, b])).values());
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getBlogsByState(stateCode) {
  try {
    const blogs = await fetchJson(`/blogs/?state=${encodeURIComponent(stateCode)}`);
    if (!Array.isArray(blogs)) return [];
    return Array.from(new Map(blogs.map((b) => [b.id, b])).values());
  } catch (err) {
    console.error(err);
    return [];
  }
}

/* =====================================================
   Chenille Blogs Fetchers (NEW)
===================================================== */
export async function getChenilleBlogsByCity(stateCode, cityName) {
  try {
    const blogs = await fetchJson(`/blogs/?state=${encodeURIComponent(stateCode)}&city=${encodeURIComponent(cityName)}&category=chenille`);
    if (!Array.isArray(blogs)) return [];
    return Array.from(new Map(blogs.map((b) => [b.id, b])).values());
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getChenilleBlogsByState(stateCode) {
  try {
    const blogs = await fetchJson(`/blogs/?state=${encodeURIComponent(stateCode)}&category=chenille`);
    if (!Array.isArray(blogs)) return [];
    return Array.from(new Map(blogs.map((b) => [b.id, b])).values());
  } catch (err) {
    console.error(err);
    return [];
  }
}