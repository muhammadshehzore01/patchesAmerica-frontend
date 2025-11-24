// frontend/src/app/services/page.jsx
// frontend/src/app/services/page.jsx
import ServicesPageClient from "./ServicesPageClient";
import LuxuryOverlay from "@/components/LuxuryOverlay";
import GlowFade from "@/components/GlowFade";
import BreadcrumbBar from "@/components/BreadcrumbBar";

export const metadata = {
  metadataBase: new URL("https://northren-patches.au"),
  title: "Our Services | Northren-Patches USA",
  description:
    "Explore ultra-premium services by Northren-Patches USA — engineered with precision, trusted locally, and exported globally.",
  alternates: { canonical: "https://northren-patches.au/services" },
  openGraph: {
    title: "Our Services | Northren-Patches USA",
    description:
      "Explore custom-premium industrial and insulation services by Northren-Patches USA — built for performance and reliability.",
    url: "https://northren-patches.au/services",
    images: ["https://northren-patches.au/og-banner.jpg"],
  },
};

export default function ServicesPage() {
  return (
    <main className="relative text-white">
      <BreadcrumbBar current="Services" />

      {/* Background visual layers */}
      <LuxuryOverlay layers={[{ from: "from-white/10", via: "via-white/5", to: "to-transparent" }]} />
      <GlowFade layers={[{ from: "from-[#0033FF]/40", via: "via-[#0600AB]/20", to: "to-transparent", height: "h-64" }]} />

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 py-20 text-center relative z-10">
        <p className="text-sm uppercase tracking-wider text-brand-300 font-semibold">
          Our Premium Services
        </p>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-brand-500 to-brand-700">
          Ultra-Premium Services Across USA
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-gray-300 text-base md:text-lg">
          Tailored solutions for businesses in the United States — engineered, audited, and export-ready for maximum reliability.
        </p>
      </header>

      {/* Client-side interactivity via hook */}
      <ServicesPageClient />
    </main>
  );
}
