import HomePageClient from "./HomePageClient";

export const metadata = {
  title: "Northern Patches — Premium Custom Patches | USA Made & Fast Shipping",
  description: "Create high-quality custom embroidered, PVC, chenille, woven & leather patches. No minimums, fast US turnaround, premium materials for teams, brands & events.",
  keywords: "custom patches, embroidered patches, PVC patches, chenille patches, custom apparel patches, USA patches, morale patches, logo patches, military patches, team patches",
  robots: "index, follow",
  openGraph: {
    title: "Northern Patches — Premium Custom Patches",
    description: "Design your custom patches today – embroidered, PVC, chenille & more. Fast shipping across USA.",
    url: "https://northernpatches.com",
    images: ["/og-home.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Northern Patches — Premium Custom Patches",
    description: "Design your custom patches today – embroidered, PVC, chenille & more.",
    images: ["/og-home.jpg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Northern Patches",
      url: "https://northernpatches.com",
      logo: "https://northernpatches.com/logo.png",
    },
    {
      "@type": "WebSite",
      name: "Northern Patches",
      url: "https://northernpatches.com",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://northernpatches.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <HomePageClient />
    </>
  );
}