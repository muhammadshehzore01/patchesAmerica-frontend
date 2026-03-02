// project/frontend/src/lib/media.js

// ==============================
// 🌐 Base universal function (CRASH-SAFE)
// ==============================
export function getMediaUrl(
  path = "",
  placeholder = "/placeholder-service.jpg",
  options = {} // { width, quality }
) {
  try {
    // Null safety
    if (!path || typeof path !== "string") {
      return placeholder;
    }

    let cleanPath = path.trim();

    if (!cleanPath) return placeholder;

    // Already absolute URL → return as-is
    if (
      cleanPath.startsWith("http://") ||
      cleanPath.startsWith("https://")
    ) {
      return cleanPath;
    }

    // Remove dev / docker prefixes safely
    cleanPath = cleanPath
      .replace(/^http:\/\/localhost:\d+\/media\//i, "")
      .replace(/^http:\/\/django_backend:\d+\/media\//i, "")
      .replace(/^\/?media\//i, "")
      .replace(/^\/+/i, "");

    // Base URL fallback safety
    const base =
      process.env.NEXT_PUBLIC_MEDIA_BASE ||
      "https://northernpatches.com/media";

    let url = `${base}/${cleanPath}`;

    // Optional optimization params
    if (options?.width) {
      url += `?w=${options.width}`;

      if (options?.quality) {
        url += `&q=${options.quality}`;
      }

      url += "&fmt=webp";
    }

    return url;
  } catch (err) {
    console.error("getMediaUrl error:", err);
    return placeholder;
  }
}

// ==============================
// 🏠 Home Slider Helper (SAFE)
// ==============================
export function getSlideImage(slide, opts = {}) {
  try {
    return getMediaUrl(
      slide?.image ||
        slide?.image_url ||
        slide?.background_image ||
        "",
      "/placeholder.png",
      opts
    );
  } catch {
    return "/placeholder.png";
  }
}

// ==============================
// 🧩 Services Helper (SAFE)
// ==============================
export function getServiceImage(service) {
  try {
    if (!service) return "/placeholder-service.jpg";

    return getMediaUrl(
      service.image_url ||
        service.image ||
        service.thumbnail ||
        service.cover_image ||
        service.gallery?.[0]?.image ||
        service.gallery?.[0]?.image_url ||
        "",
      "/placeholder-service.jpg"
    );
  } catch {
    return "/placeholder-service.jpg";
  }
}

// ==============================
// 🖼️ Service Gallery Helper (SAFE)
// ==============================
export function getGalleryImage(item) {
  try {
    return getMediaUrl(
      item?.image ||
        item?.image_url ||
        item?.file ||
        "",
      "/placeholder-service.jpg"
    );
  } catch {
    return "/placeholder-service.jpg";
  }
}

// ==============================
// 📰 Blog Helper (SAFE)
// ==============================
export function getBlogImage(blog) {
  try {
    return getMediaUrl(
      blog?.cover_image_url ||
        blog?.image ||
        blog?.cover_image ||
        blog?.thumbnail ||
        "",
      "/placeholder.png"
    );
  } catch {
    return "/placeholder.png";
  }
}