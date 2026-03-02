// src/app/custom-patches/[state]/[city]/page.jsx
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import AnimatedCard from "@/components/AnimatedCard";
import ServicesList from "@/app/services/ServicesList";
import {
  getUSStates,
  getServices,
  getBlogsByCity,
} from "@/lib/api";

export const dynamic = "force-dynamic";

// =======================================
// SLUG HELPERS
// =======================================
const slugify = (text) => text.toLowerCase().replace(/\s+/g, "-");
const deslugify = (slug) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

// =======================================
// STATIC PARAMS
// =======================================
export async function generateStaticParams() {
  const states = await getUSStates();
  const params = [];

  states.forEach((state) => {
    state.cities?.forEach((city) => {
      params.push({
        state: slugify(state.name),
        city: slugify(city),
      });
    });
  });

  return params;
}

// =======================================
// METADATA
// =======================================
export async function generateMetadata({ params }) {
  const { state: stateSlug, city: citySlug } = params;
  const stateName = deslugify(stateSlug);
  const cityName = deslugify(citySlug);

  const title = `Custom Patches in ${cityName}, ${stateName} | Northern Patches USA`;
  const description = `Order custom patches in ${cityName}, ${stateName} with no minimum. Embroidered, PVC, chenille, woven, leather patches with fast USA shipping.`;
  const url = `https://northernpatches.com/custom-patches/${stateSlug}/${citySlug}/`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
  };
}

// =======================================
// CITY CONTENT GENERATOR
// =======================================
function generateCityContent(cityName, stateName, services, otherCities) {
  const intro = `Northern Patches proudly serves ${cityName}, ${stateName} with premium custom embroidered, PVC, chenille, woven, and leather patches. No minimum order, fast USA production, and nationwide shipping.`;

  const benefits = [
    `No minimum order in ${cityName}.`,
    `Fast production & shipping across ${stateName}.`,
    `Durable stitching lasting 5–10+ years.`,
    `Free digitizing for orders of 50+ patches.`,
    `Multiple backing options – sew-on, iron-on, Velcro, adhesive.`,
    `Custom designs for logos, teams, schools, and corporate use.`,
    `Premium threads and vibrant colors.`,
  ];

  const applications = [
    `School & university patches in ${cityName}.`,
    `Corporate & promotional patches across ${cityName}.`,
    `Motorcycle & biker club patches.`,
    `Event, festival, and team patches in ${cityName}.`,
    `Police, fire, and security uniform patches.`,
    `Personalized patches for jackets, bags, and apparel.`,
  ];

  const faqs = [
    { q: `Do you have a minimum order in ${cityName}?`, a: "No, Northern Patches offers zero minimum order." },
    { q: `How fast is shipping to ${cityName}?`, a: "Standard 7–14 business days; rush 3–5 days available." },
    { q: `What patch types are available in ${cityName}?`, a: "Embroidered, PVC, chenille, woven, leather, Velcro, sublimation, iron-on." },
    { q: `Can I order custom patches for events in ${cityName}?`, a: "Yes – for clubs, teams, schools, and corporate events." },
  ];

  const slides = [
    {
      image_url: "/slider1.jpg",
      title: `Custom Patches in ${cityName}`,
      subtitle: `High-quality embroidered, PVC, chenille, woven, leather, Velcro patches in ${cityName}, ${stateName}.`,
      alt: `Custom patches ${cityName}`,
      cta_text: `Get Free Quote in ${cityName}`,
      badge_text: "No Minimum • Fast USA Shipping • Free Digitizing 50+",
    },
    {
      image_url: "/slider2.jpg",
      title: `Premium Team & Club Patches for ${cityName}`,
      subtitle: `Perfect for schools, businesses, and organizations in ${cityName}.`,
      alt: `Team & club patches ${cityName}`,
      cta_text: `Order Your Patches Today`,
      badge_text: "Rush Production 3–5 Days • Durable 5–10+ Years",
    },
  ];

  const cityLinks = otherCities.map((city) => (
    <Link
      key={slugify(city)}
      href={`/${slugify(stateName)}/${slugify(city)}`}
      className="underline text-accent"
    >
      {city}
    </Link>
  ));

  return { intro, benefits, applications, faqs, slides, cityLinks };
}

// =======================================
// MAIN PAGE
// =======================================
export default async function CityPage({ params }) {
  const { state: stateSlug, city: citySlug } = params;

  const states = await getUSStates();
  const state = states.find((s) => slugify(s.name) === stateSlug);
  if (!state) return <p className="text-red-500 text-center mt-20">State not found</p>;

  const services = (await getServices()) || [];
  const blogs = (await getBlogsByCity(stateSlug, citySlug)) || [];

  const cityName = deslugify(citySlug);
  const stateName = state.name;

  const otherCities = state.cities.filter((c) => slugify(c) !== citySlug);

  const { intro, benefits, applications, faqs, slides, cityLinks } =
    generateCityContent(cityName, stateName, services, otherCities);

  // JSON-LD
  const jsonLd = [
    { "@context":"https://schema.org","@type":"Organization","name":"Northern Patches USA","url":"https://northernpatches.com","logo":"https://northernpatches.com/logo.png"},
    ...services.map((s,i)=>({
      "@context":"https://schema.org",
      "@type":"Service",
      name: s?.title || s?.name || `Service ${i+1}`,
      description: s?.meta_description || `Premium custom patches in ${cityName}, ${stateName}`,
      url: `https://northernpatches.com/services/${s?.slug || i}/`,
      provider: { "@type":"Organization","name":"Northern Patches USA","url":"https://northernpatches.com"},
      areaServed: { "@type":"City","name":cityName},
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

        {/* TITLE & Intro */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
          Custom Patches in {cityName}, {stateName} – No Minimum
        </h1>
        <p className="text-gray-300 text-lg mb-12 text-center">{intro}</p>

        {/* Services */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Popular Patch Types in {cityName}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s,i)=>(
              <AnimatedCard key={s.slug || i}>{s.title || s.name}</AnimatedCard>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Why Choose Northern Patches in {cityName}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b,i)=><AnimatedCard key={i}>{b}</AnimatedCard>)}
          </div>
        </section>

        {/* Applications */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Applications in {cityName}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {applications.map((a,i)=><AnimatedCard key={i}>{a}</AnimatedCard>)}
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            FAQs – {cityName}
          </h2>
          <div className="space-y-6">
            {faqs.map((f,i)=>(
              <AnimatedCard key={i} className="text-left">
                <h3 className="font-bold text-accent mb-2">{f.q}</h3>
                <p className="text-gray-300">{f.a}</p>
              </AnimatedCard>
            ))}
          </div>
        </section>

        {/* Other Cities */}
        {cityLinks.length>0 && (
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Explore Other Cities in {stateName}
            </h2>
            <div className="flex flex-wrap justify-center gap-4 text-lg">
              {cityLinks}
            </div>
          </section>
        )}

        {/* Blogs */}
        {blogs.length>0 && (
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              Helpful Articles for {cityName}
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