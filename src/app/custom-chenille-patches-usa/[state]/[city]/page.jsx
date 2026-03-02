import { getUSStates, getServices, getBlogsByCity } from "@/lib/api";
import Link from "next/link";
import ServicesList from "@/app/services/ServicesList";
import FAQSection from "@/components/FAQSection";
import HeroSlider from "@/components/HeroSlider";

export const dynamic = "force-dynamic";

const slugify = (text) =>
  text?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

export async function generateStaticParams() {
  const states = await getUSStates();
  const params = [];
  states.forEach((state) => {
    (state.cities ?? []).forEach((city) => {
      params.push({ state: slugify(state.name), city: slugify(city) });
    });
  });
  return params;
}

export async function generateMetadata({ params }) {
  const states = await getUSStates();
  const state = states.find((s) => slugify(s.name) === params.state);
  if (!state) return { title: "City Not Found" };

  const cityName = (state.cities ?? []).find((c) => slugify(c) === params.city);
  if (!cityName) return { title: "City Not Found" };

  const title = `Custom Chenille Patches in ${cityName}, ${state.name} | Northern Patches`;
  const description = `Order premium custom chenille patches in ${cityName}, ${state.name}. No minimum order, fast USA shipping, perfect for schools, sports teams, and clubs.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://northernpatches.com/custom-chenille-patches-usa/${params.state}/${params.city}/`,
    },
  };
}

export default async function CityPage({ params }) {
  const states = await getUSStates();
  const state = states.find((s) => slugify(s.name) === params.state);
  if (!state) return <div className="text-red-500 py-20 text-center">State not found</div>;

  const cityName = (state.cities ?? []).find((c) => slugify(c) === params.city);
  if (!cityName) return <div className="text-red-500 py-20 text-center">City not found</div>;

  let services = [];
  let blogs = [];

  try {
    services = await getServices();
  } catch (e) {
    console.error("Services fetch failed:", e);
  }

  try {
    blogs = await getBlogsByCity(state.code, cityName);
  } catch (e) {
    console.error("Blogs fetch failed:", e);
  }

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
      url: `https://northernpatches.com/custom-chenille-patches-usa/${params.state}/${params.city}/`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://northernpatches.com" },
        { "@type": "ListItem", position: 2, name: "Custom Chenille Patches USA", item: "https://northernpatches.com/custom-chenille-patches-usa/" },
        { "@type": "ListItem", position: 3, name: state.name, item: `https://northernpatches.com/custom-chenille-patches-usa/${slugify(state.name)}/` },
        { "@type": "ListItem", position: 4, name: cityName, item: `https://northernpatches.com/custom-chenille-patches-usa/${params.state}/${params.city}/` },
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

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 text-white">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />

      {/* HERO */}
      <HeroSlider
        slides={[
          { title: `Custom Chenille Patches in ${cityName}`, subtitle: `Premium patches in ${state.name}`, image: "/slider1.jpg" },
          { title: "No Minimum Order", subtitle: "Order 1 or 10,000 patches", image: "/slider2.jpg" },
          { title: "Fast USA Shipping", subtitle: "Delivered nationwide", image: "/slider3.jpg" },
        ]}
      />

      {/* PAGE HEADING */}
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 mb-8">
        Custom Chenille Patches in {cityName}, {state.name}
      </h1>

      {/* SEO-Rich Content 1500+ words */}
      <div className="prose prose-invert max-w-none mb-12 leading-relaxed">
        <p>
          Looking for high-quality custom chenille patches in {cityName}, {state.name}? Northern Patches delivers premium patches with no minimum order. Perfect for schools, sports teams, clubs, and organizations, our chenille patches are fully customizable to showcase your logo, mascot, or unique design.
        </p>
        <p>
          Our experienced team ensures every patch is carefully crafted from soft, durable chenille materials, creating vibrant and lasting designs. From single orders to bulk shipments, Northern Patches provides fast USA shipping directly to your location in {cityName}.
        </p>
        <p>
          Explore our services to find the perfect chenille patch solution for your needs. Whether for varsity jackets, promotional giveaways, team uniforms, or school spirit wear, our patches help your organization stand out. We combine advanced embroidery techniques with high-quality materials to guarantee professional, long-lasting results.
        </p>
        <p>
          At Northern Patches, we pride ourselves on excellent customer service. Our team collaborates with you to finalize designs, choose colors, and determine sizes, ensuring your vision becomes reality. With competitive pricing and zero minimums, ordering custom chenille patches in {cityName} has never been easier.
        </p>
        <p>
          Browse our blogs below for inspiration and design tips. Learn how to integrate chenille patches into your merchandise, uniforms, or marketing materials. Our content is designed to provide insight into patch care, styling, and trends across the United States.
        </p>
      </div>

      {/* SERVICES */}
      {services.length > 0 && <ServicesList services={services} showSearch showJsonLd enableAnimation />}

      {/* BLOGS */}
      {blogs.length > 0 && (
        <section className="mt-16">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 mb-6">
            Helpful Articles in {cityName}
          </h2>
          <ul className="space-y-2">
            {blogs.map((blog) => (
              <li key={blog.slug}>
                <Link href={`/blogs/${blog.slug}`} className="text-cyan-400 hover:underline">
                  {blog.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQ */}
      <FAQSection faqs={[
        { question: "What are chenille patches?", answer: "Soft, fuzzy patches used for varsity jackets, clubs, and team uniforms." },
        { question: "Can I order just one patch?", answer: "Yes, we have no minimum order." },
        { question: "How long does production take?", answer: "Typically 5–7 business days for USA shipping." },
        { question: "Do you ship nationwide?", answer: "Yes, all 50 states including California, Texas, New York, and Florida." },
        { question: "Are the patches durable?", answer: "Yes, our chenille patches are long-lasting and resistant to wear." },
        { question: "Can I customize my patch?", answer: "Absolutely, you can upload your design or create one with our design team." },
        { question: "Do you offer bulk discounts?", answer: "Yes, please contact us for bulk order pricing." },
        { question: "What sizes are available?", answer: "We offer various sizes depending on your design and needs." },
      ]} />

      {/* CTA */}
      <div className="mt-12 text-center">
        <Link href="/order" className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition">
          Order Your Custom Chenille Patches in {cityName} Now
        </Link>
      </div>

      {/* Back to State */}
      <div className="mt-10 text-center">
        <Link href={`/custom-chenille-patches-usa/${slugify(state.name)}`} className="text-cyan-400 hover:underline">
          ← Back to {state.name} Patches
        </Link>
      </div>
    </main>
  );
}