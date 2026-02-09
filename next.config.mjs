/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Keep metadataBase – valid in Next.js 15 & fixes absolute URLs for OG/canonical tags
  metadataBase: new URL('https://northernpatches.com'),

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 390, 430, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 828, 1080],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days – excellent for media
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'northernpatches.com',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'www.northernpatches.com',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'django_backend',
        port: '8000',
        pathname: '/media/**',
      },
    ],
    // trailingSlash removed – invalid inside images object in Next.js 14+
  },

  output: 'standalone',

  experimental: {
    scrollRestoration: true,
    optimizePackageImports: ['framer-motion', 'swiper', 'lucide-react', 'react-icons'],
    // optimizeCss removed – deprecated
  },

  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  generateBuildId: async () => {
    return `build-${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}`;
  },

  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/services/custom-leather-patches', destination: '/services/leather-patch', permanent: true },
      { source: '/services/premium-leather-custom-patches-usa', destination: '/services/leather-patch', permanent: true },
      { source: '/services/woven-custom-patches', destination: '/services/wowen-patch', permanent: true },
      { source: '/services/high-quality-woven-custom-patches-usa', destination: '/services/wowen-patch', permanent: true },
      { source: '/blog/custom-patches-usa', destination: '/blog', permanent: true },
      { source: '/blog/custom-chenille-patches-usa-premium-varsity-style', destination: '/blog', permanent: true },
      { source: '/services/embroidery-patches', destination: '/services/custom-embroidery-patches', permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=60, stale-while-revalidate=300' }],
      },
      {
        source: '/sitemap.xml',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' }],
      },
      {
        source: '/media/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;