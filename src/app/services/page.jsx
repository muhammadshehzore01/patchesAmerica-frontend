import ServicesPageClient from "./ServicesPageClient";
import BreadcrumbBar from "@/components/BreadcrumbBar";

export const metadata = {
  metadataBase: new URL("https://northernpatches.com"),
  title: "Our Services | Northern Patches USA",
  description:
    "Explore ultra-premium custom patch services by Northern Patches USA including embroidered, PVC, chenille, and leather patches.",
  alternates: { canonical: "https://northernpatches.com/services" },
  openGraph: {
    title: "Our Services | Northern Patches USA",
    description:
      "Explore premium embroidered, PVC, chenille & leather patch services across the USA.",
    url: "https://northernpatches.com/services",
    images: ["https://northernpatches.com/og-banner.jpg"],
  },
};

export default function ServicesPage() {
  return (
    <main className="relative z-10 min-h-screen bg-gradient-to-b from-brand-900 via-brand-800 to-brand-700 text-brand-50 overflow-x-hidden">
      {/* Breadcrumb */}
      <BreadcrumbBar current="Services" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
        {/* Soft brand glows (theme safe) */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-brand-500/20 blur-[140px] -z-10" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-brand-400/15 blur-[160px] -z-10" />

        <p className="text-sm uppercase tracking-widest text-brand-300 font-semibold">
          Our Premium Services
        </p>

        <h1 className="mt-4 text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-brand-100 via-brand-300 to-brand-400 bg-clip-text text-transparent">
          Custom Patch Services
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-brand-200 text-base md:text-lg leading-relaxed">
          Expertly crafted custom patches designed for brands, teams, and
          businesses across the United States.
        </p>
      </section>

      {/* Services Grid */}
      <section className="relative z-10 pb-32">
        <ServicesPageClient />
      </section>
    </main>
  );
}
