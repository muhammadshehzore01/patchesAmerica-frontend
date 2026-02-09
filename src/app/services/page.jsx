// src/app/services/page.jsx
import ServicesPageClient from "./ServicesPageClient";
import BreadcrumbBar from "@/components/BreadcrumbBar";

export const metadata = {
  metadataBase: new URL("https://northernpatches.com"),
  title: "Custom Patch Services USA | Embroidered, PVC, Chenille & Leather | No Minimum",
  description:
    "Explore premium custom patch services in the USA – embroidered, PVC, chenille, woven & leather patches. No minimum order quantity, fast production, high-quality USA-made patches. Get your free quote today!",
  alternates: { canonical: "https://northernpatches.com/services" },
  openGraph: {
    title: "Custom Patch Services USA | Embroidered, PVC, Chenille & Leather | No Minimum",
    description:
      "Explore premium custom patch services in the USA – embroidered, PVC, chenille, woven & leather patches. No minimum order quantity, fast production, high-quality USA-made patches. Get your free quote today!",
    url: "https://northernpatches.com/services",
    images: ["/og-services.jpg"],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Patch Services USA | Embroidered, PVC, Chenille & Leather | No Minimum",
    description:
      "Explore premium custom patch services in the USA – embroidered, PVC, chenille, woven & leather patches. No minimum order quantity, fast production, high-quality USA-made patches. Get your free quote today!",
    images: ["/og-services.jpg"],
  },
  keywords:
    "custom patch services USA, embroidered patches USA, PVC patches no minimum, chenille patches USA, custom leather patches USA, woven patches no minimum, fast shipping custom patches USA, USA made patches",
  robots: "index, follow",
};

export default function ServicesPage() {
  return (
    <main className="relative z-10 min-h-screen bg-gradient-to-b from-brand-900 via-brand-800 to-brand-700 text-brand-50 overflow-x-hidden">
      <BreadcrumbBar current="Services" />
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
        <p className="text-xs sm:text-sm uppercase tracking-widest text-brand-300 font-semibold">
          Premium Custom Patch Services – USA
        </p>
        <h1 className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 leading-tight">
          Custom Patch Services USA – Embroidered, PVC, Chenille & Leather | No Minimum Order
        </h1>
        <p className="mt-5 sm:mt-6 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-brand-200 leading-relaxed">
          Order premium custom patches in the USA with **no minimum quantity**. Fast production, USA-made quality for embroidered, PVC, chenille, woven & leather patches. Free quote in minutes!
        </p>
      </section>
      <section className="relative z-10 pb-20 md:pb-32">
        <ServicesPageClient />
      </section>
    </main>
  );
}