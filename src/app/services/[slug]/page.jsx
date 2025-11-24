// frontend\src\app\services\[slug]\page.jsx
'use client';

import { useService } from '@/hooks/useApiHooks';
import { useParams } from 'next/navigation';
import ServiceDetailClient from './ServiceDetailClient';
import LuxuryOverlay from '@/components/LuxuryOverlay';
import GlowFade from '@/components/GlowFade';
import Script from 'next/script';

export default function ServicePageClient() {
  const { slug } = useParams();
  const { service, isLoading, isError } = useService(slug);

  if (isLoading)
    return (
      <section className="py-24 text-center text-white text-lg">
        Loading service details...
      </section>
    );

  if (isError || !service)
    return (
      <section className="py-24 text-center text-red-400 text-lg">
        Service not found.
      </section>
    );

  // Ensure gallery array exists, fallback to main image
  const serviceForClient = {
    ...service,
    gallery:
      service.gallery?.length > 0
        ? service.gallery
        : service.image_url
        ? [{ url: service.image_url }]
        : [],
    image: service.image_url || '/default-service-image.jpg',
    image_alt: `${service.title} - Premium patch services in USA`,
  };

  // Structured Data JSON-LD
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
        "@type": "LocalBusiness",
        name: "Northren Patches",
        image: serviceForClient.image,
        "@id": "https://northernpatches.com",
        url: "https://northernpatches.com",
      },
      {
        "@type": "Service",
        name: serviceForClient.title,
        description: serviceForClient.description,
        url: `https://northernpatches.com/services/${slug}`,
        provider: {
          "@type": "Organization",
          name: "Northren Patches",
          url: "https://northernpatches.com",
        },
      },
    ],
  };

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      <Script id="canonical-tag" strategy="beforeInteractive">
        {`<link rel="canonical" href="https://northernpatches.com/services/${slug}" />`}
      </Script>

      <Script id="meta-description" strategy="beforeInteractive">
        {`<meta name="description" content="${serviceForClient.title} — Premium patch services offered by Northren Patches." />`}
      </Script>

      <Script type="application/ld+json" id="structured-data" strategy="afterInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      {/* Background Layers */}
      <LuxuryOverlay
        layers={[
          { from: 'from-white/5', via: 'via-transparent', to: 'to-transparent' },
          { from: 'from-[#0033FF]/10', via: 'via-[#0600AB]/5', to: 'to-transparent' },
        ]}
      />
      <GlowFade
        layers={[
          { from: 'from-[#0033FF]/30', via: 'via-[#0600AB]/15', to: 'to-transparent', height: 'h-64' },
        ]}
      />

      {/* Service Detail */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 md:px-12 py-20">
        <ServiceDetailClient service={serviceForClient} />
      </div>
    </main>
  );
}
