// project/frontend/src/lib/media.js

// ==============================
// 🌐 Base universal function
// ==============================
export function getMediaUrl(
  path = "",
  placeholder = "/placeholder.png",
  options = {} // { width, quality = 80 }
) {
  if (!path || typeof path !== "string") return placeholder;

  // Already absolute URL → return as-is
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // Strip internal/dev prefixes
  path = path
    .replace(/^http:\/\/localhost:8000\/media\//i, "")
    .replace(/^http:\/\/django_backend:8000\/media\//i, "")
    .replace(/^\/?media\//i, "");

  // Build public URL
  let url = `${
    process.env.NEXT_PUBLIC_MEDIA_BASE || "https://northernpatches.com/media"
  }/${path}`;

  // Optional query params for future image optimization proxy (Cloudflare, Imgix, etc.)
  if (options.width) {
    url += `?w=${options.width}`;
    if (options.quality) url += `&q=${options.quality}`;
    url += "&fmt=webp"; // assume proxy handles format conversion
  }

  return url;
}

// ==============================
// 🏠 Home Slider Helper
// ==============================
export function getSlideImage(slide, opts = {}) {
  return getMediaUrl(
    slide?.image || slide?.image_url || slide?.background_image,
    "/placeholder.png",
    opts
  );
}

// ==============================
// 🧩 Services Helper
// ==============================
export function getServiceImage(service) {
  if (!service) return "/placeholder-service.jpg";
  return getMediaUrl(
    service.image_url ||
      service.image ||
      service.thumbnail ||
      service.cover_image ||
      service.gallery?.[0]?.image ||
      "/placeholder-service.jpg"
  );
}

// ==============================
// 🖼️ Service Gallery Helper
// ==============================
export function getGalleryImage(item) {
  if (!item) return "/placeholder-service.jpg";
  return getMediaUrl(item.image || item.image_url || item.file);
}

// ==============================
// 📰 Blog Helper
// ==============================
export function getBlogImage(blog) {
  if (!blog) return "/placeholder.png";
  return getMediaUrl(
    blog.cover_image_url || blog.image || blog.cover_image || blog.thumbnail,
    "/placeholder.png"
  );
}