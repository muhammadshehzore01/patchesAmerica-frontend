"use client";

import HeroSlider from "@/components/HeroSlider";
import ServicesList from "@/app/services/ServicesList";
import FAQSection from "@/components/FAQSection";
import Link from "next/link";

export default function CityClient({ state, cityName, services, blogs, slugify }) {
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
      name: `Custom Chenille Patches in ${cityName}, ${state.name}`,
      url: `https://northernpatches.com/custom-chenille-patches-usa/${slugify(state.name)}/${slugify(cityName)}/`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://northernpatches.com" },
        { "@type": "ListItem", position: 2, name: "Custom Chenille Patches USA", item: "https://northernpatches.com/custom-chenille-patches-usa/" },
        { "@type": "ListItem", position: 3, name: state.name, item: `https://northernpatches.com/custom-chenille-patches-usa/${slugify(state.name)}/` },
        { "@type": "ListItem", position: 4, name: cityName, item: `https://northernpatches.com/custom-chenille-patches-usa/${slugify(state.name)}/${slugify(cityName)}/` },
      ],
    },
    ...safeServices.map((service) => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      url: `https://northernpatches.com/services/${service.slug}`,
      provider: { "@type": "Organization", name: "Northern Patches" },
      areaServed: { "@type": "City", name: cityName },
    })),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />

      {/* Hero */}
      <HeroSlider slides={[
        { title: `${cityName} Chenille Patches`, subtitle: "Premium Custom Designs", image: "/slider1.jpg" },
        { title: "No Minimum Order", subtitle: "Order 1 or 10,000 patches", image: "/slider2.jpg" },
        { title: "Fast USA Shipping", subtitle: "Delivered across USA", image: "/slider3.jpg" },
      ]} />

      <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 drop-shadow-sm mb-6">
        Custom Chenille Patches in {cityName}, {state.name}
      </h1>

      <p className="text-gray-300 mb-8 leading-relaxed">
        Northern Patches offers high-quality chenille patches in {cityName}, {state.name}. Our custom patches are perfect for schools, sports teams, clubs, and organizations. No minimum order is required. We ensure fast USA shipping and premium designs that make your patches stand out. Whether you need one patch or thousands, our production process ensures top-quality craftsmanship. Choose Northern Patches for personalized designs that showcase your team's identity and pride. Our team of experts is ready to help you design the perfect chenille patches for any occasion or organization. We specialize in varsity letters, mascots, logos, and unique embroidery styles, making every patch a premium collectible.
      </p>

      {/* Services */}
      {safeServices.length > 0 && (
        <ServicesList
          services={safeServices}
          showSearch
          showJsonLd
          enableAnimation
        />
      )}

      {/* Blogs */}
      {safeBlogs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 drop-shadow-sm mb-6">
            Helpful Articles in {cityName}
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
        { question: "Do you ship to my city?", answer: `Yes, we ship to all cities including ${cityName}, ${state.name}, and nationwide.` },
        { question: "Minimum order?", answer: "No minimum order – get one patch or thousands." },
        { question: "How fast is shipping?", answer: "Fast USA shipping, typically within 5–7 business days." },
        { question: "Can I customize my design?", answer: "Yes, upload your own design or collaborate with our design team for a unique patch." },
        { question: "Are chenille patches durable?", answer: "Yes, made with high-quality materials to ensure long-lasting wear." },
      ]} />

      <div className="mt-12 text-center">
        <Link href="/order" className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition">
          Order Now
        </Link>
      </div>

      {/* SEO Content Placeholder 1500+ words */}
      <section className="mt-12 text-gray-300 leading-relaxed space-y-4">
        <p>
          Northern Patches in {cityName}, {state.name} is the trusted provider of premium custom chenille patches across the USA. Our patches are designed to meet the highest standards, offering vibrant colors, detailed embroidery, and long-lasting materials. Schools, sports teams, organizations, and clubs rely on us for custom designs that truly represent their identity.
        </p>
        <p>
          With over a decade of experience, our expert team ensures every patch is made with precision and care. We offer a wide variety of styles, including varsity letters, mascots, logos, and personalized text. Our easy-to-use ordering process and no minimum order policy make it simple for any team or group to get the perfect patch.
        </p>
        <p>
          Whether you're creating patches for athletic teams, school events, company branding, or special commemorative occasions, Northern Patches delivers unmatched quality and speed. Fast USA shipping guarantees your order arrives on time, and our customer service team is available to answer any questions.
        </p>
        <p>
          Our chenille patches are highly durable, suitable for jackets, hats, bags, and uniforms. They are ideal for displaying team pride, school spirit, or organizational identity. By choosing Northern Patches, you're investing in patches that not only look incredible but also withstand the test of time.
        </p>
        <p>
          Explore our gallery of services and related articles to get inspired. From design tips to care instructions, our content library helps you make the best decisions for your custom patches. Order today and experience the difference of Northern Patches in {cityName}, {state.name}.
        </p>
      </section>
    </>
  );
}