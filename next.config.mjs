
// project/frontend/next.config.mjs
/** @type {import('next').NextConfig} */

const isDocker = process.env.DOCKER_ENV === "true";

const nextConfig = {
  reactStrictMode: true,

  // ✅ IMAGE OPTIMIZATION
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "northernpatches.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "www.northernpatches.com",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "django_backend",
        port: "8000",
        pathname: "/media/**",
      },
    ],
  },

  // ✅ MOBILE SCROLL RESTORATION
  experimental: {
    scrollRestoration: true,
  },

  // ✅ CLEAN REDIRECT
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },
  
  // next.config.mjs
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap.xml",
      },
    ];
  }


};


export default nextConfig;
