// src/app/custom-patches/[state]/page.jsx
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import AnimatedCard from "@/components/AnimatedCard";
import ServicesList from "@/app/services/ServicesList";
import { getUSStates, getServices, getBlogsByState } from "@/lib/api";

export const dynamic = "force-dynamic";

// ========================================
// HELPERS
// ========================================
const slugify = (text) => text.toLowerCase().replace(/\s+/g, "-");

function generateStateContent(state, services, cities) {
  const intro = `Northern Patches proudly serves ${state.name} with premium custom patches. We provide embroidered, PVC, chenille, woven, and leather patches for schools, clubs, businesses, police, military, and personal projects. No minimum order and fast USA shipping.`;

  const benefits = [
    `No minimum order in ${state.name}.`,
    `Fast production & shipping across ${state.name}.`,
    `Durable stitching lasting 5–10+ years.`,
    `Free digitizing for orders of 50+ patches.`,
    `Multiple backing options – sew-on, iron-on, Velcro, adhesive.`,
    `Custom designs for logos, teams, schools, and corporate use.`,
    `Premium threads and vibrant colors.`,
  ];

  const applications = [
    `School & university patches in ${state.name}.`,
    `Corporate & promotional patches across ${state.name}.`,
    `Motorcycle & biker club patches.`,
    `Event, festival, and team patches in ${state.name}.`,
    `Police, fire, and security uniform patches.`,
    `Personalized patches for jackets, bags, and apparel.`,
  ];

  const faqs = [
    { q: `Do you have a minimum order in ${state.name}?`, a: "No, Northern Patches offers zero minimum order." },
    { q: `How fast is shipping across ${state.name}?`, a: "Standard 7–14 business days; rush 3–5 days available." },
    { q: `What patch types are available in ${state.name}?`, a: "Embroidered, PVC, chenille, woven, leather, Velcro, sublimation, and iron-on." },
    { q: `Can I order custom patches for events in ${state.name}?`, a: "Yes – for clubs, teams, schools, and corporate events." },
  ];

  const slides = [
    {
      image_url: "/slider1.jpg",
      title: `Custom Patches in ${state.name}`,
      subtitle: `High-quality embroidered, PVC, chenille, woven, leather, Velcro patches in ${state.name}.`,
      alt: `Custom patches ${state.name}`,
      cta_text: `Get Free Quote in ${state.name}`,
      badge_text: "No Minimum • Fast Shipping • Free Digitizing 50+",
    },
    {
      image_url: "/slider2.jpg",
      title: `Premium Team & Club Patches for ${state.name}`,
      subtitle: `Ideal for schools, businesses, and organizations in ${state.name}.`,
      alt: `Team & club patches ${state.name}`,
      cta_text: `Order Your Patches Today`,
      badge_text: "Rush Production 3–5 Days • Durable 5–10+ Years",
    },
  ];

  const cityLinks = cities.map((city) => {
    const citySlug = slugify(city);
    return (
      <Link
        key={citySlug}
        href={`/custom-patches/${slugify(state.name)}/${citySlug}`}
        className="underline text-accent"
      >
        {city}
      </Link>
    );
  });

  return { intro, benefits, applications, faqs, slides, cityLinks };
}

// ========================================
// STATIC PARAMS
// ========================================
export async function generateStaticParams() {
  const states = await getUSStates();
  return states.map((state) => ({ state: slugify(state.name) }));
}

// ========================================
// METADATA
// ========================================
export async function generateMetadata({ params }) {
  const states = await getUSStates();
  const state = states.find((s) => slugify(s.name) === params.state);
  if (!state) return { title: "State Not Found", robots: { index: false, follow: false } };

  const title = `Custom Patches in ${state.name} | No Minimum | Northern Patches USA`;
  const description = `Order custom patches in ${state.name}. Embroidered, PVC, chenille, woven, and leather patches with fast USA shipping. No minimum order required.`;
  const url = `https://northernpatches.com/custom-patches/${params.state}/`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

// ========================================
// PAGE COMPONENT
// ========================================
export default async function StatePage({ params }) {
  const states = await getUSStates();
  const state = states.find((s) => slugify(s.name) === params.state);
  if (!state) return <p className="text-center text-red-500 mt-20">State not found</p>;

  const services = (await getServices()) || [];
  const blogs = (await getBlogsByState(params.state)) || [];
  const cities = Array.isArray(state.cities) ? state.cities : [];

  const { intro, benefits, applications, faqs, slides, cityLinks } =
    generateStateContent(state, services, cities);

  // JSON-LD
  const jsonLd = [
    { "@context":"https://schema.org","@type":"Organization","name":"Northern Patches USA","url":"https://northernpatches.com","logo":"https://northernpatches.com/logo.png"},
    ...services.map((s,i)=>({
      "@context":"https://schema.org",
      "@type":"Service",
      name: s?.title || s?.name || `Service ${i+1}`,
      description: s?.meta_description || `Premium custom patches in ${state.name}`,
      url: `https://northernpatches.com/services/${s?.slug || i}/`,
      provider: { "@type":"Organization","name":"Northern Patches USA","url":"https://northernpatches.com"},
      areaServed: { "@type":"State","name":state.name},
      serviceType: "Custom Patches"
    })),
    { "@context":"https://schema.org","@type":"FAQPage","mainEntity":faqs.map(f=>({ "@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}))}
  ];

  return (
    <main className="bg-gray-900 text-white min-h-screen">

      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />

      {/* Hero Slider */}
      <HeroSlider slides={slides} />

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Intro */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
          Custom Patches in {state.name} – No Minimum
        </h1>
        <p className="text-gray-300 text-lg mb-12 text-center">{intro}</p>

        {/* Services */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Popular Patch Types in {state.name}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s,i)=>(
              <AnimatedCard key={s.slug || i}>{s.title || s.name}</AnimatedCard>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Why Choose Northern Patches in {state.name}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b,i)=><AnimatedCard key={i}>{b}</AnimatedCard>)}
          </div>
        </section>

        {/* Applications */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Applications in {state.name}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {applications.map((a,i)=><AnimatedCard key={i}>{a}</AnimatedCard>)}
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">FAQs – {state.name}</h2>
          <div className="space-y-6">
            {faqs.map((f,i)=>(
              <AnimatedCard key={i} className="text-left">
                <h3 className="font-bold text-accent mb-2">{f.q}</h3>
                <p className="text-gray-300">{f.a}</p>
              </AnimatedCard>
            ))}
          </div>
        </section>

        {/* City Links */}
        {cityLinks.length>0 && (
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Explore Cities in {state.name}
            </h2>
            <div className="flex flex-wrap justify-center gap-4 text-lg">
              {cityLinks}
            </div>
          </section>
        )}

        {/* Blogs */}
        {blogs.length>0 && (
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
              Helpful Articles for {state.name}
            </h2>
            <ul className="text-center space-y-2">
              {blogs.map(blog=>(
                <li key={blog.slug}>
                  <Link href={`/blogs/${blog.slug}`} className="text-cyan-400 hover:underline">
                    {blog.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CTA */}
        <div className="text-center mt-16 mb-16">
          <Link href="/order" className="btn-primary px-12 py-4 md:px-16 md:py-6 text-xl md:text-2xl shadow-2xl">
            Request Free Quote
          </Link>
        </div>

        <ServicesList services={services} showSearch={true} showJsonLd={true} enableAnimation={true} />
      </div>
    </main>
  );
}