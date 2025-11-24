// next.config.mjs

const isDocker = process.env.DOCKER_ENV === "true";
const API_HOST = isDocker
  ? process.env.DOCKER_INTERNAL_API_HOST || "django_backend"
  : process.env.NEXT_PUBLIC_API_HOST || "127.0.0.1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: API_HOST,
        port: "8000", // Django daphne serves media/api on port 8001
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: API_HOST,
        port: "8000",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
