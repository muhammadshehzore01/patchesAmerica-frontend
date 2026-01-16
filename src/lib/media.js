// project/frontend/src/lib/media.js
// ==============================
// 🌐 Base universal function
// ==============================
export function getMediaUrl(path = "", placeholder = "/placeholder.png") {
  if (!path || typeof path !== "string") return placeholder;

  // If path is already absolute (starts with http or https), return it as is
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // Remove any internal URL prefixes
  path = path.replace(/^http:\/\/localhost:8000\/media\//i, "");
  path = path.replace(/^http:\/\/django_backend:8000\/media\//i, "");
  path = path.replace(/^\/?media\//i, "");

  // Use the public base
  const base = process.env.NEXT_PUBLIC_MEDIA_BASE || "https://northernpatches.com/media";
  return `${base}/${path}`;
}

// ==============================
// 🏠 Home Slider Helper
// ==============================
export function getSlideImage(slide) {
  if (!slide) return "/placeholder.png";
  return getMediaUrl(slide.image || slide.image_url || slide.background_image);
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
  return getMediaUrl(blog.cover_image_url || blog.image || blog.cover_image || blog.thumbnail, "/placeholder.png");
}
