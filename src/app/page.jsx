import HomePageClient from './HomePageClient';

export const metadata = {
  title: "Northren Patches — Custom Embroidered Patches (USA)",
  description:
    "Northren Patches — premium custom embroidered, PVC, and woven patches. Fast US shipping, quality manufacturing, bulk pricing for businesses.",
  alternates: { canonical: "https://northernpatches.com" },
  openGraph: {
    title: "Northren Patches — Custom Embroidered Patches (USA)",
    description:
      "Premium custom embroidered & PVC patches — designed and manufactured for US businesses and brands.",
    url: "https://northernpatches.com",
    images: ["https://northernpatches.com/og-home.jpg"],
  },
};

export default function HomePageWrapper() {
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Northren Patches",
        url: "https://northernpatches.com",
        logo: "https://northernpatches.com/logo.png",
      },
      {
        "@type": "WebSite",
        name: "Northren Patches",
        url: "https://northernpatches.com",
      },
    ],
  };

  return (
    <>
      <HomePageClient />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
