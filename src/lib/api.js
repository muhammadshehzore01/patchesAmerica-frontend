// project/frontend/src/lib/api.js
import { getMediaUrl, getBlogImage } from "./media";

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
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith("/api/") ? path.replace(/^\/api/, "") : path;
  return `${API_BASE}${cleanPath.startsWith("/") ? "" : "/"}${cleanPath}`;
}

/* =====================================================
   Unified fetch helper with ISR/revalidation
===================================================== */
export async function fetchJson(path, options = {}) {
  const url = buildApiUrl(path);

  // Determine revalidation strategy
  let nextConfig = { revalidate: 0 }; // default: no cache
  if (path.includes("/home") || path.includes("/services") || path.includes("/blogs")) {
    nextConfig = { revalidate: 3600 }; // ISR: 1 hour for public content
    // Can add tags later: { tags: ['home-data'] }
  }

  const res = await fetch(url, {
    ...options,
    next: nextConfig,
    cache: path.includes("/admin") || path.includes("/patch-requests") ? "no-store" : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminName");
      window.location.href = "/admin/login?expired=true";
    }
    throw new Error(`API ${res.status}: ${text || "Unknown error"}`);
  }
  return res.json();
}

/* =====================================================
   Normalizers (enhanced with optional size)
===================================================== */
export const normalizeSlide = (slide) =>
  slide
    ? {
        ...slide,
        image_url: getMediaUrl(
          slide.image_url || slide.image || slide.background_image,
          "/placeholder.png"
        ),
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
    image_url: getMediaUrl(
      service.image_url || service.image || service.thumbnail || service.cover_image,
      "/placeholder-service.jpg"
    ),
    gallery,
    created_at: service.created_at,
    updated_at: service.updated_at,
  };
};

export const normalizeBlog = (blog) =>
  blog ? { ...blog, cover_image_url: getBlogImage(blog) } : null;

export const normalizePatchArtwork = (artwork) =>
  artwork
    ? {
        ...artwork,
        file_url: getMediaUrl(
          artwork.file_url || artwork.image || artwork.path,
          "/placeholder.png"
        ),
      }
    : null;

export const normalizePatchRequest = (patch) =>
  patch
    ? {
        ...patch,
        artworks: (patch.artworks ?? []).map(normalizePatchArtwork).filter(Boolean),
      }
    : null;

/* =====================================================
   ADMIN AUTH
===================================================== */
export async function loginAdmin(username, password) {
  if (typeof window === "undefined") {
    throw new Error("Client-only");
  }
  const res = await fetch(buildApiUrl("/admin-token/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.token) {
    throw new Error(data.detail || "Invalid credentials");
  }
  localStorage.setItem("adminToken", data.token);
  localStorage.setItem("adminName", username);
  return data;
}

export async function adminFetch(path, options = {}) {
  if (typeof window === "undefined") {
    throw new Error("adminFetch must run on client");
  }
  const token = localStorage.getItem("adminToken");
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(buildApiUrl(path), {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
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