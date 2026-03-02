"use client";

import HeroSlider from "@/components/HeroSlider";
import ServicesList from "@/app/services/ServicesList";
import FAQSection from "@/components/FAQSection";
import Link from "next/link";

export default function StateClient({ state, services, blogs, slugify }) {
  const safeServices = Array.isArray(services) ? services : [];
  const safeBlogs = Array.isArray(blogs) ? blogs : [];

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
      name: `Custom Chenille Patches in ${state.name}`,
      url: `https://northernpatches.com/custom-chenille-patches-usa/${slugify(state.name)}/`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://northernpatches.com" },
        { "@type": "ListItem", position: 2, name: "Custom Chenille Patches USA", item: "https://northernpatches.com/custom-chenille-patches-usa/" },
        { "@type": "ListItem", position: 3, name: state.name, item: `https://northernpatches.com/custom-chenille-patches-usa/${slugify(state.name)}/` },
      ],
    },
    ...safeServices.map((service) => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      url: `https://northernpatches.com/services/${service.slug}`,
      provider: { "@type": "Organization", name: "Northern Patches" },
      areaServed: { "@type": "State", name: state.name },
    })),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />

      {/* Hero */}
      <HeroSlider slides={[
        { title: `${state.name} Chenille Patches`, subtitle: "Premium Custom Designs", image: "/slider1.jpg" },
        { title: "No Minimum Order", subtitle: "Order 1 or 10,000 patches", image: "/slider2.jpg" },
        { title: "Fast USA Shipping", subtitle: "Delivered across USA", image: "/slider3.jpg" },
      ]} />

      <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 drop-shadow-sm mb-6">
        Custom Chenille Patches in {state.name}
      </h1>

      <p className="text-gray-300 mb-8 leading-relaxed">
        Northern Patches delivers top-quality custom chenille patches across {state.name}. Perfect for schools, sports teams, clubs, and organizations. Fast USA shipping and no minimum order make it simple to get your custom patches.
      </p>

      {/* Cities */}
      <section className="mt-12">
        <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 drop-shadow-sm mb-6">
          Cities in {state.name}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {state.cities?.map((city) => (
            <Link
              key={city}
              href={`/custom-chenille-patches-usa/${slugify(state.name)}/${slugify(city)}`}
              className="bg-gray-900 p-4 rounded hover:bg-gray-700 text-white transition"
            >
              {city}
            </Link>
          ))}
        </div>
      </section>

      {/* Services */}
      {safeServices.length > 0 && (
        <ServicesList services={safeServices} showSearch showJsonLd enableAnimation />
      )}

      {/* Blogs */}
      {safeBlogs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 drop-shadow-sm mb-6">
            Helpful Articles in {state.name}
          </h2>
          <ul className="space-y-2">
            {safeBlogs.map((blog) => (
              <li key={blog.slug}>
                <Link href={`/blogs/${blog.slug}`} className="text-cyan-400 hover:underline">{blog.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQs */}
      <FAQSection faqs={[
        { question: "What are chenille patches?", answer: "Soft, fuzzy patches for varsity jackets, clubs, and teams." },
        { question: "Do you ship across the state?", answer: "Yes, we ship to all cities within the state and nationwide." },
        { question: "Minimum order?", answer: "No minimum order – get one patch or thousands." },
        { question: "Can I customize my design?", answer: "Upload your own design or collaborate with our team for unique patches." },
        { question: "Shipping time?", answer: "Fast USA shipping, typically within 5–7 business days." },
      ]} />

      {/* CTA */}
      <div className="mt-12 text-center">
        <Link href="/order" className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition">
          Order Now
        </Link>
      </div>
    </>
  );
}