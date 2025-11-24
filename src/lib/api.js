// lib/api.js
import { getMediaUrl } from "./media";
import { getBlogImage } from "./media";

const isServer = typeof window === "undefined";
const isDocker = process.env.DOCKER_ENV === "true";

// ------------------------------------------------------------------
// BASE API URL (Smart detection for SSR, Docker, and Browser)
// ------------------------------------------------------------------
export const API_BASE = isServer
  ? isDocker
    ? process.env.DOCKER_INTERNAL_API_BASE || "http://backend:8000/api"
    : process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api"
  : process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api";

// ------------------------------------------------------------------
// Unified fetch helper
// ------------------------------------------------------------------
export async function fetchJson(path, options = {}) {
  try {
    const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
    console.log("🧠 Fetching URL:", url);

    const res = await fetch(url, {
      ...options,
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      throw new Error(`API fetch failed: ${res.status} ${res.statusText} — ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("❌ fetchJson error:", error.message);
    return null;
  }
}

// ------------------------------------------------------------------
// Normalizers
// ------------------------------------------------------------------

export const normalizeSlide = slide =>
  slide
    ? {
        ...slide,
        image_url: getMediaUrl(
          slide.image_url || slide.image || slide.background_image,
          "/placeholder.png"
        ),
      }
    : null;

export const normalizeService = service => {
  if (!service) return null;

  const gallery = (service.gallery ?? []).map(img => ({
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
  };
};

export const normalizeBlog = (blog) =>
  blog
    ? {
        ...blog,
        cover_image_url: getBlogImage(blog),
      }
    : null;

export const normalizePatchArtwork = artwork =>
  artwork
    ? {
        ...artwork,
        file_url: getMediaUrl(artwork.file_url || artwork.image || artwork.path, "/placeholder.png"),
      }
    : null;

export const normalizePatchRequest = patch =>
  patch
    ? {
        ...patch,
        artworks: (patch.artworks ?? []).map(normalizePatchArtwork).filter(Boolean),
      }
    : null;

// ------------------------------------------------------------------
// Admin Login & Admin Auth Fetch
// ------------------------------------------------------------------
export async function loginAdmin(username, password) {
  if (typeof window === "undefined") return { success: false, error: "Client-only" };

  try {
    const res = await fetch(`${API_BASE}/obtain_admin_token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.token) {
      return {
        success: false,
        error: data.detail || "Invalid credentials",
      };
    }

    localStorage.setItem("adminToken", data.token);
    return { success: true, token: data.token };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function adminFetch(path, options = {}) {
  if (typeof window === "undefined") throw new Error("adminFetch must run on client");

  const token = localStorage.getItem("adminToken");

  const headers = {
    ...(options.headers || {}),
    Authorization: token ? `Token ${token}` : undefined,
    "Content-Type": "application/json",
  };

  return fetchJson(path, { ...options, headers });
}
