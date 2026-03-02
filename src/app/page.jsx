// src/app/page.jsx
import HomePageClient from "./HomePageClient";

export async function generateMetadata() {
  const canonicalUrl = "https://northernpatches.com/";

  return {
    title: "Custom Patches USA | No Minimum Order & Fast Shipping | Northern Patches",
    description:
      "Premium custom embroidered patches USA, custom PVC patches no minimum, custom chenille patches, custom woven patches, custom leather patches for jackets, hats, bags, military, sports teams & businesses. Fast US shipping, high-quality USA-made.",
    keywords:
      "custom patches USA, custom embroidered patches USA, custom PVC patches no minimum, custom chenille patches, custom woven patches USA, custom leather patches no minimum, custom patches for jackets USA, custom military patches, custom sports team patches USA, fast shipping patches USA, no minimum custom patches, patches for hats USA, custom patches for bags USA",
    robots: "index, follow",
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: "Northern Patches America – Custom Patches USA | No Minimum",
      description:
        "Design premium custom embroidered, PVC, chenille, woven & leather patches. No minimum order, fast USA production & shipping. Free quote today!",
      url: canonicalUrl,
      siteName: "Northern Patches",
      images: [
        { url: "/og-home.jpg", width: 1200, height: 630, alt: "Custom patches gallery – Northern Patches USA" },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Northern Patches America – Custom Patches USA",
      description:
        "Premium custom patches: embroidered, PVC, chenille & more. No minimum, fast US shipping.",
      images: ["/og-home.jpg"],
    },
  };
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Northern Patches America",
      url: "https://northernpatches.com/",
      logo: { "@type": "ImageObject", url: "https://northernpatches.com/logo.png" },
      sameAs: [
        "https://www.facebook.com/northernpatches",
        "https://www.instagram.com/northernpatches",
        "https://twitter.com/northernpatches",
      ],
    },
    {
      "@type": "WebSite",
      name: "Northern Patches America",
      url: "https://northernpatches.com/",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: "https://northernpatches.com/search?q={search_term_string}" },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "LocalBusiness",
      name: "Northern Patches America",
      url: "https://northernpatches.com/",
      telephone: "+1-800-123-4567",
      address: {
        "@type": "PostalAddress",
        streetAddress: "123 Patch Lane",
        addressLocality: "New York",
        addressRegion: "NY",
        postalCode: "10001",
        addressCountry: "US",
      },
    },
    {
      "@type": "ItemList",
      name: "Featured Custom Patch Services USA",
      itemListElement: [],
    },
  ],
};

export default function Home() {
  return (
    <>
      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {/* Preconnects */}
      <link rel="preconnect" href="https://northernpatches.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />

      {/* Home Page Client */}
      <HomePageClient />
    </>
  );
}