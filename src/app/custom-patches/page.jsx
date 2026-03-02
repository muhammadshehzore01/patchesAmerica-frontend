// src/app/custom-patches/page.jsx
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import AnimatedCard from "@/components/AnimatedCard";
import ServicesList from "@/app/services/ServicesList";
import { getServices, getUSStates } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: "Custom Patches USA – No Minimum | Northern Patches Official Manufacturer",
    description:
      "Order custom patches in the USA with no minimum. Embroidered, PVC, chenille, woven & Velcro patches. Fast production, wholesale pricing, and nationwide shipping.",
    alternates: { canonical: "https://northernpatches.com/custom-patches/" },
    openGraph: {
      title: "Custom Patches USA – Official Patch Maker | Northern Patches",
      description:
        "Premium custom patches with no minimum order. Trusted USA patch manufacturer.",
      url: "https://northernpatches.com/custom-patches/",
      type: "website",
    },
  };
}

// Helper: generate state slug
const slugify = (text) =>
  text?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

// ================================
// Generate content blocks
// ================================
function generatePageContent(states, services) {
  const intro = `Northern Patches USA provides premium custom patches across all 50 US states. Choose from embroidered, PVC, woven, chenille, leather, Velcro, and sublimation patches. Perfect for schools, clubs, businesses, events, or personal projects. No minimum order, fast USA production, and free digital proofs for 50+ patches.`;

  const benefits = [
    "No minimum order in the USA.",
    "Fast production & shipping nationwide.",
    "Durable stitching lasting 5–10+ years.",
    "Free digitizing for orders of 50+ patches.",
    "Multiple backing options – sew-on, iron-on, Velcro, adhesive.",
    "Custom designs allowed – logos, team, corporate, and personal patches.",
    "Premium threads and vibrant colors.",
  ];

  const applications = [
    "School & university patches.",
    "Corporate branding & promotional patches.",
    "Motorcycle & biker club patches.",
    "Event, festival, and team patches.",
    "Police, fire, and security uniform patches.",
    "Personalized patches for jackets, bags, and apparel.",
  ];

  const faqs = [
    {
      q: "Do you have a minimum order for patches?",
      a: "No, Northern Patches offers custom patches with zero minimum order.",
    },
    {
      q: "How fast is shipping across the USA?",
      a: "Standard 7–14 business days; rush 3–5 days available.",
    },
    {
      q: "What patch types are available?",
      a: "Embroidered, PVC, chenille, woven, leather, Velcro, sublimation, and iron-on patches.",
    },
    {
      q: "Can I order custom patches for events or teams?",
      a: "Yes – clubs, teams, schools, and corporate events are all welcome.",
    },
  ];

  const slides = [
    {
      image_url: "/slider1.jpg",
      title: "Custom Patches USA – Premium Quality",
      subtitle:
        "Embroidered, PVC, woven, chenille, leather, Velcro, and sublimation patches – made in the USA.",
      alt: "Custom patches USA",
      cta_text: "Request a Free Quote",
      badge_text: "No Minimum • Fast Shipping • Free Digitizing 50+",
    },
    {
      image_url: "/slider2.jpg",
      title: "Team, Club & Corporate Patches",
      subtitle:
        "Perfect for schools, businesses, clubs, and organizations across the USA.",
      alt: "Team patches USA",
      cta_text: "Order Your Patches Today",
      badge_text: "Rush Production 3–5 Days • Durable 5–10+ Years",
    },
  ];

  return { intro, benefits, applications, faqs, slides };
}

// ================================
// Page Component
// ================================
export default async function CustomPatchesPage() {
  const services = (await getServices()) || [];
  const states = (await getUSStates()) || [];

  const { intro, benefits, applications, faqs, slides } = generatePageContent(
    states,
    services
  );

  // JSON-LD structured data
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "Organization", name: "Northern Patches USA", url: "https://northernpatches.com", logo: "https://northernpatches.com/logo.png" },
    ...services.map((s, i) => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: s?.title || s?.name || `Service ${i + 1}`,
      description: s?.meta_description || `Premium custom patches USA.`,
      url: `https://northernpatches.com/services/${s?.slug || i}/`,
      provider: { "@type": "Organization", name: "Northern Patches USA", url: "https://northernpatches.com" },
      areaServed: { "@type": "Country", name: "United States" },
      serviceType: "Custom Patches",
    })),
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];

  return (
    <main className="bg-gray-900 text-white min-h-screen">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Slider */}
      <HeroSlider slides={slides} />

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Intro */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
          Custom Patches USA – No Minimum Order
        </h1>
        <p className="text-gray-300 text-lg mb-12 text-center">{intro}</p>

        {/* Popular Services */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Popular Custom Patches
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <AnimatedCard key={s?.slug || i}>{s?.title || s?.name || `Service ${i + 1}`}</AnimatedCard>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Why Choose Northern Patches
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <AnimatedCard key={i}>{b}</AnimatedCard>
            ))}
          </div>
        </section>

        {/* Applications */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Applications
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {applications.map((a, i) => (
              <AnimatedCard key={i}>{a}</AnimatedCard>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            FAQs
          </h2>
          <div className="space-y-6">
            {faqs.map((f, i) => (
              <AnimatedCard key={i} className="text-left">
                <h3 className="font-bold text-accent mb-2">{f.q}</h3>
                <p className="text-gray-300">{f.a}</p>
              </AnimatedCard>
            ))}
          </div>
        </section>

        {/* States */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Custom Patches in Every US State
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {states.map((state) => {
              const stateSlug = slugify(state.name);
              return (
                <div key={stateSlug} className="bg-gray-800 p-5 rounded-lg hover:border-cyan-500 border border-gray-700 transition">
                  <h3 className="text-xl font-semibold mb-2">{state.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {state.cities?.slice(0, 5).map((city) => {
                      const citySlug = slugify(city);
                      return (
                        <Link
                          key={citySlug}
                          href={`/custom-patches/${stateSlug}/${citySlug}`}
                          className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-cyan-600"
                        >
                          {city}
                        </Link>
                      );
                    })}
                  </div>
                  <Link
                    href={`/custom-patches/${stateSlug}`}
                    className="text-cyan-400 hover:underline text-sm"
                  >
                    View all cities in {state.name}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-16 mb-16">
          <Link
            href="/order"
            className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-6 md:px-16 md:py-6 rounded-lg shadow-2xl transition"
          >
            Get Custom Patches Now
          </Link>
        </div>

        {/* Services List */}
        <ServicesList services={services} showSearch={true} showJsonLd={true} enableAnimation={true} />
      </div>
    </main>
  );
}