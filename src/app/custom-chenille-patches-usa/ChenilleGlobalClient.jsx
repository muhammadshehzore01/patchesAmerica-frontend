import { getUSStates, getServices, getBlogsByState } from "@/lib/api";
import Link from "next/link";
import ServicesList from "@/app/services/ServicesList";
import FAQSection from "@/components/FAQSection";
import HeroSlider from "@/components/HeroSlider";

export const dynamic = "force-dynamic";

export default async function ChenilleGlobalPage() {
  let states = [];
  let services = [];

  try {
    states = await getUSStates();
  } catch (e) {
    console.error("States fetch failed:", e);
  }

  try {
    services = await getServices();
  } catch (e) {
    console.error("Services fetch failed:", e);
  }

  // JSON-LD structured data
  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Northern Patches",
      url: "https://northernpatches.com",
      logo: "https://northernpatches.com/logo.png",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Custom Chenille Patches USA",
      url: "https://northernpatches.com/custom-chenille-patches-usa/",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://northernpatches.com" },
        { "@type": "ListItem", position: 2, name: "Custom Chenille Patches USA", item: "https://northernpatches.com/custom-chenille-patches-usa/" },
      ],
    },
    ...services.map((service) => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      url: `https://northernpatches.com/services/${service.slug}`,
      provider: { "@type": "Organization", name: "Northern Patches" },
      areaServed: { "@type": "Country", name: "USA" },
    })),
  ];

  const slugify = (text) =>
    text?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 text-white">

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />

      {/* HERO SLIDER */}
      <HeroSlider
        slides={[
          { title: "Custom Chenille Patches USA", subtitle: "Premium varsity chenille patches manufacturer", image: "/slider1.jpg" },
          { title: "No Minimum Order", subtitle: "Order 1 or 10,000 patches", image: "/slider2.jpg" },
          { title: "Fast USA Shipping", subtitle: "Delivered nationwide", image: "/slider3.jpg" },
        ]}
      />

      {/* PAGE HEADING */}
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 mb-8">
        Premium Custom Chenille Patches Across USA
      </h1>

      {/* SEO-rich content */}
      <div className="prose prose-invert max-w-none mb-12 leading-relaxed">
        <p>
          Northern Patches provides high-quality custom chenille patches for schools, sports teams, clubs, and organizations across the United States. Our premium chenille patches are fully customizable, allowing you to create unique designs that represent your brand, team, or school spirit. With no minimum order requirement and fast USA shipping, ordering your patches has never been easier.
        </p>
        <p>
          Each patch is carefully crafted using soft, durable chenille materials for a vibrant and lasting finish. Whether you need a single patch or thousands, we ensure every order is made to perfection. Explore our range of services and discover how Northern Patches can help your organization stand out with custom embroidered patches that truly make a statement.
        </p>
        <p>
          Browse our services and discover how we cater to every need—from varsity jackets to club merchandise, sports teams, and promotional giveaways. Our experienced team works closely with clients to bring your vision to life, ensuring high-quality, professional patches delivered right to your door anywhere in the USA.
        </p>
      </div>

      {/* SERVICES */}
      {services.length > 0 && (
        <ServicesList services={services} showSearch showJsonLd enableAnimation />
      )}

      {/* STATES AND CITIES */}
      <section className="mt-16">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 mb-10">
          Custom Chenille Patches Available in Every State
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {states.map((state) => (
            <div key={state.code} className="bg-gray-900 border border-gray-700 p-6 rounded-xl hover:border-cyan-400 transition">
              <h3 className="text-xl font-bold mb-3">{state.name}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {(state.cities ?? []).slice(0, 5).map((city) => (
                  <Link
                    key={city}
                    href={`/custom-chenille-patches-usa/${slugify(state.name)}/${slugify(city)}`}
                    className="bg-gray-800 hover:bg-cyan-600 px-3 py-1 rounded text-sm transition"
                  >
                    {city}
                  </Link>
                ))}
              </div>
              <Link
                href={`/custom-chenille-patches-usa/${slugify(state.name)}`}
                className="text-cyan-400 hover:underline"
              >
                View all cities →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <FAQSection faqs={[
        { question: "What are chenille patches?", answer: "Chenille patches are soft, fuzzy patches for varsity jackets, clubs, and teams." },
        { question: "Do you ship across USA?", answer: "Yes, we ship to all 50 states including California, Texas, Florida, and New York." },
        { question: "Is there a minimum order?", answer: "No minimum order required." },
        { question: "Can I customize my design?", answer: "Upload your design or work with our team for unique patches." },
        { question: "How long does shipping take?", answer: "Fast USA shipping, typically 5–7 business days." },
        { question: "Are the patches durable?", answer: "Yes, our chenille patches are designed to last for years." },
        { question: "Can I order for a school team?", answer: "Absolutely, we specialize in school, club, and team patches." },
        { question: "Do you offer bulk discounts?", answer: "Yes, contact us for bulk order pricing." },
      ]} />

      {/* CTA */}
      <div className="mt-12 text-center">
        <Link href="/order" className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition">
          Order Your Custom Patches Now
        </Link>
      </div>

    </main>
  );
}