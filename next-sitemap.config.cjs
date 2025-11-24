/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://northren-patches.au',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/admin/*'],

  // Transform static pages
  transform: async (config, path) => ({
    loc: path,
    changefreq: 'weekly',
    priority: path.startsWith('/services') || path.startsWith('/blogs') ? 0.8 : 0.7,
    lastmod: new Date().toISOString(),
    alternateRefs: [
      { href: `${config.siteUrl}${path}`, hreflang: 'en' },
      { href: `${config.siteUrl}/us${path}`, hreflang: 'en-US' },
      { href: `${config.siteUrl}/au${path}`, hreflang: 'en-AU' },
    ],
  }),

  // Dynamic paths for services & blogs
  additionalPaths: async (config) => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api';

    const safeImage = (url, fallback) =>
      url && typeof url === 'string' && url.trim() !== '' ? `${config.siteUrl}${url}` : fallback ? `${config.siteUrl}${fallback}` : null;

    const makeImageObj = (url, title) => (url ? [{ url, caption: title || '', title: title || '' }] : []);

    // ----------------------
    // Services
    // ----------------------
    const services = await fetch(`${apiBase}/services/`)
      .then(r => r.json())
      .catch(() => []);
    const servicePaths = (services || [])
      .filter(s => s.slug)
      .map(s => {
        const imageUrl = safeImage(s.image_url || s.image, '/default-service-image.jpg');
        return {
          loc: `/services/${s.slug}`,
          lastmod: s.updated_at || new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.8,
          images: makeImageObj(imageUrl, s.title),
          alternateRefs: [
            { href: `${config.siteUrl}/services/${s.slug}`, hreflang: 'en' },
            { href: `${config.siteUrl}/us/services/${s.slug}`, hreflang: 'en-US' },
            { href: `${config.siteUrl}/au/services/${s.slug}`, hreflang: 'en-AU' },
          ],
        };
      });

    // ----------------------
    // Blogs
    // ----------------------
    const blogs = await fetch(`${apiBase}/blogs/`)
      .then(r => r.json())
      .catch(() => []);
    const blogPaths = (blogs || [])
      .filter(b => b.slug)
      .map(b => {
        const imageUrl = safeImage(b.cover_image_url || b.image, '/default-blog-image.jpg');
        return {
          loc: `/blogs/${b.slug}`,
          lastmod: b.updated_at || new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.8,
          images: makeImageObj(imageUrl, b.title),
          alternateRefs: [
            { href: `${config.siteUrl}/blogs/${b.slug}`, hreflang: 'en' },
            { href: `${config.siteUrl}/us/blogs/${b.slug}`, hreflang: 'en-US' },
            { href: `${config.siteUrl}/au/blogs/${b.slug}`, hreflang: 'en-AU' },
          ],
        };
      });

    return [...servicePaths, ...blogPaths];
  },
};
