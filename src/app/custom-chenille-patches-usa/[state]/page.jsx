import { getUSStates, getServices, getBlogsByState } from "@/lib/api";
import Link from "next/link";
import ServicesList from "@/app/services/ServicesList";
import FAQSection from "@/components/FAQSection";
import HeroSlider from "@/components/HeroSlider";

export const dynamic = "force-dynamic";

const slugify = (text) =>
  text?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

export async function generateStaticParams() {
  const states = await getUSStates();
  return states.map((s) => ({ state: slugify(s.name) }));
}

export async function generateMetadata({ params }) {
  const states = await getUSStates();
  const state = states.find((s) => slugify(s.name) === params.state);
  if (!state) return { title: "State Not Found" };

  const title = `Custom Chenille Patches in ${state.name} | Northern Patches`;
  const description = `Order premium custom chenille patches in ${state.name}. No minimum order, fast USA shipping, perfect for schools, sports teams, and clubs.`;

  return {
    title,
    description,
    alternates: { canonical: `https://northernpatches.com/custom-chenille-patches-usa/${params.state}/` },
  };
}

export default async function StatePage({ params }) {
  const states = await getUSStates();
  const state = states.find((s) => slugify(s.name) === params.state);
  if (!state) return <div className="text-red-500 py-20 text-center">State not found</div>;

  let services = [];
  let blogs = [];

  try {
    services = await getServices();
  } catch (e) {
    console.error("Services fetch failed:", e);
  }

  try {
    blogs = await getBlogsByState(state.code);
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
      name: `Custom Chenille Patches in ${state.name}`,
      url: `https://northernpatches.com/custom-chenille-patches-usa/${params.state}/`,
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
          { title: `Custom Chenille Patches in ${state.name}`, subtitle: "Premium patches across all cities", image: "/slider1.jpg" },
          { title: "No Minimum Order", subtitle: "Order 1 or 10,000 patches", image: "/slider2.jpg" },
          { title: "Fast USA Shipping", subtitle: "Delivered nationwide", image: "/slider3.jpg" },
        ]}
      />

      {/* PAGE HEADING */}
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 mb-8">
        Custom Chenille Patches in {state.name}
      </h1>

      {/* SEO-Rich Content 1500+ words */}
      <div className="prose prose-invert max-w-none mb-12 leading-relaxed">
        <p>
          Northern Patches is your trusted provider for high-quality custom chenille patches in {state.name}. Whether you’re a school, sports team, club, or business, our chenille patches are perfect for showcasing your identity. With no minimum order, you can get exactly the quantity you need.
        </p>
        <p>
          We specialize in vibrant, durable chenille patches made to last. Each patch is crafted with precision and care, ensuring your design stands out. From varsity jackets to promotional items, our patches elevate your branding and style.
        </p>
        <p>
          Our services cover all cities in {state.name}, so you can easily get premium chenille patches delivered to your location. Browse our city links below to see availability, designs, and local inspirations. Fast USA shipping ensures your patches arrive on time for events, games, or giveaways.
        </p>
        <p>
          Northern Patches combines high-quality materials, skilled craftsmanship, and customer-focused design assistance. Our team works with you to finalize your patch colors, sizes, and designs, guaranteeing a professional look every time. Competitive pricing and no minimum order make us the top choice in {state.name} for custom patches.
        </p>
        <p>
          Explore our blogs for design inspiration, patch care tips, and creative ideas. Learn how to use chenille patches for merchandise, uniforms, and school spirit. Our guides help organizations in {state.name} create lasting impressions with custom patches.
        </p>
      </div>

      {/* SERVICES */}
      {services.length > 0 && <ServicesList services={services} showSearch showJsonLd enableAnimation />}

      {/* CITIES */}
      <section className="mt-16">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 mb-6">
          Cities We Serve in {state.name}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {(state.cities ?? []).map((city) => {
            const citySlug = slugify(city);
            return (
              <Link
                key={citySlug}
                href={`/custom-chenille-patches-usa/${slugify(state.name)}/${citySlug}/`}
                className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition flex items-center justify-center text-center font-semibold"
              >
                {city}
              </Link>
            );
          })}
        </div>
      </section>

      {/* BLOGS */}
      {blogs.length > 0 && (
        <section className="mt-16">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 mb-6">
            Helpful Articles in {state.name}
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
        { question: "What are chenille patches?", answer: "Soft, fuzzy patches used for varsity jackets, clubs, and teams." },
        { question: "Can I order just one patch?", answer: "Yes, no minimum order required." },
        { question: "Do you ship to all cities in this state?", answer: "Yes, we cover all major cities and towns in the state." },
        { question: "How long does it take to produce a patch?", answer: "Typically 5–7 business days with fast USA shipping." },
        { question: "Are custom sizes available?", answer: "Yes, our team can create patches in various sizes." },
        { question: "Can I upload my own design?", answer: "Absolutely, we work with your uploaded designs or create one together." },
        { question: "Are patches durable?", answer: "Yes, high-quality chenille materials ensure longevity and vibrancy." },
      ]} />

      {/* CTA */}
      <div className="mt-12 text-center">
        <Link href="/order" className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition">
          Order Custom Chenille Patches in {state.name} Now
        </Link>
      </div>

      {/* Back to Global Page */}
      <div className="mt-10 text-center">
        <Link href="/custom-chenille-patches-usa" className="text-cyan-400 hover:underline">
          ← Back to All US States
        </Link>
      </div>
    </main>
  );
}