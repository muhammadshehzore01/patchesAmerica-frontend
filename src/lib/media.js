// frontend\src\lib\media.js
// ==============================
// 🌐 Base universal function
// ==============================
export function getMediaUrl(path = "", placeholder = "/placeholder.png") {
  if (!path || typeof path !== "string") return placeholder;

  // 🧹 Fix double /media/media/
  path = path.replace(/\/media\/+/g, "/media/");

  // ✅ Normalize Docker URLs → local
  if (path.startsWith("http")) {
    return path
      .replace("backend:8000", "localhost:8000")
      .replace("django_backend:8000", "localhost:8000")
      .replace("http://backend", "http://localhost:8000")
      .replace("http://django_backend", "http://localhost:8000")
      .replace("/media/media/", "/media/");
  }

  // 🧩 Normalize relative paths
  const cleanPath = path.replace(/^\/+|\/+$/g, "");
  const isServer = typeof window === "undefined";
  const isDocker = process.env.DOCKER_ENV === "true";

  // 🧠 Pick correct base
  const base =
    process.env.NEXT_PUBLIC_MEDIA_BASE ||
    (isServer
      ? isDocker
        ? process.env.DOCKER_INTERNAL_MEDIA_BASE || "http://backend:8000"
        : "http://localhost:8000"
      : "http://localhost:8000");

  // ✅ Prevent double /media/
  return `${base}/${cleanPath.startsWith("media/") ? cleanPath : `media/${cleanPath}`}`;
}

// ==============================
// 🏠 Home Slider Helper
// ==============================
export function getSlideImage(slide) {
  if (!slide) return "/placeholder.png";

  if (slide.image) return getMediaUrl(slide.image);
  if (slide.image_url) return getMediaUrl(slide.image_url);
  if (slide.background_image) return getMediaUrl(slide.background_image);

  return "/placeholder.png";
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
    blog.cover_image_url  || blog.image || blog.cover_image || blog.thumbnail,
    "/placeholder.png"
  );
}

